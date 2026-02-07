import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
    FaUserCircle, FaSignOutAlt, FaSignInAlt,
    FaBars, FaTimes, FaArrowRight,
    FaBell, FaCheck
} from 'react-icons/fa';
import api from '../services/api';
import '../styles/header.css';
import logoImg from "./logo.png";

const Header = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // States de Notificação
    const [notificacoes, setNotificacoes] = useState([]);
    const [showNotif, setShowNotif] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    const navigate = useNavigate();
    const location = useLocation();

    const user = JSON.parse(localStorage.getItem('user'));
    const isAdmin = user && user.tipo === 'ADMIN';

    // 1. Efeito de Scroll (Vidro)
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // 2. Busca Notificações (Polling a cada 30s)
    useEffect(() => {
        if (user) {
            fetchNotificacoes();
            const interval = setInterval(fetchNotificacoes, 30000);
            return () => clearInterval(interval);
        }
    }, [user]); // Adicionado dependência user

    const fetchNotificacoes = async () => {
        try {
            const res = await api.get('/notificacoes');
            // Verifica se voltou array, senão define vazio para evitar erro
            const lista = Array.isArray(res.data) ? res.data : [];
            setNotificacoes(lista);

            const naoLidas = lista.filter(n => !n.lida).length;
            setUnreadCount(naoLidas);
        } catch (err) {
            console.error("Erro ao buscar notificações (Header).");
        }
    };

    const handleMarkAsRead = async (id) => {
        try {
            await api.put(`/notificacoes/${id}/ler`);
            // Atualiza visualmente na hora
            setNotificacoes(prev => prev.map(n => n.id === id ? { ...n, lida: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) {
            console.error(err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setMobileOpen(false);
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path ? 'active-link' : '';

console.log("=== DEBUG HEADER ===");
console.log("Usuário logado:", user);
console.log("Notificações no Estado:", notificacoes);

    return (
        <header className={`header ${scrolled ? 'header-scrolled' : ''}`}>
            <div className="header-container">

                {/* LOGO */}
                <div className="logo-area">
                    <Link to="/" onClick={() => setMobileOpen(false)}>
                        <img src={logoImg} alt="Vetra" className="brand-logo" />
                    </Link>
                </div>

                {/* MENU WRAPPER */}
                <div className={`nav-wrapper ${mobileOpen ? 'mobile-open' : ''}`}>

                    <div className="mobile-close" onClick={() => setMobileOpen(false)}>
                        <FaTimes />
                    </div>

                    {/* LINKS DE NAVEGAÇÃO */}
                    <nav className="main-nav">
                        <ul className="nav-links">
                            <li><Link to="/" className={`link-item ${isActive('/')}`} onClick={() => setMobileOpen(false)}>Home</Link></li>
                            <li><Link to="/portfolio" className={`link-item ${isActive('/portfolio')}`} onClick={() => setMobileOpen(false)}>Portfólio</Link></li>

                            {user && (
                                isAdmin ? (
                                    <li><Link to="/admin/dashboard" className={`link-item ${isActive('/admin/dashboard')}`} onClick={() => setMobileOpen(false)}>Painel</Link></li>
                                ) : (
                                    <li><Link to="/meus-agendamentos" className={`link-item ${isActive('/meus-agendamentos')}`} onClick={() => setMobileOpen(false)}>Minhas Reservas</Link></li>
                                )
                            )}
                        </ul>
                    </nav>

                    {/* ÁREA DO USUÁRIO & AÇÕES */}
                    <div className="user-actions">
                        {user ? (
                            <>
                                {/* --- SINO DE NOTIFICAÇÃO (Aqui está ele!) --- */}
                                <div className="notif-wrapper">
                                    <div className="notif-icon-box" onClick={() => setShowNotif(!showNotif)}>
                                        <FaBell />
                                        {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
                                    </div>

                                    {/* DROPDOWN */}
                                    {showNotif && (
                                        <div className="notif-dropdown">
                                            <div className="notif-header">
                                                <h4>Notificações</h4>
                                                <button onClick={() => setShowNotif(false)}><FaTimes /></button>
                                            </div>
                                            <div className="notif-list">
                                                {notificacoes.length === 0 ? (
                                                    <p className="notif-empty">Nenhuma notificação recente.</p>
                                                ) : (
                                                    notificacoes.map(notif => (
                                                        <div key={notif.id} className={`notif-item ${!notif.lida ? 'unread' : ''}`}>
                                                            <p>{notif.mensagem}</p>
                                                            {!notif.lida && (
                                                                <button className="btn-read" onClick={() => handleMarkAsRead(notif.id)} title="Marcar como lida">
                                                                    <FaCheck />
                                                                </button>
                                                            )}
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {/* --- FIM DO SINO --- */}

                                {/* NOME USUÁRIO */}
                                <div className="user-badge">
                                    <FaUserCircle className="user-icon" />
                                    <span>Olá, <strong>{user.nome ? user.nome.split(' ')[0] : 'User'}</strong></span>
                                </div>

                                {/* BOTÃO AGENDAR */}
                                <Link to="/agendamento" className="btn-gold" onClick={() => setMobileOpen(false)}>
                                    Agendar <FaArrowRight className="btn-arrow" />
                                </Link>

                                {/* LOGOUT */}
                                <button onClick={handleLogout} className="btn-icon-logout" title="Sair">
                                    <FaSignOutAlt />
                                </button>
                            </>
                        ) : (
                            <Link to="/login" className="btn-outline" onClick={() => setMobileOpen(false)}>
                                <FaSignInAlt /> Login
                            </Link>
                        )}
                    </div>
                </div>

                {/* MOBILE TOGGLE */}
                <div className="mobile-toggle" onClick={() => setMobileOpen(true)}>
                    <FaBars />
                </div>

            </div>
        </header>
        
    );
};

export default Header;