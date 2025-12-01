import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/header.css'; 

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <h1>Estudio Vetra</h1>
      </div>
      <nav className="nav">
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/portfolio">Portfólio</Link></li>
          <li><a href="#contato">Contato</a></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;