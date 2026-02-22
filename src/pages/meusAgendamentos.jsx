import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { format, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Store } from 'react-notifications-component'; // <-- Biblioteca importada
import {
    FaCalendarAlt, FaClock, FaHistory,
    FaMoneyBillWave, FaCreditCard, FaTimesCircle, FaExchangeAlt,
    FaExclamationTriangle, FaTimes, FaBarcode, FaMapMarkerAlt, FaArrowLeft
} from 'react-icons/fa';
import '../styles/meusAgendamentos.css';

const MeusAgendamentos = () => {
    const [agendamentos, setAgendamentos] = useState([]);
    const [loading, setLoading] = useState(true);
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
                console.error("Erro:", err);
                setLoading(false);
            });
    };

    const formatarValor = (valor) => {
        if (!valor && valor !== 0) return 'R$ 0,00';
        let numero = valor;
        if (typeof valor === 'string') {
            const limpo = valor.replace('R$', '').replace(/\./g, '').replace(',', '.').trim();
            numero = parseFloat(limpo);
        }
        if (isNaN(numero)) return 'R$ 0,00';
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(numero);
    };

    const formatarStatus = (status) => {
        const mapa = {
            'PENDENTE': 'Aguardando Aprovação',
            'CONFIRMADO': 'Confirmado',
            'CANCELADO': 'Cancelado',
            'REALIZADO': 'Concluído',
            'REAGENDAMENTO_SOLICITADO': 'Em Análise'
        };
        return mapa[status] || status;
    };

    const abrirModal = (id, acao) => setModalData({ show: true, id, acao });
    const fecharModal = () => setModalData({ show: false, id: null, acao: '' });

    const confirmarAcao = async () => {
        const { id, acao } = modalData;
        try {
            await api.patch(`/agendamentos/${id}/gerenciar`, { acao });
            fecharModal();
            
            // Notificação de Sucesso com a biblioteca
            Store.addNotification({
                title: "Sucesso!",
                message: acao === 'CANCELAR' ? "Agendamento cancelado." : "Solicitação enviada com sucesso.",
                type: "success",
                insert: "top",
                container: "top-right",
                animationIn: ["animate__animated", "animate__fadeIn"],
                animationOut: ["animate__animated", "animate__fadeOut"],
                dismiss: { duration: 4000, onScreen: true }
            });

            carregarDados();
        } catch (err) {
            fecharModal();
            
            // Notificação de Erro com a biblioteca
            Store.addNotification({
                title: "Erro",
                message: "Ocorreu um erro ao processar sua solicitação. Tente novamente.",
                type: "danger",
                insert: "top",
                container: "top-right",
                animationIn: ["animate__animated", "animate__fadeIn"],
                animationOut: ["animate__animated", "animate__fadeOut"],
                dismiss: { duration: 4000, onScreen: true }
            });
        }
    };

    if (loading) return (
        <div className="my-bookings-page loading-center">
            <div className="loader"></div>
            <p>Buscando suas reservas...</p>
        </div>
    );

    return (
        <div className="my-bookings-page fade-in">
            
            {/* BOTÃO VOLTAR PARA HOME */}
            <div className="top-nav-bar">
                <Link to="/" className="btn-back-home">
                    <FaArrowLeft /> Voltar para o Início
                </Link>
            </div>

            <div className="page-header">
                <span className="overline">Área do Cliente</span>
                <h2 className="page-title">Meus Agendamentos</h2>
                <div className="header-line"></div>
                <p className="page-subtitle">Acompanhe e gerencie suas sessões no Estúdio Vetra</p>
            </div>

            {agendamentos.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon-circle">
                        <FaHistory />
                    </div>
                    <h3>Histórico Vazio</h3>
                    <p>Você ainda não possui reservas em nossos estúdios.</p>
                    <Link to="/agendamento" className="btn-gold-pill">Fazer Primeira Reserva</Link>
                </div>
            ) : (
                <div className="bookings-grid">
                    {agendamentos.map((ag) => {
                        const dataInicio = new Date(ag.data_inicio);
                        const dataFim = new Date(ag.data_fim);
                        const hoje = new Date();
                        const diasRestantes = differenceInDays(dataInicio, hoje);

                        const isCanceled = ag.status === 'CANCELADO';
                        const isDone = ag.status === 'REALIZADO';
                        const podeMexer = !isCanceled && !isDone && ag.status !== 'REAGENDAMENTO_SOLICITADO';

                        let IconPay = FaCreditCard;
                        if (ag.metodo_pagamento === 'PIX') IconPay = FaMoneyBillWave;
                        if (ag.metodo_pagamento === 'DEBITO') IconPay = FaBarcode;

                        return (
                            <div key={ag.id} className={`vetra-ticket ${ag.status.toLowerCase()}`}>
                                <div className="ticket-status-border"></div>

                                <div className="ticket-inner">
                                    <div className="ticket-top">
                                        <span className={`badge-status ${ag.status}`}>
                                            {formatarStatus(ag.status)}
                                        </span>
                                        <span className="ticket-number">#{ag.id.toString().padStart(4, '0')}</span>
                                    </div>

                                    <div className="ticket-main">
                                        <h3 className="studio-name">{ag.espaco_nome || "Estúdio Vetra"}</h3>
                                        <div className="studio-location">
                                            <FaMapMarkerAlt /> Unidade Principal
                                        </div>

                                        <div className="ticket-details">
                                            <div className="detail-col">
                                                <span className="detail-label"><FaCalendarAlt /> Data</span>
                                                <span className="detail-value">{format(dataInicio, "dd/MM/yyyy")}</span>
                                            </div>
                                            <div className="detail-col">
                                                <span className="detail-label"><FaClock /> Horário</span>
                                                <span className="detail-value">{format(dataInicio, 'HH:mm')} - {format(dataFim, 'HH:mm')}</span>
                                            </div>
                                        </div>

                                        <div className="ticket-price-box">
                                            <span className="price-label">Valor Total</span>
                                            <span className="price-amount">{formatarValor(ag.preco_total)}</span>
                                        </div>
                                    </div>

                                    <div className="ticket-bottom">
                                        <div className="payment-method">
                                            <IconPay className="pay-icon" />
                                            <span>Pago via {ag.metodo_pagamento}</span>
                                        </div>

                                        {podeMexer && (
                                            <div className="ticket-actions">
                                                {ag.metodo_pagamento === 'PIX' ? (
                                                    diasRestantes >= 3 ? (
                                                        <button onClick={() => abrirModal(ag.id, 'REAGENDAR')} className="action-link gold">
                                                            <FaExchangeAlt /> Reagendar
                                                        </button>
                                                    ) : (
                                                        <span className="alert-text"><FaExclamationTriangle /> Prazo expirado</span>
                                                    )
                                                ) : (
                                                    <button onClick={() => abrirModal(ag.id, 'CANCELAR')} className="action-link red">
                                                        <FaTimesCircle /> Cancelar
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {modalData.show && (
                <div className="modal-backdrop fade-in">
                    <div className="modal-box">
                        <button className="btn-close-modal" onClick={fecharModal}><FaTimes /></button>
                        <div className="modal-icon-wrapper">
                            <FaExclamationTriangle />
                        </div>
                        <h3 className="modal-title">Atenção</h3>
                        <p className="modal-desc">
                            {modalData.acao === 'CANCELAR'
                                ? "Tem certeza que deseja cancelar esta reserva? Esta ação é irreversível e o horário será liberado."
                                : "Deseja solicitar o reagendamento? Nossa equipe analisará a disponibilidade e entrará em contato."}
                        </p>
                        <div className="modal-actions-row">
                            <button className="btn-modal-outline" onClick={fecharModal}>Voltar</button>
                            <button className="btn-modal-solid" onClick={confirmarAcao}>Confirmar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MeusAgendamentos;