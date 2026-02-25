import React, { useState, useEffect } from 'react';
import { Store } from 'react-notifications-component';
import { FaLock, FaCalendarAlt, FaClock, FaCommentDots, FaCameraRetro } from 'react-icons/fa';
import api from '../../services/api';
import './styles/adminBloqueios.css'; 

const AdminBloqueios = () => {
    const [espacos, setEspacos] = useState([]);
    const [formData, setFormData] = useState({
        espaco_id: '',
        data: '',
        hora: '08:00',
        duracao: 1,
        motivo: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        carregarEspacos();
    }, []);

    const carregarEspacos = async () => {
        try {
            const res = await api.get('/espacos');
            setEspacos(res.data);
            if (res.data.length > 0) {
                setFormData(prev => ({ ...prev, espaco_id: res.data[0].id }));
            }
        } catch (err) {
            Store.addNotification({ title: "Erro", message: "Falha ao buscar cenários.", type: "danger", container: "top-right", dismiss: { duration: 3000 } });
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleBloquear = async (e) => {
        e.preventDefault();
        
        if (!formData.espaco_id || !formData.data || !formData.hora) {
            Store.addNotification({ title: "Atenção", message: "Preencha espaço, data e hora.", type: "warning", container: "top-right", dismiss: { duration: 3000 } });
            return;
        }

        setLoading(true);

        try {
            const dataInicio = new Date(`${formData.data}T${formData.hora}:00`);
            const dataFim = new Date(dataInicio.getTime() + formData.duracao * 60 * 60 * 1000);

            await api.post('/agendamentos/bloquear', {
                espaco_id: formData.espaco_id,
                data_inicio: dataInicio.toISOString(),
                data_fim: dataFim.toISOString(),
                motivo: formData.motivo || 'BLOQUEIO_ADMIN'
            });

            Store.addNotification({ 
                title: "Horário Bloqueado!", 
                message: "O cenário não estará disponível para clientes neste período.", 
                type: "success", 
                container: "top-right", 
                dismiss: { duration: 4000 } 
            });

            setFormData({ ...formData, data: '', motivo: '' });

        } catch (err) {
            const msgErro = err.response?.data?.msg || "Erro ao bloquear horário.";
            Store.addNotification({ title: "Falha no Bloqueio", message: msgErro, type: "danger", container: "top-right", dismiss: { duration: 4000 } });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-page-container fade-in">
            <div className="admin-header-row">
                <div className="header-text">
                    <h2 className="admin-title">Bloquear Horários</h2>
                    <p className="admin-subtitle">Feche a agenda de um cenário para manutenção ou locações externas.</p>
                </div>
            </div>

            <div className="bloqueio-card">
                <div className="bloqueio-icon-header">
                    <div className="icon-circle"><FaLock /></div>
                    <h3>Novo Bloqueio de Agenda</h3>
                </div>

                <form onSubmit={handleBloquear} className="bloqueio-form">
                    <div className="form-row">
                        <div className="form-group flex-2">
                            <label><FaCameraRetro className="label-icon"/> Selecione o Cenário</label>
                            <select 
                                name="espaco_id" 
                                className="vetra-input" 
                                value={formData.espaco_id} 
                                onChange={handleChange}
                                required
                            >
                                <option value="" disabled>Escolha um espaço...</option>
                                {espacos.map(e => (
                                    <option key={e.id} value={e.id}>{e.nome}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label><FaCalendarAlt className="label-icon"/> Data</label>
                            <input 
                                type="date" 
                                name="data" 
                                className="vetra-input" 
                                value={formData.data} 
                                onChange={handleChange} 
                                min={new Date().toISOString().split('T')[0]}
                                required 
                            />
                        </div>

                        <div className="form-group">
                            <label><FaClock className="label-icon"/> Hora de Início</label>
                            <input 
                                type="time" 
                                name="hora" 
                                className="vetra-input" 
                                value={formData.hora} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>

                        <div className="form-group">
                            <label><FaClock className="label-icon"/> Duração (Horas)</label>
                            <input 
                                type="number" 
                                name="duracao" 
                                className="vetra-input" 
                                min="1" 
                                max="24"
                                value={formData.duracao} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group flex-2">
                            <label><FaCommentDots className="label-icon"/> Motivo (Opcional - Apenas controle interno)</label>
                            <input 
                                type="text" 
                                name="motivo" 
                                className="vetra-input" 
                                placeholder="Ex: Ensaio no Jardim (Cliente Externo), Manutenção do Ar..." 
                                value={formData.motivo} 
                                onChange={handleChange} 
                            />
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn-confirm-save btn-bloquear" disabled={loading}>
                            {loading ? 'Bloqueando...' : <><FaLock /> Confirmar Bloqueio</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminBloqueios;