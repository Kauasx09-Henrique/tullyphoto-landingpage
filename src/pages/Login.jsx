import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Store } from 'react-notifications-component';
import api from '../services/api';
import '../styles/auth.css';

export default function Login() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const navigate = useNavigate();

    async function handleLogin(e) {
        e.preventDefault();
        try {
            const response = await api.post('/auth/login', { email, senha });
            
            // Salva Token e Usuário
            const usuario = response.data.user;
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(usuario));

            Store.addNotification({
                title: "Sucesso!",
                message: `Bem-vindo(a), ${usuario.nome.split(' ')[0]}!`,
                type: "success",
                insert: "top",
                container: "top-right",
                animationIn: ["animate__animated", "animate__fadeIn"],
                animationOut: ["animate__animated", "animate__fadeOut"],
                dismiss: { duration: 4000, onScreen: true }
            });

            // --- LÓGICA DE REDIRECIONAMENTO ---
            if (usuario.tipo === 'ADMIN') {
                navigate('/admin/dashboard'); // Se for Admin, vai pro painel
            } else {
                navigate('/agendamento'); // Se for Cliente, vai agendar
            }

        } catch (err) {
            const mensagem = err.response?.data?.msg || 'Erro ao fazer login.';

            Store.addNotification({
                title: "Erro no Login",
                message: mensagem,
                type: "danger",
                insert: "top",
                container: "top-right",
                animationIn: ["animate__animated", "animate__shakeX"],
                animationOut: ["animate__animated", "animate__fadeOut"],
                dismiss: { duration: 4000, onScreen: true }
            });
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-container">
                <h2 className="auth-title">Login</h2>

                <form onSubmit={handleLogin} className="auth-form">
                    <div className="input-group">
                        <input 
                            className="auth-input"
                            type="email" 
                            placeholder="SEU EMAIL" 
                            value={email} 
                            onChange={e => setEmail(e.target.value)} 
                            required 
                        />
                    </div>
                    
                    <div className="input-group">
                        <input 
                            className="auth-input"
                            type="password" 
                            placeholder="SUA SENHA" 
                            value={senha} 
                            onChange={e => setSenha(e.target.value)} 
                            required 
                        />
                    </div>

                    <button type="submit" className="auth-btn">Entrar</button>
                </form>

                <p className="auth-link">
                    Não tem uma conta? <Link to="/cadastro">Cadastre-se</Link>
                </p>
            </div>
        </div>
    );
}