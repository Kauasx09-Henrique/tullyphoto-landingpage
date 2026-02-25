import React, { useState } from 'react';
import { useNavigate, Link, Outlet, useLocation } from 'react-router-dom';
import { Store } from 'react-notifications-component';
import { 
    FaChartPie, FaBuilding, FaUsers, FaCalendarAlt, 
    FaSignOutAlt, FaSearch, FaUserCircle, FaCamera , FaLock
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
            <aside className="vetra-sidebar">
                <div className="sidebar-brand-container">
                    <div className="sidebar-brand-upload" onClick={() => document.getElementById('logoInput').click()}>
                        {user.logo_url ? (
                            <img src={user.logo_url} alt="Logo" className="custom-brand-logo" />
                        ) : (
                            <h1 className="brand-text">VETRA<span>.ADMIN</span></h1>
                        )}
                        <div className="brand-upload-overlay">
                            <FaCamera />
                            <span>Alterar Logo</span>
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

                <div className="sidebar-profile">
                    <div className="profile-avatar">
                        {user.foto ? (
                            <img src={user.foto} alt={user.nome} referrerPolicy="no-referrer" />
                        ) : (
                            <FaUserCircle />
                        )}
                    </div>
                    <div className="profile-info">
                        <strong>{user.nome.split(' ')[0]} {user.nome.split(' ')[1] || ''}</strong>
                        <span>{user.tipo === 'ADMIN' ? 'Administrador' : user.tipo}</span>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    <p className="nav-label">ANALYTICS</p>
                    
                    <Link to="/admin/dashboard" className={`nav-item ${location.pathname.includes('dashboard') ? 'active' : ''}`}>
                        <FaChartPie className="nav-icon" />
                        <span>Visão Geral</span>
                    </Link>

                    <Link to="/admin/agenda" className={`nav-item ${location.pathname.includes('agenda') ? 'active' : ''}`}>
                        <FaCalendarAlt className="nav-icon" />
                        <span>Ver agendamentos</span>
                    </Link>

                    <p className="nav-label">GERENCIAMENTO</p>

                    <Link to="/admin/espacos" className={`nav-item ${location.pathname.includes('espacos') ? 'active' : ''}`}>
                        <FaBuilding className="nav-icon" />
                        <span>Cenários</span>
                    </Link>

                    <Link to="/admin/usuarios" className={`nav-item ${location.pathname.includes('usuarios') ? 'active' : ''}`}>
                        <FaUsers className="nav-icon" />
                        <span>Usuários</span>
                    </Link>
                    <Link to="/admin/Bloqueios" className={`nav-item ${location.pathname.includes('bloqueios') ? 'active' : ''}`}>
                        <FaLock className="nav-icon" />
                        <span>Bloqueios</span>
                    </Link>
                </nav>

                <div className="sidebar-footer">
                    <button onClick={handleLogout} className="logout-btn">
                        <FaSignOutAlt /> Sair
                    </button>
                </div>
            </aside>

            <main className="main-content">
                <header className="topbar">
                    <div className="search-bar">
                        <FaSearch className="search-icon" />
                        <input type="text" placeholder="Pesquisar..." />
                    </div>
                    
                    <div className="topbar-actions">
                        <span className="date-display">
                            {new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}
                        </span>
                    </div>
                </header>

                <div className="content-scroll">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;