import React, { useState, useEffect } from 'react';
import { Store } from 'react-notifications-component';
import { 
  FaCheck, FaTimes, FaLock, FaLockOpen, FaCalendarAlt, FaCameraRetro, FaEye, FaExclamationTriangle 
} from 'react-icons/fa';
import api from '../../services/api';
import './styles/adminAgendamentos.css';

const AdminAgendamentos = () => {
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalComprovante, setModalComprovante] = useState({ show: false, url: '' });

  useEffect(() => {
    carregarAgendamentos();
  }, []);

  const carregarAgendamentos = async () => {
    try {
      const res = await api.get('/agendamentos');
      setAgendamentos(res.data);
    } catch (err) {
      Store.addNotification({ title: "Erro", message: "Falha ao buscar a agenda.", type: "danger", container: "top-right", dismiss: { duration: 3000 } });
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http') || url.startsWith('blob')) return url;
    const baseURL = api.defaults.baseURL || 'http://localhost:3000';
    return `${baseURL.replace(/\/$/, '')}/${url.replace(/^\//, '')}`;
  };

  const alterarStatus = async (id, novoStatus, acaoNome) => {
    if (!window.confirm(`Tem certeza que deseja ${acaoNome} este horário?`)) return;

    try {
      await api.put(`/agendamentos/${id}/status`, { status: novoStatus });
      Store.addNotification({ 
        title: "Sucesso!", 
        message: `Status atualizado para ${novoStatus}.`, 
        type: "success", container: "top-right", dismiss: { duration: 3000 } 
      });
      carregarAgendamentos();
    } catch (err) {
      Store.addNotification({ title: "Erro", message: "Não foi possível atualizar.", type: "danger", container: "top-right", dismiss: { duration: 3000 } });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const abrirComprovante = (url) => {
    Store.addNotification({
        title: "Atenção Admin",
        message: "Verifique o valor e a data do comprovante antes de aprovar.",
        type: "warning",
        container: "top-right",
        dismiss: { duration: 5000 }
    });
    setModalComprovante({ show: true, url });
  };

  const fecharComprovante = () => {
    setModalComprovante({ show: false, url: '' });
  };

  return (
    <div className="admin-page-container fade-in" translate="no">
      <div className="admin-header-row">
        <div className="header-text">
          <h2 className="admin-title">Gerenciar Agenda</h2>
          <p className="admin-subtitle">Aprove, cancele ou desbloqueie horários do estúdio.</p>
        </div>
      </div>

      <div className="table-card">
        <div className="table-responsive-wrapper">
          <table className="vetra-table">
            <thead>
              <tr>
                <th width="60">ID</th>
                <th>Cliente / Motivo</th>
                <th>Cenário</th>
                <th>Data e Hora</th>
                <th>Status</th>
                <th align="right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="text-center">Carregando agenda...</td></tr>
              ) : agendamentos.length === 0 ? (
                <tr><td colSpan="6" className="text-center empty-state">Nenhum registro encontrado.</td></tr>
              ) : (
                agendamentos.map(ag => {
                  const isBloqueio = ag.status === 'BLOQUEADO';
                  const urlDoComprovante = ag.comprovante_url || ag.comprovante;
                  
                  return (
                  <tr key={ag.id} className={isBloqueio ? 'row-bloqueado' : ''}>
                    <td className="id-cell">#{ag.id}</td>
                    
                    <td>
                      <div className="client-info">
                          {isBloqueio ? (
                              <><FaLock className="lock-icon"/> <strong>Bloqueio Admin</strong></>
                          ) : (
                              <strong>
                                {ag.usuario_nome}
                                {urlDoComprovante && ag.status === 'PENDENTE' && (
                                  <span className="alert-text"><FaExclamationTriangle /> Validar Pix</span>
                                )}
                              </strong>
                          )}
                          <small>{ag.metodo_pagamento === 'BLOQUEIO_ADMIN' ? 'Fechado para clientes' : `Pagamento: ${ag.metodo_pagamento}`}</small>
                      </div>
                    </td>

                    <td>
                      <div className="space-cell">
                          {ag.espaco_imagem_url ? (
                              <img src={getImageUrl(ag.espaco_imagem_url)} alt={ag.espaco_nome} className="space-tiny-thumb" />
                          ) : (
                              <div className="space-tiny-thumb placeholder"><FaCameraRetro /></div>
                          )}
                          <span className="space-badge">{ag.espaco_nome}</span>
                      </div>
                    </td>
                    
                    <td>
                      <div className="date-cell">
                          <FaCalendarAlt className="mini-icon"/> {formatDate(ag.data_inicio)}
                      </div>
                    </td>
                    
                    <td>
                      <span className={`status-badge ${ag.status.toLowerCase()}`}>
                          {ag.status}
                      </span>
                    </td>

                    <td align="right">
                      <div className="action-buttons">
                          
                          {urlDoComprovante && (
                              <div className="btn-comprovante-wrapper">
                                <button className="action-btn view-receipt" onClick={() => abrirComprovante(urlDoComprovante)} title="Ver Comprovante">
                                    <FaEye />
                                </button>
                                {ag.status === 'PENDENTE' && <span className="alert-dot"></span>}
                              </div>
                          )}

                          {ag.status === 'PENDENTE' && (
                              <>
                                  <button className="action-btn success" onClick={() => alterarStatus(ag.id, 'CONFIRMADO', 'APROVAR')} title="Aprovar"><FaCheck /></button>
                                  <button className="action-btn danger" onClick={() => alterarStatus(ag.id, 'CANCELADO', 'REJEITAR')} title="Rejeitar"><FaTimes /></button>
                              </>
                          )}
                          {ag.status === 'CONFIRMADO' && (
                              <button className="action-btn danger" onClick={() => alterarStatus(ag.id, 'CANCELADO', 'CANCELAR')} title="Cancelar Reserva"><FaTimes /></button>
                          )}
                          {isBloqueio && (
                              <button className="action-btn warning" onClick={() => alterarStatus(ag.id, 'CANCELADO', 'DESBLOQUEAR')} title="Desbloquear Horário"><FaLockOpen /></button>
                          )}
                      </div>
                    </td>
                  </tr>
                )})
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalComprovante.show && (
        <div className="modal-overlay fade-in" onClick={fecharComprovante}>
          <div className="receipt-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn-dark" onClick={fecharComprovante}><FaTimes /></button>
            <h3>Comprovante de Pagamento</h3>
            <p>Confira os dados antes de aprovar a reserva.</p>
            <div className="receipt-img-container">
              <img src={getImageUrl(modalComprovante.url)} alt="Comprovante Pix" onError={(e) => { e.target.src = 'https://via.placeholder.com/400x500?text=Erro+ao+carregar+imagem'; }} />
            </div>
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <a href={getImageUrl(modalComprovante.url)} target="_blank" rel="noopener noreferrer" className="btn-download-receipt">
                    Abrir em tela cheia
                </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAgendamentos;