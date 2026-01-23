import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Store } from 'react-notifications-component';
import { FaUser, FaEnvelope, FaLock, FaSpinner, FaArrowLeft } from 'react-icons/fa';
import api from '../services/api';
import '../styles/auth.css';

export default function Cadastro() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function handleCadastro(e) {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post('/auth/register', { nome, email, senha });

            Store.addNotification({
                title: "Bem-vindo(a)!",
                message: "Conta criada com sucesso. Faça login para começar.",
                type: "success",
                insert: "top",
                container: "top-right",
                animationIn: ["animate__animated", "animate__fadeIn"],
                animationOut: ["animate__animated", "animate__fadeOut"],
                dismiss: { duration: 4000, onScreen: true }
            });

            navigate('/login');
        } catch (err) {
            const mensagem = err.response?.data?.error || 'Não foi possível criar a conta.';

            Store.addNotification({
                title: "Erro no Cadastro",
                message: mensagem,
                type: "danger",
                insert: "top",
                container: "top-right",
                animationIn: ["animate__animated", "animate__shakeX"],
                animationOut: ["animate__animated", "animate__fadeOut"],
                dismiss: { duration: 4000, onScreen: true }
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-header">
                    <h2 className="auth-title">Vetra</h2>
                    <p className="auth-subtitle">Crie sua conta exclusiva</p>
                </div>

                <form onSubmit={handleCadastro} className="auth-form">
                    <div className="input-wrapper">
                        <FaUser className="input-icon" />
                        <input
                            className="auth-input"
                            type="text"
                            placeholder="Nome Completo"
                            value={nome}
                            onChange={e => setNome(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-wrapper">
                        <FaEnvelope className="input-icon" />
                        <input
                            className="auth-input"
                            type="email"
                            placeholder="Seu Melhor E-mail"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-wrapper">
                        <FaLock className="input-icon" />
                        <input
                            className="auth-input"
                            type="password"
                            placeholder="Defina uma Senha"
                            value={senha}
                            onChange={e => setSenha(e.target.value)}
                            required
                            minLength={6}
                        />
                    </div>

                    <button type="submit" className="auth-btn" disabled={loading}>
                        {loading ? <FaSpinner className="icon-spin" /> : 'Cadastrar'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p className="auth-text">
                        Já é membro?
                        <Link to="/login" className="auth-link">Fazer Login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}