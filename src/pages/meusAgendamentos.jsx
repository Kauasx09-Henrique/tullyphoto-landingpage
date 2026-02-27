import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Store } from 'react-notifications-component';
import { 
  FaCalendarAlt, FaClock, FaMapMarkerAlt, FaQrcode, 
  FaCreditCard, FaBarcode, FaCheckCircle, FaTimesCircle, 
  FaArrowLeft, FaTicketAlt, FaInfoCircle
} from 'react-icons/fa';
import api from '../services/api';
import '../styles/meusAgendamentos.css';

const MeusAgendamentos = () => {
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarMeusAgendamentos();
  }, []);

  const carregarMeusAgendamentos = async () => {
    try {
      const res = await api.get('/agendamentos');
      setAgendamentos(res.data);
    } catch (err) {
      Store.addNotification({ 
        title: "Erro", message: "Falha ao carregar suas sessões.", 
        type: "danger", container: "top-right", dismiss: { duration: 3000 } 
      });
    } finally {
      setLoading(false);
    }
  };

  const cancelarAgendamento = async (id, metodoPagamento) => {
    if (!window.confirm('Deseja realmente solicitar o cancelamento/reagendamento desta sessão?')) return;

    try {
      const acao = metodoPagamento === 'PIX' ? 'REAGENDAR' : 'CANCELAR';
      await api.put(`/agendamentos/${id}/cancelar`, { acao });
      
      Store.addNotification({ 
        title: "Sucesso", message: "Solicitação processada com sucesso.", 
        type: "success", container: "top-right", dismiss: { duration: 4000 } 
      });
      carregarMeusAgendamentos();
    } catch (err) {
      Store.addNotification({ 
        title: "Atenção", message: err.response?.data?.msg || "Erro ao processar solicitação.", 
        type: "warning", container: "top-right", dismiss: { duration: 4000 } 
      });
    }
  };

  const getMetodoIcon = (metodo) => {
    switch (metodo) {
      case 'PIX': return <FaQrcode />;
      case 'CREDITO': return <FaCreditCard />;
      case 'DEBITO': return <FaBarcode />;
      default: return <FaCreditCard />;
    }
  };

  const formatarPreco = (valor) => {
    let num = parseFloat(valor);
    if (isNaN(num)) return 'R$ 0,00';
    // Correção de segurança para valores inflados
    if (num > 10000) num = num / 100;
    return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className="my-bookings-page fade-in" translate="no">
      <div className="top-navigation">
        <Link to="/" className="back-link"><FaArrowLeft /> <span>Painel Principal</span></Link>
      </div>

      <header className="bookings-header">
        <span className="premium-label">Vetra Studio Exclusive</span>
        <h1 className="bookings-title">Meus Ingressos</h1>
        <div className="title-underline"></div>
        <p className="bookings-subtitle">Gerencie suas sessões fotográficas e detalhes de reserva</p>
      </header>

      {loading ? (
        <div className="loading-state">
            <div className="luxury-loader"></div>
            <p>Sincronizando sua agenda...</p>
        </div>
      ) : agendamentos.length === 0 ? (
        <div className="empty-bookings">
          <div className="empty-art"><FaTicketAlt /></div>
          <h3>Nenhum ingresso ativo</h3>
          <p>Você ainda não possui sessões agendadas no momento.</p>
          <Link to="/agendamento" className="book-now-btn">Agendar Sessão</Link>
        </div>
      ) : (
        <div className="tickets-container">
          {agendamentos.map(ag => (
            <div key={ag.id} className={`vetra-ticket-card ${ag.status.toLowerCase()}`}>
              <div className="ticket-edge-status"></div>
              
              <div className="ticket-body">
                <div className="ticket-head">
                  <span className={`status-pill ${ag.status}`}>
                    {ag.status === 'REAGENDAMENTO_SOLICITADO' ? 'Reagendamento' : ag.status}
                  </span>
                  <span className="id-tag">REF: {String(ag.id).padStart(4, '0')}</span>
                </div>

                <div className="ticket-info-main">
                  <h3 className="studio-brand">{ag.espaco_nome?.toUpperCase() || 'ESTÚDIO VETRA'}</h3>
                  <p className="location-info"><FaMapMarkerAlt /> Brasília, DF - Unidade Premium</p>

                  <div className="info-grid">
                    <div className="info-item">
                      <span className="info-label"><FaCalendarAlt /> Data</span>
                      <span className="info-data">{new Date(ag.data_inicio).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label"><FaClock /> Período</span>
                      <span className="info-data">
                        {new Date(ag.data_inicio).toLocaleTimeString('pt-BR', {hour:'2-digit', minute:'2-digit'})} 
                        { " — " }
                        {new Date(ag.data_fim).toLocaleTimeString('pt-BR', {hour:'2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                  </div>

                  <div className="ticket-price">
                    <div className="price-text-group">
                      <span className="total-label">Total da Reserva</span>
                      <span className="total-value notranslate" translate="no">{formatarPreco(ag.preco_total)}</span>
                    </div>
                    <div className="pay-tag">
                        {getMetodoIcon(ag.metodo_pagamento)}
                        <span>{ag.metodo_pagamento}</span>
                    </div>
                  </div>
                </div>

                <footer className="ticket-footer">
                   <div className="footer-notice">
                      <FaInfoCircle /> <span>Informar Tuly Mighoto na Recepção</span>
                   </div>
                   
                   <div className="footer-actions">
                      {ag.status === 'PENDENTE' && (
                        <button className="btn-cancel" onClick={() => cancelarAgendamento(ag.id, ag.metodo_pagamento)}>
                            Cancelar
                        </button>
                      )}
                      {ag.status === 'CONFIRMADO' && (
                        <div className="confirmed-mark"><FaCheckCircle /> Garantido</div>
                      )}
                      {ag.status === 'CANCELADO' && (
                        <div className="canceled-mark"><FaTimesCircle /> Encerrado</div>
                      )}
                   </div>
                </footer>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MeusAgendamentos;