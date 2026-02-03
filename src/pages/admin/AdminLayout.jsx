import React, { useEffect } from 'react';
import { useNavigate, Link, Outlet, useLocation } from 'react-router-dom';
import '../../styles/admin.css';

const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem('user'));

    // Proteção de Rota: Se não for ADMIN, chuta pra fora
    useEffect(() => {
        if (!user || user.tipo !== 'ADMIN') {
            alert("Acesso restrito a administradores.");
            navigate('/');
        }
    }, [user, navigate]);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    if (!user || user.tipo !== 'ADMIN') return null;

    return (
        <div className="admin-container">
            {/* Sidebar Fixa */}
            <aside className="admin-sidebar">
                <div className="admin-logo">Vetra Admin</div>
                <nav className="admin-nav">
                    <Link to="/admin/dashboard" className={location.pathname.includes('dashboard') ? 'active' : ''}>
                        Dashboard
                    </Link>
                    <Link to="/admin/espacos" className={location.pathname.includes('espacos') ? 'active' : ''}>
                        Gerenciar Espaços
                    </Link>
                    <Link to="/admin/usuarios" className={location.pathname.includes('usuarios') ? 'active' : ''}>
                    Gereciar Usuarios
                    </Link>
                    <Link to="/admin/agenda" className={location.pathname.includes('agenda') ? 'active' : ''}>
                        Agenda Global
                    </Link>
                </nav>
                <button onClick={handleLogout} className="admin-logout">Sair</button>
            </aside>

            {/* Conteúdo Muda Aqui */}
            <main className="admin-content">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;