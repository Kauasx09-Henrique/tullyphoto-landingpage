import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Store } from 'react-notifications-component';
import { FaEnvelope, FaLock, FaSpinner } from 'react-icons/fa';
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

            const usuario = response.data.user;
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(usuario));

            Store.addNotification({
                title: "Sucesso!",
                message: `Bem-vindo de volta, ${usuario.nome.split(' ')[0]}!`,
                type: "success",
                insert: "top",
                container: "top-right",
                animationIn: ["animate__animated", "animate__fadeIn"],
                animationOut: ["animate__animated", "animate__fadeOut"],
                dismiss: { duration: 3000, onScreen: true }
            });

            if (usuario.tipo === 'ADMIN') {
                navigate('/admin/dashboard');
            } else {
                navigate('/agendamento');
            }

        } catch (err) {
            const mensagem = err.response?.data?.msg || 'Credenciais inválidas. Tente novamente.';

            Store.addNotification({
                title: "Acesso Negado",
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

                    <button type="submit" className="auth-btn" disabled={loading}>
                        {loading ? <FaSpinner className="icon-spin" /> : 'Entrar'}
                    </button>
                </form>

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