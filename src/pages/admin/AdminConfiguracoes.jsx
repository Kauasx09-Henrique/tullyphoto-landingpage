import React, { useState } from 'react';
import { Store } from 'react-notifications-component';
import { 
    FaStore, FaClock, FaCreditCard, FaBell, 
    FaSave, FaWhatsapp, FaEnvelope, FaMapMarkerAlt, FaKey
} from 'react-icons/fa';
import '../styles/AdminConfiguracoes.css';

const AdminConfiguracoes = () => {
    const [loading, setLoading] = useState(false);
    const [configData, setConfigData] = useState({
        nomeEstudio: 'Vetra Studio',
        emailContato: 'contato@vetrastudio.com',
        whatsapp: '(61) 99999-9999',
        endereco: 'SEPN 513 Bloco D Ed. Imperador Sala 101',
        horarioAbertura: '08:00',
        horarioFechamento: '20:00',
        chavePix: 'CNPJ: 00.000.000/0001-00',
        notificaEmail: true,
        notificaWhatsapp: false
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setConfigData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSave = (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulando o tempo de salvamento na API
        setTimeout(() => {
            setLoading(false);
            Store.addNotification({
                title: "Sucesso!",
                message: "Configurações atualizadas com sucesso.",
                type: "success",
                insert: "top",
                container: "top-right",
                dismiss: { duration: 3000 }
            });
        }, 1200);
    };

    return (
        <div className="admin-page-container fade-in">
            <div className="admin-header-row">
                <div className="header-text">
                    <h2 className="admin-title">Configurações do Sistema</h2>
                    <p className="admin-subtitle">Gerencie os dados, horários e preferências financeiras do Vetra Studio.</p>
                </div>
                <button className="btn-save-global" onClick={handleSave} disabled={loading}>
                    {loading ? 'Salvando...' : <><FaSave /> Salvar Alterações</>}
                </button>
            </div>

            <form className="config-grid">
                
                {/* CARD 1: DADOS DO ESTÚDIO */}
                <div className="config-card">
                    <div className="config-card-header">
                        <div className="icon-box"><FaStore /></div>
                        <h3>Dados do Estúdio</h3>
                    </div>
                    <div className="config-card-body">
                        <div className="form-group">
                            <label>Nome Comercial</label>
                            <input type="text" name="nomeEstudio" value={configData.nomeEstudio} onChange={handleChange} className="vetra-input" />
                        </div>
                        <div className="form-group-row">
                            <div className="form-group">
                                <label><FaEnvelope className="input-icon"/> E-mail Público</label>
                                <input type="email" name="emailContato" value={configData.emailContato} onChange={handleChange} className="vetra-input" />
                            </div>
                            <div className="form-group">
                                <label><FaWhatsapp className="input-icon"/> WhatsApp</label>
                                <input type="text" name="whatsapp" value={configData.whatsapp} onChange={handleChange} className="vetra-input" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label><FaMapMarkerAlt className="input-icon"/> Endereço Completo</label>
                            <input type="text" name="endereco" value={configData.endereco} onChange={handleChange} className="vetra-input" />
                        </div>
                    </div>
                </div>

                {/* CARD 2: HORÁRIOS */}
                <div className="config-card">
                    <div className="config-card-header">
                        <div className="icon-box"><FaClock /></div>
                        <h3>Horário de Funcionamento</h3>
                    </div>
                    <div className="config-card-body">
                        <p className="config-hint">Define a janela de horários disponíveis para os clientes no calendário de agendamento.</p>
                        <div className="form-group-row">
                            <div className="form-group">
                                <label>Abertura</label>
                                <input type="time" name="horarioAbertura" value={configData.horarioAbertura} onChange={handleChange} className="vetra-input" />
                            </div>
                            <div className="form-group">
                                <label>Encerramento</label>
                                <input type="time" name="horarioFechamento" value={configData.horarioFechamento} onChange={handleChange} className="vetra-input" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* CARD 3: FINANCEIRO */}
                <div className="config-card">
                    <div className="config-card-header">
                        <div className="icon-box"><FaCreditCard /></div>
                        <h3>Dados de Pagamento</h3>
                    </div>
                    <div className="config-card-body">
                        <p className="config-hint">A chave PIX exibida para os clientes no final da reserva.</p>
                        <div className="form-group">
                            <label><FaKey className="input-icon"/> Chave PIX Oficial</label>
                            <input type="text" name="chavePix" value={configData.chavePix} onChange={handleChange} className="vetra-input" />
                        </div>
                    </div>
                </div>

                {/* CARD 4: NOTIFICAÇÕES (TOGGLES) */}
                <div className="config-card">
                    <div className="config-card-header">
                        <div className="icon-box"><FaBell /></div>
                        <h3>Avisos e Alertas</h3>
                    </div>
                    <div className="config-card-body">
                        <div className="toggle-row">
                            <div className="toggle-info">
                                <strong>Alertas por E-mail</strong>
                                <span>Receber um e-mail a cada nova reserva feita no site.</span>
                            </div>
                            <label className="vetra-switch">
                                <input type="checkbox" name="notificaEmail" checked={configData.notificaEmail} onChange={handleChange} />
                                <span className="slider round"></span>
                            </label>
                        </div>
                        <div className="toggle-row">
                            <div className="toggle-info">
                                <strong>Alertas no WhatsApp</strong>
                                <span>Ser notificado no WhatsApp do estúdio sobre cancelamentos.</span>
                            </div>
                            <label className="vetra-switch">
                                <input type="checkbox" name="notificaWhatsapp" checked={configData.notificaWhatsapp} onChange={handleChange} />
                                <span className="slider round"></span>
                            </label>
                        </div>
                    </div>
                </div>

            </form>
        </div>
    );
};

export default AdminConfiguracoes;