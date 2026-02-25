import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Store } from 'react-notifications-component';
import { 
  FaCalendarAlt, FaClock, FaMapMarkerAlt, FaQrcode, 
  FaCreditCard, FaBarcode, FaCheckCircle, FaTimesCircle, FaArrowLeft
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
        title: "Erro", message: "Falha ao carregar suas reservas.", 
        type: "danger", container: "top-right", dismiss: { duration: 3000 } 
      });
    } finally {
      setLoading(false);
    }
  };

  const cancelarAgendamento = async (id, metodoPagamento) => {
    if (!window.confirm('Tem certeza que deseja cancelar esta reserva?')) return;

    try {
      const acao = metodoPagamento === 'PIX' ? 'REAGENDAR' : 'CANCELAR';
      await api.put(`/agendamentos/${id}/cancelar`, { acao });
      
      Store.addNotification({ 
        title: "Sucesso", message: "Solicitação enviada.", 
        type: "success", container: "top-right", dismiss: { duration: 4000 } 
      });
      carregarMeusAgendamentos();
    } catch (err) {
      Store.addNotification({ 
        title: "Atenção", message: err.response?.data?.msg || "Erro ao cancelar.", 
        type: "warning", container: "top-right", dismiss: { duration: 4000 } 
      });
    }
  };

  const getMetodoIcon = (metodo) => {
    if (metodo === 'PIX') return <FaQrcode />;
    if (metodo === 'CREDITO') return <FaCreditCard />;
    if (metodo === 'DEBITO') return <FaBarcode />;
    return <FaCreditCard />;
  };

  const formatarData = (dataStr) => {
    return new Date(dataStr).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const formatarHora = (dataInicio, dataFim) => {
    const inicio = new Date(dataInicio).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const fim = new Date(dataFim).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    return `${inicio} - ${fim}`;
  };

  const formatarPreco = (valor) => {
    let num = parseFloat(valor);
    if (isNaN(num)) return 'R$ 0,00';
    if (num > 10000) num = num / 100;
    return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className="my-bookings-page fade-in" translate="no">
      <div className="top-nav-bar">
        <Link to="/" className="btn-back-home"><FaArrowLeft /> Voltar ao Início</Link>
      </div>

      <div className="page-header">
        <span className="overline">Suas Reservas</span>
        <h1 className="page-title">Minhas Sessões</h1>
        <div className="header-line"></div>
        <p className="page-subtitle">Acompanhe e gerencie suas sessões no Estúdio Vetra</p>
      </div>

      {loading ? (
        <div className="loading-center">
            <div className="loader"></div>
            <p>Carregando ingressos...</p>
        </div>
      ) : agendamentos.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon-circle"><FaCalendarAlt /></div>
          <h3>Você ainda não tem reservas</h3>
          <p>Que tal agendar sua primeira sessão fotográfica conosco?</p>
          <Link to="/agendamento" className="btn-gold-pill">Fazer um Agendamento</Link>
        </div>
      ) : (
        <div className="bookings-grid">
          {agendamentos.map(ag => (
            <div key={ag.id} className={`vetra-ticket ${ag.status.toLowerCase()}`}>
              
              <div className="ticket-status-border"></div>
              
              <div className="ticket-inner">
                <div className="ticket-top">
                  <span className={`badge-status ${ag.status}`}>{ag.status}</span>
                  <span className="ticket-number"># {String(ag.id).padStart(4, '0')}</span>
                </div>

                <div className="ticket-main">
                  <h3 className="studio-name">{ag.espaco_nome.toUpperCase()}</h3>
                  <div className="studio-location"><FaMapMarkerAlt /> Unidade Principal</div>

                  <div className="ticket-details">
                    <div className="detail-col">
                      <span className="detail-label"><FaCalendarAlt /> Data</span>
                      <span className="detail-value">{formatarData(ag.data_inicio)}</span>
                    </div>
                    <div className="detail-col">
                      <span className="detail-label"><FaClock /> Horário</span>
                      <span className="detail-value">{formatarHora(ag.data_inicio, ag.data_fim)}</span>
                    </div>
                  </div>

                  <div className="ticket-price-box">
                    <span className="price-label">Valor Total</span>
                    <span className="price-amount notranslate" translate="no">{formatarPreco(ag.preco_total)}</span>
                  </div>
                </div>

                <div className="ticket-bottom">
                  <div className="payment-method">
                    <span className="pay-icon">{getMetodoIcon(ag.metodo_pagamento)}</span>
                    Pago via {ag.metodo_pagamento}
                  </div>
                  
                  <div className="ticket-actions">
                    {ag.status === 'PENDENTE' && (
                        <button className="action-link red" onClick={() => cancelarAgendamento(ag.id, ag.metodo_pagamento)}>
                            Cancelar
                        </button>
                    )}
                    {ag.status === 'CONFIRMADO' && (
                        <span className="action-link gold" style={{cursor: 'default'}}>
                            <FaCheckCircle /> Confirmado
                        </span>
                    )}
                    {ag.status === 'CANCELADO' && (
                        <span className="action-link red" style={{cursor: 'default'}}>
                            <FaTimesCircle /> Cancelado
                        </span>
                    )}
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MeusAgendamentos;