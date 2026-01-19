import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { format } from 'date-fns';
import { FaEye, FaCreditCard, FaMoneyBillWave } from 'react-icons/fa';
import { Store } from 'react-notifications-component'; // Import para notificações

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

  // --- FUNÇÃO PARA TROCAR O STATUS ---
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

          // Atualiza a lista na hora sem precisar recarregar a página
          setAgendamentos(prev => prev.map(ag => 
              ag.id === id ? { ...ag, status: novoStatus } : ag
          ));

      } catch (error) {
          alert("Erro ao atualizar status");
      }
  };

  // Estilo dinâmico para o Dropdown
  const getStatusColor = (status) => {
      if (status === 'CONFIRMADO') return '#d4edda'; // Fundo Verde claro
      if (status === 'CANCELADO') return '#f8d7da'; // Fundo Vermelho claro
      return '#fff3cd'; // Fundo Amarelo (Pendente)
  };

  return (
    <div>
      <div className="admin-header">
        <h2 className="admin-title">Agenda Global</h2>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>#ID</th>
            <th>Cliente</th>
            <th>Data/Hora</th>
            <th>Espaço</th>
            <th>Pagamento</th>
            <th style={{ textAlign: 'center' }}>Comprovante</th>
            <th>Valor</th>
            <th>Status (Alterar)</th>
          </tr>
        </thead>
        <tbody>
          {agendamentos.map(ag => (
            <tr key={ag.id}>
              <td>#{ag.id}</td>

              <td>
                <strong>{ag.usuario_nome}</strong>
              </td>

              <td>
                {format(new Date(ag.data_inicio), 'dd/MM/yyyy')}<br />
                <small style={{ color: '#666' }}>
                  {format(new Date(ag.data_inicio), 'HH:mm')} - {format(new Date(ag.data_fim), 'HH:mm')}
                </small>
              </td>

              <td>{ag.espaco_nome}</td>

              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.85rem' }}>
                  {ag.metodo_pagamento === 'PIX' ? (
                    <> <FaMoneyBillWave style={{ color: '#27ae60' }} /> PIX </>
                  ) : (
                    <> <FaCreditCard style={{ color: '#2C2420' }} /> {ag.metodo_pagamento} </>
                  )}
                </div>
              </td>

              <td style={{ textAlign: 'center' }}>
                {(() => {
                    if (ag.metodo_pagamento !== 'PIX') return <span style={{ color: '#ccc' }}>-</span>;
                    if (!ag.comprovante_url) return <span style={{ color: 'red', fontSize: '0.7rem' }}>SEM ARQUIVO</span>;
                    
                    return (
                        <a
                            href={getComprovanteUrl(ag.comprovante_url)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-view-file"
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: '5px',
                                padding: '5px 10px', background: '#D4AF6E', color: '#fff',
                                borderRadius: '4px', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 'bold'
                            }}
                        >
                            <FaEye /> Abrir
                        </a>
                    );
                })()}
              </td>

              <td>
                <strong>R$ {parseFloat(ag.preco_total).toFixed(2).replace('.', ',')}</strong>
              </td>

              {/* COLUNA DE STATUS COM SELECT */}
              <td>
                <select 
                    value={ag.status} 
                    onChange={(e) => handleStatusChange(ag.id, e.target.value)}
                    style={{
                        padding: '5px',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                        backgroundColor: getStatusColor(ag.status),
                        fontWeight: 'bold',
                        color: '#333',
                        cursor: 'pointer'
                    }}
                >
                    <option value="PENDENTE">PENDENTE</option>
                    <option value="CONFIRMADO">CONFIRMADO</option>
                    <option value="CANCELADO">CANCELADO</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminAgenda;