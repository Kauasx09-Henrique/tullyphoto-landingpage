import React, { useState } from 'react'; // Importe useState
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaSignOutAlt, FaTachometerAlt, FaCalendarCheck, FaBars, FaTimes } from 'react-icons/fa'; 
import '../styles/header.css'; 

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false); // Estado do menu
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const isAdmin = user && user.tipo === 'ADMIN';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setMobileOpen(false); // Fecha menu ao sair
    navigate('/login');
  };

  // Fecha o menu quando clica em um link
  const closeMenu = () => setMobileOpen(false);

  return (
    <header className="header">
      <div className="logo">
        <h1><Link to="/" onClick={closeMenu}>Estudio Vetra</Link></h1>
      </div>

      {/* Ícone Hamburger Mobile */}
      <div className="mobile-menu-icon" onClick={() => setMobileOpen(!mobileOpen)}>
        {mobileOpen ? <FaTimes /> : <FaBars />}
      </div>

      <nav className={`nav`}>
        {/* Adiciona classe 'active' se estiver aberto */}
        <ul className={`nav-list ${mobileOpen ? 'active' : ''}`}>
          <li><Link to="/" onClick={closeMenu}>Home</Link></li>
          <li><Link to="/portfolio" onClick={closeMenu}>Portfólio</Link></li>
          
          {user ? (
            <>
              {isAdmin ? (
                <li>
                  <Link to="/admin/dashboard" className="nav-item-highlight" onClick={closeMenu}>
                    <FaTachometerAlt style={{ marginRight: '5px' }} /> Painel
                  </Link>
                </li>
              ) : (
                <>
                  <li>
                    <Link to="/meus-agendamentos" onClick={closeMenu} style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
                        <FaCalendarCheck /> Minhas Reservas
                    </Link>
                  </li>
                  <li>
                    <Link to="/agendamento" className="nav-item-highlight" onClick={closeMenu}>
                       Agendar Novo
                    </Link>
                  </li>
                </>
              )}

              <li className="user-welcome">
                <FaUserCircle className="icon-user" /> 
                <span>{user.nome.split(' ')[0]}</span>
              </li>

              <li>
                <button onClick={handleLogout} className="btn-logout" title="Sair">
                  <FaSignOutAlt /> Sair
                </button>
              </li>
            </>
          ) : (
            <li><Link to="/login" className="btn-login" onClick={closeMenu}>Login</Link></li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;