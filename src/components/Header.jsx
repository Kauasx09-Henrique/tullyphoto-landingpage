import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaUserCircle,
  FaSignOutAlt,
  FaSignInAlt,
  FaTachometerAlt,
  FaBars,
  FaTimes,
  FaCalendarCheck
} from 'react-icons/fa';
import '../styles/header.css';

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));
  const isAdmin = user && user.tipo === 'ADMIN';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setMobileOpen(false);
    navigate('/login');
  };

  const closeMenu = () => setMobileOpen(false);

  return (
    <header className={`header ${scrolled ? 'header-scrolled' : 'header-transparent'}`}>
      <div className="header-container">

        <div className="logo">
          <Link to="/" onClick={closeMenu}>
            <img src="/logo/logo.png" alt="Estúdio Vetra" className="logo-img" />
          </Link>
        </div>

        <div className="mobile-menu-icon" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <FaTimes /> : <FaBars />}
        </div>

        <nav className={`nav ${mobileOpen ? 'nav-mobile-active' : ''}`}>
          <ul className="nav-list">
            <li><Link to="/" className="nav-link" onClick={closeMenu}>Home</Link></li>
            <li><Link to="/portfolio" className="nav-link" onClick={closeMenu}>Portfólio</Link></li>

            {user ? (
              <>
                {isAdmin ? (
                  <li>
                    <Link to="/admin/dashboard" className="nav-link" onClick={closeMenu}>
                      <FaTachometerAlt /> Painel
                    </Link>
                  </li>
                ) : (
                  <li>
                    <Link to="/meus-agendamentos" className="nav-link" onClick={closeMenu}>
                      Reservas
                    </Link>
                  </li>
                )}

                <li>
                  <span className="nav-link user-welcome" style={{ cursor: 'default' }}>
                    <FaUserCircle /> {user.nome.split(' ')[0]}
                  </span>
                </li>

                <li>
                  <button onClick={handleLogout} className="btn-logout nav-link" title="Sair">
                    <FaSignOutAlt /> Sair
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link to="/login" className="nav-link" onClick={closeMenu}>
                  <FaSignInAlt /> Login
                </Link>
              </li>
            )}

            <li>
              <Link to="/agendamento" className="nav-link btn-agendar" onClick={closeMenu}>
                <FaCalendarCheck /> Agendar
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;