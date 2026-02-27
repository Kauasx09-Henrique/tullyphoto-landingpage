import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
    FaUserCircle, FaSignOutAlt, FaBars, FaTimes, 
    FaArrowRight, FaBell, FaCheck
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

    // RESET DE SCROLL: Garante que a nova página sempre abra no topo
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    // HEADER VIDRO NO SCROLL
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // NOTIFICAÇÕES
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
        } catch (err) { console.error("Erro Notificações"); }
    };

    const handleMarkAsRead = async (id) => {
        try {
            await api.put(`/notificacoes/${id}/ler`);
            setNotificacoes(prev => prev.map(n => n.id === id ? { ...n, lida: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) { console.error(err); }
    };

    const handleLogout = () => {
        localStorage.clear();
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
                
                {/* LOGO */}
                <Link to="/" className="logo-area" onClick={() => setMobileOpen(false)}>
                    <img src={logoImg} alt="Vetra Studio" className="brand-logo" />
                </Link>

                {/* OVERLAY PARA O MENU MOBILE */}
                <div className={`nav-overlay ${mobileOpen ? 'open' : ''}`} onClick={() => setMobileOpen(false)}></div>

                {/* NAV WRAPPER (DRAWER) */}
                <div className={`nav-wrapper ${mobileOpen ? 'mobile-open' : ''}`}>
                    
                    {/* CABEÇALHO DO MENU MOBILE (SÓ APARECE NO CELULAR) */}
                    <div className="mobile-only-header">
                        <span className="menu-brand-name">Vetra Menu</span>
                        <FaTimes className="mobile-close-btn" onClick={() => setMobileOpen(false)} />
                    </div>

                    <nav className="main-nav">
                        <ul className="nav-links">
                            <li><Link to="/" className={`link-item ${isActive('/')}`} onClick={() => setMobileOpen(false)}>Início</Link></li>
                            <li><Link to="/portfolio" className={`link-item ${isActive('/portfolio')}`} onClick={() => setMobileOpen(false)}>Portfólio</Link></li>
                            <li><Link to="/Equipe" className={`link-item ${isActive('/Equipe')}`} onClick={() => setMobileOpen(false)}>Equipe</Link></li>
                            <li><Link to="/ServiceCards" className={`link-item ${isActive('/ServiceCards')}`} onClick={() => setMobileOpen(false)}>Serviços</Link></li>
                            {user && !isAdmin && (
                                <li><Link to="/meus-agendamentos" className={`link-item ${isActive('/meus-agendamentos')}`} onClick={() => setMobileOpen(false)}>Reservas</Link></li>
                            )}
                        </ul>
                    </nav>

                    <div className="user-actions">
                        {user ? (
                            <div className="auth-group-wrapper">
                                {/* NOTIFICAÇÕES */}
                                <div className="notif-wrapper">
                                    <div className={`notif-icon-box ${unreadCount > 0 ? 'has-unread' : ''}`} onClick={() => setShowNotif(!showNotif)}>
                                        <FaBell />
                                        {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
                                    </div>
                                    {showNotif && (
                                        <div className="notif-dropdown" translate="no">
                                            <div className="notif-header">
                                                <span>Avisos</span>
                                                <FaTimes className="close-notif" onClick={() => setShowNotif(false)} />
                                            </div>
                                            <div className="notif-list">
                                                {notificacoes.length === 0 ? <p className="notif-empty">Tudo limpo.</p> : 
                                                    notificacoes.map(n => (
                                                        <div key={n.id} className={`notif-item ${!n.lida ? 'unread' : ''}`}>
                                                            <p>{n.mensagem}</p>
                                                            {!n.lida && <button onClick={() => handleMarkAsRead(n.id)}><FaCheck /></button>}
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        </div>
                                    )}
                                </div>
                                
                                {/* PERFIL */}
                                <div className="user-profile-menu">
                                    <Link to={isAdmin ? "/admin/dashboard" : "/meus-agendamentos"} className="user-badge-link" onClick={() => setMobileOpen(false)}>
                                        <FaUserCircle className="user-icon" />
                                        <span className="user-name-text"><strong>{user.nome?.split(' ')[0]}</strong></span>
                                    </Link>
                                    <button onClick={handleLogout} className="btn-logout" title="Sair"><FaSignOutAlt /></button>
                                </div>
                            </div>
                        ) : (
                            <Link to="/login" className="btn-login-link" onClick={() => setMobileOpen(false)}>Entrar</Link>
                        )}

                        {/* BOTÃO AGENDAR (Com selo de 15% OFF) */}
                        <div className="agendar-container">
                            <button onClick={handleAgendarClick} className="btn-agendar-premium">
                                <span>Agendar</span>
                                <div className="promo-tag-mini">15% OFF PIX</div>
                                <FaArrowRight className="btn-arrow-icon" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* BOTÃO HAMBURGUER (MOBILE) */}
                <div className="mobile-toggle" onClick={() => setMobileOpen(true)}>
                    <FaBars />
                </div>
            </div>
        </header>
    );
};

export default Header;