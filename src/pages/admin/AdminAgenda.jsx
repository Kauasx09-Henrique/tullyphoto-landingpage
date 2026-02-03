import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { format } from 'date-fns';
import { FaEye, FaCreditCard, FaMoneyBillWave, FaCalendarAlt, FaClock } from 'react-icons/fa';
import { Store } from 'react-notifications-component';
import '../../styles/adminAgenda.css'; // Importando o novo CSS

const AdminAgenda = () => {
  const [agendamentos, setAgendamentos] = useState([]);

  useEffect(() => {
    carregarAgenda();
  }, []);

  const carregarAgenda = () => {
    api.get('/agendamentos')
      .then(res => setAgendamentos(res.data))
      .catch(err => console.error("Erro ao buscar agendamentos:", err));
  };

  const getComprovanteUrl = (caminho) => {
    if (!caminho) return '#';
    const nomeArquivo = caminho.split(/[\\/]/).pop();
    return `http://localhost:3000/uploads/${nomeArquivo}`;
  };

  const handleStatusChange = async (id, novoStatus) => {
      try {
          await api.put(`/agendamentos/${id}`, { status: novoStatus });
          
          Store.addNotification({
              title: "Atualizado!",
              message: `Status alterado para ${novoStatus}`,
              type: "success",
              insert: "top",
              container: "top-right",
              dismiss: { duration: 3000 }
          });

          setAgendamentos(prev => prev.map(ag => 
              ag.id === id ? { ...ag, status: novoStatus } : ag
          ));

      } catch (error) {
          Store.addNotification({
              title: "Erro",
              message: "Falha ao atualizar status",
              type: "danger",
              container: "top-right",
              dismiss: { duration: 3000 }
          });
      }
  };

  // Helper para classe CSS do status
  const getStatusClass = (status) => {
      if (status === 'CONFIRMADO') return 'status-confirmed';
      if (status === 'CANCELADO') return 'status-cancelled';
      return 'status-pending';
  };

  return (
    <div className="admin-page-container fade-in">
      <div className="admin-header-row">
        <h2 className="admin-title">Agenda Global</h2>
        <span className="admin-subtitle">Gerenciamento de todas as reservas</span>
      </div>

      <div className="table-container">
        <table className="vetra-table">
          <thead>
            <tr>
              <th>#ID</th>
              <th>Cliente</th>
              <th>Data & Hora</th>
              <th>Espaço</th>
              <th>Pagamento</th>
              <th align="center">Comprovante</th>
              <th>Valor</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {agendamentos.length === 0 ? (
                <tr><td colSpan="8" className="text-center">Nenhum agendamento encontrado.</td></tr>
            ) : agendamentos.map(ag => (
              <tr key={ag.id}>
                <td className="id-cell">#{ag.id}</td>

                <td>
                  <div className="client-info">
                      <div className="client-avatar">
                          {ag.usuario_nome ? ag.usuario_nome.substring(0,2).toUpperCase() : 'CL'}
                      </div>
                      <strong>{ag.usuario_nome}</strong>
                  </div>
                </td>

                <td>
                  <div className="date-time-cell">
                    <span className="date-text">
                        <FaCalendarAlt className="icon-tiny"/> {format(new Date(ag.data_inicio), 'dd/MM/yyyy')}
                    </span>
                    <span className="time-text">
                        <FaClock className="icon-tiny"/> {format(new Date(ag.data_inicio), 'HH:mm')} - {format(new Date(ag.data_fim), 'HH:mm')}
                    </span>
                  </div>
                </td>

                <td className="space-cell">{ag.espaco_nome}</td>

                <td>
                  <div className={`payment-badge ${ag.metodo_pagamento === 'PIX' ? 'pix' : 'card'}`}>
                    {ag.metodo_pagamento === 'PIX' ? <FaMoneyBillWave /> : <FaCreditCard />}
                    {ag.metodo_pagamento}
                  </div>
                </td>

                <td align="center">
                  {ag.metodo_pagamento === 'PIX' && ag.comprovante_url ? (
                    <a
                      href={getComprovanteUrl(ag.comprovante_url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-view-file"
                      title="Ver Comprovante"
                    >
                      <FaEye /> Abrir
                    </a>
                  ) : (
                    <span className="no-file">-</span>
                  )}
                </td>

                <td className="price-cell">
                  R$ {parseFloat(ag.preco_total).toFixed(2).replace('.', ',')}
                </td>

                <td>
                  <div className="select-wrapper">
                    <select 
                        value={ag.status} 
                        onChange={(e) => handleStatusChange(ag.id, e.target.value)}
                        className={`status-select ${getStatusClass(ag.status)}`}
                    >
                        <option value="PENDENTE">PENDENTE</option>
                        <option value="CONFIRMADO">CONFIRMADO</option>
                        <option value="CANCELADO">CANCELADO</option>
                    </select>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAgenda;