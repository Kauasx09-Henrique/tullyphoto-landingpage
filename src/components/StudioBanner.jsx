import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/studiobanner.css';

const StudioBanner = () => {
  return (
    <section className="studio-banner">
      <div className="banner-content">
        <h2>Espaço Criativo</h2>
        <div className="divider"></div>
        <p>
          Dois estúdios profissionais totalmente equipados.
          Flashes, modificadores de luz, fundos infinitos, camarim climatizado 
          e toda infraestrutura para elevar o nível da sua produção.
        </p>
        <Link to="/agendamento" className="cta-button">
          reservar estúdio &rarr;
        </Link>
      </div>
    </section>
  );
};

export default StudioBanner;