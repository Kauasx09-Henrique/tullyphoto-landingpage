import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Store } from 'react-notifications-component';
import { FaLock, FaSpinner } from 'react-icons/fa';
import api from '../services/api';
import '../styles/auth.css';

export default function RedefinirSenha() {
    const [novaSenha, setNovaSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [loading, setLoading] = useState(false);
    
    // Pega o token da URL (query string)
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token'); 
    
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        if (novaSenha !== confirmarSenha) {
            Store.addNotification({
                title: "Erro",
                message: "As senhas não coincidem.",
                type: "warning",
                insert: "top",
                container: "top-right",
                dismiss: { duration: 3000 }
            });
            return;
        }

        if (!token) {
            Store.addNotification({
                title: "Erro",
                message: "Link inválido ou expirado.",
                type: "danger",
                insert: "top",
                container: "top-right",
                dismiss: { duration: 3000 }
            });
            return;
        }

        setLoading(true);

        try {
            await api.post('/auth/redefinir-senha', { token, novaSenha });
            
            Store.addNotification({
                title: "Sucesso!",
                message: "Senha alterada. Faça login agora.",
                type: "success",
                insert: "top",
                container: "top-right",
                dismiss: { duration: 4000 }
            });
            
            navigate('/login');
        } catch (err) {
            const msg = err.response?.data?.msg || 'Erro ao redefinir senha.';
            Store.addNotification({
                title: "Erro",
                message: msg,
                type: "danger",
                insert: "top",
                container: "top-right",
                dismiss: { duration: 4000 }
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-header">
                    <h2 className="auth-title">Nova Senha</h2>
                    <p className="auth-subtitle">Crie uma nova senha segura</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="input-wrapper">
                        <FaLock className="input-icon" />
                        <input 
                            className="auth-input"
                            type="password" 
                            placeholder="Nova Senha" 
                            value={novaSenha} 
                            onChange={e => setNovaSenha(e.target.value)} 
                            required 
                            minLength={6}
                        />
                    </div>

                    <div className="input-wrapper">
                        <FaLock className="input-icon" />
                        <input 
                            className="auth-input"
                            type="password" 
                            placeholder="Confirmar Nova Senha" 
                            value={confirmarSenha} 
                            onChange={e => setConfirmarSenha(e.target.value)} 
                            required 
                        />
                    </div>

                    <button type="submit" className="auth-btn" disabled={loading}>
                        {loading ? <FaSpinner className="icon-spin" /> : 'Alterar Senha'}
                    </button>
                </form>
            </div>
        </div>
    );
}