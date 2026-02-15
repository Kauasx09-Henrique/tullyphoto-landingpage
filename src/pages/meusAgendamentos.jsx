import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { format, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
    FaCalendarAlt, FaClock, FaHistory,
    FaMoneyBillWave, FaCreditCard, FaTimesCircle, FaExchangeAlt,
    FaExclamationTriangle, FaTimes, FaBarcode, FaMapMarkerAlt, FaChevronRight
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
            'REAGENDAMENTO_SOLICITADO': 'Reagendamento em Análise'
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
            alert(acao === 'CANCELAR' ? "Agendamento cancelado." : "Solicitação enviada.");
            carregarDados();
        } catch (err) {
            alert("Erro ao processar.");
            fecharModal();
        }
    };

    if (loading) return (
        <div className="my-bookings-page loading-center">
            <div className="loader"></div>
        </div>
    );

    return (
        <div className="my-bookings-page fade-in">
            <div className="page-header">
                <span className="overline">Área do Cliente</span>
                <h2 className="page-title">Meus Agendamentos</h2>
                <div className="header-line"></div>
            </div>

            {agendamentos.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon-circle">
                        <FaHistory />
                    </div>
                    <h3>Histórico Vazio</h3>
                    <p>Você ainda não possui reservas em nossos estúdios.</p>
                    <Link to="/agendamento" className="btn-gold-outline">Fazer Reserva</Link>
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
                            <div key={ag.id} className={`ticket-card ${ag.status.toLowerCase()}`}>
                                <div className="ticket-left-border"></div>

                                <div className="ticket-content">
                                    {/* CABEÇALHO */}
                                    <div className="ticket-header">
                                        <span className={`status-pill ${ag.status}`}>
                                            {formatarStatus(ag.status)}
                                        </span>
                                        <span className="ticket-id">#{ag.id.toString().padStart(4, '0')}</span>
                                    </div>

                                    {/* CORPO */}
                                    <div className="ticket-body">
                                        <h3 className="studio-title">{ag.espaco_nome || "Estúdio Vetra"}</h3>
                                        <div className="location-tag">
                                            <FaMapMarkerAlt /> Unidade Principal
                                        </div>

                                        <div className="info-grid">
                                            <div className="info-box">
                                                <label>Data</label>
                                                <span>{format(dataInicio, "dd/MM/yyyy")}</span>
                                            </div>
                                            <div className="info-box">
                                                <label>Horário</label>
                                                <span>{format(dataInicio, 'HH:mm')} - {format(dataFim, 'HH:mm')}</span>
                                            </div>
                                            <div className="info-box">
                                                <label>Valor</label>
                                                <span className="price-highlight">{formatarValor(ag.preco_total)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* RODAPÉ */}
                                    <div className="ticket-footer">
                                        <div className="payment-info">
                                            <IconPay className="pay-icon" />
                                            <span>{ag.metodo_pagamento}</span>
                                        </div>

                                        {podeMexer && (
                                            <div className="ticket-actions">
                                                {ag.metodo_pagamento === 'PIX' ? (
                                                    diasRestantes >= 3 ? (
                                                        <button onClick={() => abrirModal(ag.id, 'REAGENDAR')} className="btn-link">
                                                            Reagendar <FaExchangeAlt />
                                                        </button>
                                                    ) : (
                                                        <span className="text-alert">Prazo expirado</span>
                                                    )
                                                ) : (
                                                    <button onClick={() => abrirModal(ag.id, 'CANCELAR')} className="btn-link cancel">
                                                        Cancelar <FaTimes />
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
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="close-modal" onClick={fecharModal}><FaTimes /></button>
                        <FaExclamationTriangle className="modal-icon-lg" />
                        <h3>Atenção</h3>
                        <p>
                            {modalData.acao === 'CANCELAR'
                                ? "Tem certeza que deseja cancelar este agendamento? Esta ação é irreversível."
                                : "Deseja solicitar uma alteração de data? Nossa equipe entrará em contato."}
                        </p>
                        <div className="modal-btns">
                            <button className="btn-flat" onClick={fecharModal}>Voltar</button>
                            <button className="btn-solid" onClick={confirmarAcao}>Confirmar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MeusAgendamentos;