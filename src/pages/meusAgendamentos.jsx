import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { format, differenceInDays } from 'date-fns';
import {
    FaCalendarAlt, FaClock, FaHistory,
    FaMoneyBillWave, FaCreditCard, FaTimesCircle, FaExchangeAlt,
    FaExclamationTriangle, FaTimes
} from 'react-icons/fa';
import '../styles/meusAgendamentos.css';

const MeusAgendamentos = () => {
    const [agendamentos, setAgendamentos] = useState([]);
    const [loading, setLoading] = useState(true);

    // Estado para controlar o Modal de Confirmação
    const [modalData, setModalData] = useState({ show: false, id: null, acao: '' });

    useEffect(() => {
        carregarDados();
    }, []);

    const carregarDados = () => {
        api.get('/agendamentos')
            .then(res => {
                setAgendamentos(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    // 1. Ao clicar no botão, SÓ abre o modal (não chama API ainda)
    const abrirModal = (id, acao) => {
        setModalData({ show: true, id, acao });
    };

    // 2. Se o usuário confirmar no Modal, aí sim chama a API
    const confirmarAcao = async () => {
        const { id, acao } = modalData;

        try {
            await api.patch(`/agendamentos/${id}/gerenciar`, { acao });

            // Fecha modal
            setModalData({ show: false, id: null, acao: '' });

            // Feedback simples e direto
            alert(acao === 'CANCELAR' ? "Reserva cancelada com sucesso!" : "Solicitação enviada!");

            carregarDados();

        } catch (err) {
            const msg = err.response?.data?.msg || "Erro ao processar.";
            alert("Erro: " + msg);
            setModalData({ ...modalData, show: false });
        }
    };

    if (loading) return <div className="my-bookings-page"><p>Carregando histórico...</p></div>;

    return (
        <div className="my-bookings-page">
            <h2 className="page-title">Meus Agendamentos</h2>

            {agendamentos.length === 0 ? (
                <div className="empty-state">
                    <FaHistory size={60} color="#D4AF6E" style={{ opacity: 0.5 }} />
                    <h3 style={{ color: '#2C2420' }}>Você ainda não tem agendamentos.</h3>
                    <p>Que tal realizar seu primeiro ensaio conosco?</p>
                    <Link to="/agendamento" className="btn-new-booking">Agendar Agora</Link>
                </div>
            ) : (
                <div className="bookings-grid">
                    {agendamentos.map(ag => {
                        const dataEnsaio = new Date(ag.data_inicio);
                        const hoje = new Date();
                        const diasRestantes = differenceInDays(dataEnsaio, hoje);
                        // Verifica se pode mexer (não está cancelado nem realizado)
                        const podeMexer = ag.status !== 'CANCELADO' && ag.status !== 'REALIZADO' && ag.status !== 'REAGENDAMENTO_SOLICITADO';

                        return (
                            <div key={ag.id} className={`booking-history-card ${ag.status}`}>
                                <div className="card-header">
                                    <span className="studio-name">{ag.espaco_nome}</span>
                                    <span className={`status-badge ${ag.status}`}>{ag.status.replace('_', ' ')}</span>
                                </div>

                                <div className="card-body">
                                    <div className="info-row">
                                        <FaCalendarAlt color="#D4AF6E" />
                                        <span>{format(dataEnsaio, 'dd/MM/yyyy')}</span>
                                    </div>
                                    <div className="info-row">
                                        <FaClock color="#D4AF6E" />
                                        <span>{format(dataEnsaio, 'HH:mm')} - {format(new Date(ag.data_fim), 'HH:mm')}</span>
                                    </div>
                                    <div className="info-row">
                                        {ag.metodo_pagamento === 'PIX' ? <FaMoneyBillWave color="#27ae60" /> : <FaCreditCard color="#2C2420" />}
                                        <span>Via {ag.metodo_pagamento}</span>
                                    </div>

                                    <div className="price-tag">
                                        R$ {parseFloat(ag.preco_total).toFixed(2).replace('.', ',')}
                                    </div>
                                </div>

                                {podeMexer && (
                                    <div className="card-actions">
                                        {ag.metodo_pagamento === 'PIX' && (
                                            <>
                                                {diasRestantes >= 3 ? (
                                                    <button onClick={() => abrirModal(ag.id, 'REAGENDAR')} className="btn-action btn-reschedule">
                                                        <FaExchangeAlt /> Solicitar Reagendamento
                                                    </button>
                                                ) : (
                                                    <span className="alert-days">
                                                        Prazo para reagendar expirou (Mín. 3 dias).
                                                    </span>
                                                )}
                                            </>
                                        )}

                                        {ag.metodo_pagamento !== 'PIX' && (
                                            <button onClick={() => abrirModal(ag.id, 'CANCELAR')} className="btn-action btn-cancel">
                                                <FaTimesCircle /> Cancelar Reserva
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* --- MODAL PERSONALIZADO (Substitui o window.confirm) --- */}
            {modalData.show && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="close-btn" onClick={() => setModalData({ show: false })}><FaTimes /></button>

                        <FaExclamationTriangle className="confirm-icon" />

                        <h3 className="confirm-title">Tem certeza?</h3>

                        <p className="confirm-text">
                            {modalData.acao === 'CANCELAR'
                                ? "Você realmente deseja cancelar esta reserva? Essa ação não pode ser desfeita."
                                : "Deseja solicitar o reagendamento? O administrador entrará em contato para confirmar a nova data."
                            }
                        </p>

                        <div className="modal-actions">
                            <button className="btn-modal btn-no" onClick={() => setModalData({ show: false })}>
                                Voltar
                            </button>
                            <button className="btn-modal btn-yes" onClick={confirmarAcao}>
                                Sim, Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MeusAgendamentos;