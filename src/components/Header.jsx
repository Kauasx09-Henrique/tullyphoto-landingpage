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
    const [notificacoes, setNotificacoes] = useState([]);
    const [showNotif, setShowNotif] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    const navigate = useNavigate();
    const location = useLocation();

    const user = JSON.parse(localStorage.getItem('user'));
    const isAdmin = user && user.tipo === 'ADMIN';

    // --- CORREÇÃO DO SCROLL: Reseta para o topo ao trocar de página ---
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    // Efeito de Vidro no Scroll
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Polling de Notificações
    useEffect(() => {
        if (user) {
            fetchNotificacoes();
            const interval = setInterval(fetchNotificacoes, 30000);
            return () => clearInterval(interval);
        }
    }, [user]);

    const fetchNotificacoes = async () => {
        try {
            const res = await api.get('/notificacoes');
            const lista = Array.isArray(res.data) ? res.data : [];
            setNotificacoes(lista);
            setUnreadCount(lista.filter(n => !n.lida).length);
        } catch (err) {
            console.error("Erro ao carregar notificações.");
        }
    };

    const handleMarkAsRead = async (id) => {
        try {
            await api.put(`/notificacoes/${id}/ler`);
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

    const handleAgendarClick = (e) => {
        e.preventDefault();
        setMobileOpen(false);
        const token = localStorage.getItem('token');
        navigate(token ? '/agendamento' : '/login');
    };

    const isActive = (path) => location.pathname === path ? 'active-link' : '';

    return (
        <header className={`header ${scrolled ? 'header-scrolled' : ''}`}>
            <div className="header-container">
                <div className="logo-area">
                    <Link to="/" onClick={() => setMobileOpen(false)}>
                        <img src={logoImg} alt="Vetra Studio" className="brand-logo" />
                    </Link>
                </div>

                <div className={`nav-wrapper ${mobileOpen ? 'mobile-open' : ''}`}>
                    <div className="mobile-close" onClick={() => setMobileOpen(false)}>
                        <FaTimes />
                    </div>

                    <nav className="main-nav">
                        <ul className="nav-links">
                            <li><Link to="/" className={`link-item ${isActive('/')}`} onClick={() => setMobileOpen(false)}>Home</Link></li>
                            <li><Link to="/portfolio" className={`link-item ${isActive('/portfolio')}`} onClick={() => setMobileOpen(false)}>Portfólio</Link></li>
                            <li><Link to="/Equipe" className={`link-item ${isActive('/Equipe')}`} onClick={() => setMobileOpen(false)}>Equipe</Link></li>
                            <li><Link to="/ServiceCards" className={`link-item ${isActive('/ServiceCards')}`} onClick={() => setMobileOpen(false)}>Serviços</Link></li>
                            {user && !isAdmin && (
                                <li><Link to="/meus-agendamentos" className={`link-item ${isActive('/meus-agendamentos')}`} onClick={() => setMobileOpen(false)}>Reservas</Link></li>
                            )}
                            {isAdmin && (
                                <li><Link to="/admin/dashboard" className={`link-item ${isActive('/admin/dashboard')}`} onClick={() => setMobileOpen(false)}>Painel</Link></li>
                            )}
                        </ul>
                    </nav>

                    <div className="user-actions">
                        {user ? (
                            <>
                                <div className="notif-wrapper">
                                    <div className={`notif-icon-box ${unreadCount > 0 ? 'has-unread' : ''}`} onClick={() => setShowNotif(!showNotif)}>
                                        <FaBell />
                                        {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
                                    </div>
                                    {showNotif && (
                                        <div className="notif-dropdown" translate="no">
                                            <div className="notif-header">
                                                <h4>Avisos</h4>
                                                <button onClick={() => setShowNotif(false)}><FaTimes /></button>
                                            </div>
                                            <div className="notif-list">
                                                {notificacoes.length === 0 ? (
                                                    <p className="notif-empty">Tudo limpo por aqui.</p>
                                                ) : (
                                                    notificacoes.map(notif => (
                                                        <div key={notif.id} className={`notif-item ${!notif.lida ? 'unread' : ''}`}>
                                                            <p>{notif.mensagem}</p>
                                                            {!notif.lida && <button className="btn-read" onClick={() => handleMarkAsRead(notif.id)}><FaCheck /></button>}
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="user-profile-menu">
                                    <div className="user-badge-link">
                                        <FaUserCircle className="user-icon" />
                                        <span className="user-name-text"><strong>{user.nome?.split(' ')[0]}</strong></span>
                                    </div>
                                    <button onClick={handleLogout} className="btn-logout" title="Sair"><FaSignOutAlt /></button>
                                </div>
                            </>
                        ) : (
                            <Link to="/login" className="btn-login-link" onClick={() => setMobileOpen(false)}>Login</Link>
                        )}

                        <div className="agendar-container">
                            <button onClick={handleAgendarClick} className="btn-agendar-premium">
                                <span>Agendar</span>
                                <div className="promo-tag-mini">15% OFF</div>
                                <FaArrowRight />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mobile-toggle" onClick={() => setMobileOpen(true)}>
                    <FaBars />
                </div>
            </div>
        </header>
    );
};

export default Header;