import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Store } from 'react-notifications-component';
import { FaEnvelope, FaSpinner, FaArrowLeft } from 'react-icons/fa';
import api from '../services/api';
import '../styles/auth.css';

export default function EsqueceuSenha() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);

        try {
            // O Backend deve enviar um e-mail com um link contendo um token
            await api.post('/auth/esqueceu-senha', { email });
            
            Store.addNotification({
                title: "E-mail enviado!",
                message: "Verifique sua caixa de entrada para redefinir a senha.",
                type: "success",
                insert: "top",
                container: "top-right",
                dismiss: { duration: 5000 }
            });
            
            setEmail(''); // Limpa o campo após sucesso
        } catch (err) {
            const msg = err.response?.data?.msg || 'Erro ao enviar e-mail.';
            Store.addNotification({
                title: "Atenção",
                message: msg,
                type: "warning", // Use warning para não expor se o email existe ou não por segurança
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
                    <h2 className="auth-title">Recuperar Senha</h2>
                    <p className="auth-subtitle">Digite seu e-mail para receber o link</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="input-wrapper">
                        <FaEnvelope className="input-icon" />
                        <input 
                            className="auth-input"
                            type="email" 
                            placeholder="Seu E-mail cadastrado" 
                            value={email} 
                            onChange={e => setEmail(e.target.value)} 
                            required 
                        />
                    </div>

                    <button type="submit" className="auth-btn" disabled={loading}>
                        {loading ? <FaSpinner className="icon-spin" /> : 'Enviar Link'}
                    </button>
                </form>

                <div className="auth-footer">
                    <Link to="/login" className="auth-link-back">
                        <FaArrowLeft /> Voltar para Login
                    </Link>
                </div>
            </div>
        </div>
    );
}