import React, { useState, useEffect } from 'react';
import { Store } from 'react-notifications-component';
import { 
    FaCalendarCheck, FaCheck, FaTimes, FaClock, FaUser, 
    FaMapMarkerAlt, FaFileInvoiceDollar, FaDownload, FaFilter 
} from 'react-icons/fa';
import api from '../../services/api';
import '../../styles/adminAgenda.css';

const AdminAgenda = () => {
    const [agendamentos, setAgendamentos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtro, setFiltro] = useState('PENDENTE'); // Começa vendo os pendentes

    useEffect(() => {
        carregarAgenda();
    }, []);

    const carregarAgenda = async () => {
        try {
            const res = await api.get('/agendamentos');
            setAgendamentos(res.data);
        } catch (err) {
            console.error(err);
            Store.addNotification({
                title: "Erro", message: "Falha ao carregar agenda.", type: "danger", container: "top-right", dismiss: { duration: 3000 }
            });
        } finally {
            setLoading(false);
        }
    };

    const handleStatus = async (id, novoStatus) => {
        try {
            // Atualiza status (isso dispara a notificação no backend)
            await api.put(`/agendamentos/${id}`, { status: novoStatus });
            
            // Atualiza a lista visualmente sem recarregar
            setAgendamentos(prev => prev.map(ag => 
                ag.id === id ? { ...ag, status: novoStatus } : ag
            ));

            Store.addNotification({
                title: novoStatus === 'CONFIRMADO' ? "Aprovado" : "Recusado", 
                message: `O status foi atualizado e o cliente notificado.`, 
                type: "success", 
                container: "top-right", 
                dismiss: { duration: 3000 }
            });
        } catch (err) {
            Store.addNotification({
                title: "Erro", message: "Não foi possível atualizar.", type: "danger", container: "top-right", dismiss: { duration: 3000 }
            });
        }
    };

    // Lógica de Filtro
    const filtrados = agendamentos.filter(ag => 
        filtro === 'TODOS' ? true : ag.status === filtro
    );

    // Formata Data e Hora
    const formatDate = (isoString) => {
        if (!isoString) return '--';
        const data = new Date(isoString);
        return {
            dia: data.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' }),
            hora: data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        };
    };

    return (
        <div className="admin-page-container fade-in">
            {/* CABEÇALHO DA PÁGINA */}
            <div className="admin-header-row">
                <div className="header-text">
                    <h2 className="admin-title">Gestão de Agenda</h2>
                    <p className="admin-subtitle">Visualize e aprove as solicitações de reserva.</p>
                </div>
                
                {/* BOTÕES DE FILTRO */}
                <div className="filter-group">
                    <button className={`filter-btn ${filtro === 'PENDENTE' ? 'active' : ''}`} onClick={() => setFiltro('PENDENTE')}>
                        Pendentes
                    </button>
                    <button className={`filter-btn ${filtro === 'CONFIRMADO' ? 'active' : ''}`} onClick={() => setFiltro('CONFIRMADO')}>
                        Aprovados
                    </button>
                    <button className={`filter-btn ${filtro === 'TODOS' ? 'active' : ''}`} onClick={() => setFiltro('TODOS')}>
                        Todos
                    </button>
                </div>
            </div>

            {/* GRID DE CARDS */}
            <div className="agenda-grid">
                {loading ? (
                    <div className="loading-state">Carregando solicitações...</div>
                ) : filtrados.length === 0 ? (
                    <div className="empty-state-agenda">
                        <FaCalendarCheck />
                        <p>Nenhum agendamento {filtro !== 'TODOS' ? filtro.toLowerCase() : ''} encontrado.</p>
                    </div>
                ) : (
                    filtrados.map(ag => {
                        const { dia, hora } = formatDate(ag.data_inicio);
                        
                        return (
                            <div key={ag.id} className={`agenda-card status-${ag.status}`}>
                                <div className="card-header">
                                    <div className="date-badge">
                                        <span className="db-day">{dia}</span>
                                        <span className="db-time">{hora}</span>
                                    </div>
                                    <span className={`status-pill pill-${ag.status}`}>{ag.status}</span>
                                </div>

                                <div className="card-body">
                                    <div className="info-group">
                                        <label>Cliente</label>
                                        <div className="info-val">
                                            <FaUser /> {ag.usuario_nome || "Nome não disponível"}
                                        </div>
                                        <small>{ag.usuario_email}</small>
                                    </div>

                                    <div className="info-group">
                                        <label>Cenário</label>
                                        <div className="info-val">
                                            <FaMapMarkerAlt /> {ag.espaco_nome || "Cenário não disponível"}
                                        </div>
                                    </div>

                                    <div className="info-group">
                                        <label>Pagamento</label>
                                        <div className="info-val">
                                            <FaFileInvoiceDollar /> {ag.metodo_pagamento}
                                        </div>
                                    </div>

                                    {ag.comprovante_url && (
                                        <a 
                                            href={`http://localhost:3000/${ag.comprovante_url}`} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="btn-download"
                                        >
                                            <FaDownload /> Ver Comprovante
                                        </a>
                                    )}
                                </div>

                                {/* AÇÕES (SÓ APARECEM SE PENDENTE) */}
                                {ag.status === 'PENDENTE' && (
                                    <div className="card-actions">
                                        <button className="action-btn reject" onClick={() => handleStatus(ag.id, 'CANCELADO')}>
                                            <FaTimes /> Recusar
                                        </button>
                                        <button className="action-btn approve" onClick={() => handleStatus(ag.id, 'CONFIRMADO')}>
                                            <FaCheck /> Confirmar
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default AdminAgenda;