import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Store } from 'react-notifications-component';
import { FaEnvelope, FaLock, FaSpinner, FaGoogle } from 'react-icons/fa';
import { useGoogleLogin } from '@react-oauth/google';
import api from '../services/api';
import '../styles/auth.css';

export default function Login() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function handleLogin(e) {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await api.post('/auth/login', { email, senha });
            finalizarLogin(response.data);
        } catch (err) {
            const mensagem = err.response?.data?.msg || 'Erro ao fazer login.';
            Store.addNotification({
                title: "Erro",
                message: mensagem,
                type: "danger",
                insert: "top",
                container: "top-right",
                dismiss: { duration: 4000 }
            });
        } finally {
            setLoading(false);
        }
    }

    const loginComGoogle = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            // ... (Seu código do Google existente permanece igual)
            try {
                setLoading(true);
                const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
                }).then(res => res.json());

                const response = await api.post('/auth/google', {
                    email: userInfo.email,
                    nome: userInfo.name,
                    googleId: userInfo.sub,
                    foto: userInfo.picture
                });

                finalizarLogin(response.data);

            } catch (error) {
                console.error(error);
                // ... notificacao de erro
            } finally {
                setLoading(false);
            }
        },
        onError: () => {
            // ... notificacao de erro
        }
    });

    function finalizarLogin(data) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        Store.addNotification({
            title: "Sucesso!",
            message: `Bem-vindo, ${data.user.nome.split(' ')[0]}!`,
            type: "success",
            insert: "top",
            container: "top-right",
            dismiss: { duration: 3000 }
        });

        if (data.user.tipo === 'ADMIN') {
            navigate('/admin/dashboard');
        } else {
            navigate('/agendamento');
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-header">
                    <h2 className="auth-title">Vetra</h2>
                    <p className="auth-subtitle">Acesse sua área exclusiva</p>
                </div>

                <form onSubmit={handleLogin} className="auth-form">
                    <div className="input-wrapper">
                        <FaEnvelope className="input-icon" />
                        <input
                            className="auth-input"
                            type="email"
                            placeholder="Seu E-mail"
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
                            placeholder="Sua Senha"
                            value={senha}
                            onChange={e => setSenha(e.target.value)}
                            required
                        />
                    </div>

                    {/* --- NOVO LINK ADICIONADO AQUI --- */}
                    <div className="forgot-password-wrapper">
                        <Link to="/esqueceu-senha" className="forgot-link">
                            Esqueceu a senha?
                        </Link>
                    </div>

                    <button type="submit" className="auth-btn" disabled={loading}>
                        {loading ? <FaSpinner className="icon-spin" /> : 'Entrar'}
                    </button>
                </form>

                <div className="auth-divider">
                    <span>ou</span>
                </div>

                <button
                    type="button"
                    className="google-btn"
                    onClick={() => loginComGoogle()}
                    disabled={loading}
                >
                    <FaGoogle /> Continuar com Google
                </button>

                <div className="auth-footer">
                    <p className="auth-text">
                        Não possui cadastro?
                        <Link to="/cadastro" className="auth-link">Criar conta</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}