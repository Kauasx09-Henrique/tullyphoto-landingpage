import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Store } from 'react-notifications-component';
import api from '../services/api';
import '../styles/auth.css';

export default function Cadastro() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const navigate = useNavigate();

    async function handleCadastro(e) {
        e.preventDefault();
        try {
            await api.post('/auth/register', { nome, email, senha });
            
            Store.addNotification({
                title: "Conta Criada!",
                message: "Cadastro realizado com sucesso. Faça login para continuar.",
                type: "success",
                insert: "top",
                container: "top-right",
                animationIn: ["animate__animated", "animate__fadeIn"],
                animationOut: ["animate__animated", "animate__fadeOut"],
                dismiss: { duration: 4000, onScreen: true }
            });
            
            navigate('/login');
        } catch (err) {
            const mensagem = err.response?.data?.error || 'Erro ao tentar cadastrar.';
            
            Store.addNotification({
                title: "Atenção",
                message: mensagem,
                type: "warning",
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
                <h2 className="auth-title">Criar Conta</h2>
                
                <form onSubmit={handleCadastro} className="auth-form">
                    <div className="input-group">
                        <input 
                            className="auth-input"
                            type="text" 
                            placeholder="NOME COMPLETO" 
                            value={nome} 
                            onChange={e => setNome(e.target.value)} 
                            required 
                        />
                    </div>

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
                            placeholder="SENHA" 
                            value={senha} 
                            onChange={e => setSenha(e.target.value)} 
                            required 
                        />
                    </div>

                    <button type="submit" className="auth-btn">Cadastrar</button>
                </form>

                <p className="auth-link">
                    Já tem conta? <Link to="/login">Faça Login</Link>
                </p>
            </div>
        </div>
    );
}