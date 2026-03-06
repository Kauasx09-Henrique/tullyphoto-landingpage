import React, { useState } from 'react';
import { useNavigate, Link, Outlet, useLocation } from 'react-router-dom';
import { Store } from 'react-notifications-component';
import {
    FaChartPie, FaBuilding, FaUsers, FaCalendarAlt,
    FaSignOutAlt, FaSearch, FaUserCircle, FaCamera, FaLock
} from 'react-icons/fa';
import api from '../../services/api';
import './styles/adminlayout.css';

const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : { nome: 'Admin', tipo: 'ADMIN', logo_url: null, foto: null };
    });

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const handleLogoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('logo', file);

        try {
            const res = await api.put(`/usuarios/${user.id}/logo`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            const updatedUser = { ...user, logo_url: res.data.logo_url };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));

            Store.addNotification({
                title: "Sucesso",
                message: "Sua logo foi atualizada!",
                type: "success",
                insert: "top",
                container: "top-right",
                dismiss: { duration: 3000 }
            });
        } catch (error) {
            Store.addNotification({
                title: "Erro",
                message: "Não foi possível atualizar a logo.",
                type: "danger",
                insert: "top",
                container: "top-right",
                dismiss: { duration: 3000 }
            });
        }
    };

    return (
        <div className="admin-wrapper fade-in">
            <div className="liquid-ambient-bg"></div>

            <header className="liquid-topbar">
                <div className="topbar-brand">
                    <div className="brand-upload" onClick={() => document.getElementById('logoInput').click()}>
                        {user.logo_url ? (
                            <img src={user.logo_url} alt="Logo" className="custom-brand-logo" />
                        ) : (
                            <h1 className="brand-text">VETRA<span>.ADMIN</span></h1>
                        )}
                        <div className="brand-upload-overlay">
                            <FaCamera />
                        </div>
                    </div>
                    <input
                        type="file"
                        id="logoInput"
                        hidden
                        accept="image/png, image/jpeg"
                        onChange={handleLogoUpload}
                    />
                </div>

                <div className="topbar-search">
                    <FaSearch className="search-icon" />
                    <input type="text" placeholder="Pesquisar no sistema..." />
                </div>

                <div className="topbar-actions">
                    <div className="profile-badge">
                        {user.foto ? (
                            <img src={user.foto} alt={user.nome} referrerPolicy="no-referrer" />
                        ) : (
                            <FaUserCircle className="fallback-avatar" />
                        )}
                        <span className="profile-name">{user.nome.split(' ')[0]}</span>
                    </div>
                    <button onClick={handleLogout} className="liquid-logout-btn" title="Sair">
                        <FaSignOutAlt />
                    </button>
                </div>
            </header>

            <main className="liquid-main-content">
                <div className="content-container">
                    <Outlet />
                </div>
            </main>

            <nav className="liquid-glass-dock">
                <Link to="/admin/dashboard" className={`dock-item ${location.pathname.includes('dashboard') ? 'active' : ''}`} title="Overview">
                    <div className="dock-icon-wrapper"><FaChartPie /></div>
                    <span>Overview</span>
                </Link>

                <Link to="/admin/agenda" className={`dock-item ${location.pathname.includes('agenda') ? 'active' : ''}`} title="Agenda">
                    <div className="dock-icon-wrapper"><FaCalendarAlt /></div>
                    <span>Agenda</span>
                </Link>

                <Link to="/admin/espacos" className={`dock-item ${location.pathname.includes('espacos') ? 'active' : ''}`} title="Cenários">
                    <div className="dock-icon-wrapper"><FaBuilding /></div>
                    <span>Cenários</span>
                </Link>

                <Link to="/admin/usuarios" className={`dock-item ${location.pathname.includes('usuarios') ? 'active' : ''}`} title="Usuários">
                    <div className="dock-icon-wrapper"><FaUsers /></div>
                    <span>Usuários</span>
                </Link>

                <Link to="/admin/bloqueios" className={`dock-item ${location.pathname.includes('bloqueios') ? 'active' : ''}`} title="Bloqueios">
                    <div className="dock-icon-wrapper"><FaLock /></div>
                    <span>Bloqueios</span>
                </Link>
            </nav>
        </div>
    );
};

export default AdminLayout;