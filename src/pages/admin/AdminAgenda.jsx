import React, { useState, useEffect } from 'react';
import { Store } from 'react-notifications-component';
import { 
    FaCalendarAlt, FaClock, FaUser, FaCheckCircle, 
    FaTimesCircle, FaRegCalendarMinus, FaLock 
} from 'react-icons/fa';
import api from '../../services/api';
import './styles/adminAgenda.css'; // Vamos criar esse CSS abaixo

const AdminAgenda = () => {
    const [agendamentos, setAgendamentos] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // Estado para o filtro de data
    const [dataFiltro, setDataFiltro] = useState(''); 

    // Busca os dados sempre que a tela carrega ou a data muda
    useEffect(() => {
        carregarAgendamentos();
    }, [dataFiltro]);

    const carregarAgendamentos = async () => {
        setLoading(true);
        try {
            // Passa a data como parâmetro (se estiver vazia, o backend traz tudo)
            const res = await api.get('/agendamentos', {
                params: { data: dataFiltro || undefined }
            });
            setAgendamentos(res.data);
        // eslint-disable-next-line no-unused-vars
        } catch (err) {
            Store.addNotification({
                title: "Erro", message: "Não foi possível carregar a agenda.",
                type: "danger", container: "top-right", dismiss: { duration: 3000 }
            });
        } finally {
            setLoading(false);
        }
    };

    const limparFiltro = () => {
        setDataFiltro('');
    };

    // Função para renderizar a cor do status
    const getStatusBadge = (status) => {
        switch (status) {
            case 'CONFIRMADO': return <span className="badge badge-success"><FaCheckCircle/> Confirmado</span>;
            case 'PENDENTE': return <span className="badge badge-warning"><FaClock/> Pendente</span>;
            case 'CANCELADO': return <span className="badge badge-danger"><FaTimesCircle/> Cancelado</span>;
            case 'BLOQUEADO': return <span className="badge badge-dark"><FaLock/> Bloqueado</span>;
            default: return <span className="badge badge-default">{status}</span>;
        }
    };

    return (
        <div className="admin-page-container fade-in">
            <div className="admin-header-row agenda-header">
                <div className="header-text">
                    <h2 className="admin-title">Agenda do Estúdio</h2>
                    <p className="admin-subtitle">Gerencie os agendamentos e bloqueios por data.</p>
                </div>
                
                {/* FILTRO DE DATA */}
                <div className="agenda-filter-box">
                    <label><FaCalendarAlt /> Filtrar por Dia:</label>
                    <input 
                        type="date" 
                        className="vetra-input date-filter"
                        value={dataFiltro}
                        onChange={(e) => setDataFiltro(e.target.value)}
                    />
                    {dataFiltro && (
                        <button className="btn-clear-filter" onClick={limparFiltro}>
                            Limpar Filtro
                        </button>
                    )}
                </div>
            </div>

            <div className="agenda-list-container">
                {loading ? (
                    <div className="loading-state">Carregando agenda...</div>
                ) : agendamentos.length === 0 ? (
                    <div className="empty-state">
                        <FaRegCalendarMinus className="empty-icon" />
                        <h3>Nenhum agendamento encontrado</h3>
                        <p>{dataFiltro ? `Não há reservas marcadas para ${new Date(dataFiltro).toLocaleDateString('pt-BR')}.` : 'Sua agenda está vazia no momento.'}</p>
                    </div>
                ) : (
                    <div className="agenda-grid">
                        {agendamentos.map(agendamento => {
                            const dataInicio = new Date(agendamento.data_inicio);
                            const dataFim = new Date(agendamento.data_fim);
                            const diaFormatado = dataInicio.toLocaleDateString('pt-BR');
                            const horaInicio = dataInicio.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                            const horaFim = dataFim.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

                            return (
                                <div key={agendamento.id} className={`agenda-card ${agendamento.status === 'BLOQUEADO' ? 'card-bloqueado' : ''}`}>
                                    <div className="card-top-bar">
                                        <div className="agenda-date">
                                            <strong>{diaFormatado}</strong>
                                            <span>{horaInicio} às {horaFim}</span>
                                        </div>
                                        {getStatusBadge(agendamento.status)}
                                    </div>

                                    <div className="card-body">
                                        <h4 className="espaco-nome">{agendamento.espaco_nome}</h4>
                                        
                                        {agendamento.status !== 'BLOQUEADO' && (
                                            <div className="client-info">
                                                <FaUser className="client-icon" />
                                                <div>
                                                    <strong>{agendamento.usuario_nome}</strong>
                                                    <span>{agendamento.usuario_email}</span>
                                                </div>
                                            </div>
                                        )}

                                        {agendamento.status === 'BLOQUEADO' && (
                                            <div className="block-info">
                                                <span>Motivo: {agendamento.metodo_pagamento || 'Manutenção / Fechado'}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="card-footer">
                                        {agendamento.status !== 'BLOQUEADO' ? (
                                            <>
                                                <span className="pgto-tipo">Pagamento: <strong>{agendamento.metodo_pagamento}</strong></span>
                                                <span className="valor-total">R$ {Number(agendamento.preco_total).toFixed(2)}</span>
                                            </>
                                        ) : (
                                            <span className="bloqueio-tag">Bloqueio Administrativo</span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminAgenda;