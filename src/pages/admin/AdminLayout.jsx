import React from 'react';
import { useNavigate, Link, Outlet, useLocation } from 'react-router-dom';
import { 
    FaChartPie, FaBuilding, FaUsers, FaCalendarAlt, 
    FaSignOutAlt, FaBell, FaSearch, FaUserCircle 
} from 'react-icons/fa';
import '../../styles/admin.css';

const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Mock de usuário (Substitua pelo seu contexto real)
    const user = { nome: 'Kauã Henrique', cargo: 'CEO & Founder' };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div className="admin-wrapper">
            {/* --- SIDEBAR --- */}
            <aside className="vetra-sidebar">
                {/* Logo */}
                <div className="sidebar-brand">
                    <h1 className="brand-text">VETRA<span>.ADMIN</span></h1>
                </div>

                {/* Perfil Mini */}
                <div className="sidebar-profile">
                    <div className="profile-avatar">
                        <FaUserCircle />
                    </div>
                    <div className="profile-info">
                        <strong>{user.nome}</strong>
                        <span>{user.cargo}</span>
                    </div>
                </div>

                {/* Navegação */}
                <nav className="sidebar-nav">
                    <p className="nav-label">ANALYTICS</p>
                    
                    <Link to="/admin/dashboard" className={`nav-item ${location.pathname.includes('dashboard') ? 'active' : ''}`}>
                        <FaChartPie className="nav-icon" />
                        <span>Visão Geral</span>
                    </Link>

                    <Link to="/admin/agenda" className={`nav-item ${location.pathname.includes('agenda') ? 'active' : ''}`}>
                        <FaCalendarAlt className="nav-icon" />
                        <span>Agenda Global</span>
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
                </nav>

                {/* Footer Sidebar */}
                <div className="sidebar-footer">
                    <button onClick={handleLogout} className="logout-btn">
                        <FaSignOutAlt /> Sair
                    </button>
                </div>
            </aside>

            {/* --- CONTEÚDO PRINCIPAL --- */}
            <main className="main-content">
                {/* Topbar Flutuante */}
                <header className="topbar">
                    <div className="search-bar">
                        <FaSearch className="search-icon" />
                        <input type="text" placeholder="Pesquisar..." />
                    </div>
                    
                    <div className="topbar-actions">
                        <button className="icon-btn">
                            <FaBell />
                            <span className="badge-dot"></span>
                        </button>
                        <div className="divider-vertical"></div>
                        <span className="date-display">
                            {new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}
                        </span>
                    </div>
                </header>

                {/* Área de Renderização das Páginas */}
                <div className="content-scroll">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;