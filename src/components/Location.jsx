import React from 'react';
import { FaMapMarkerAlt, FaMap } from 'react-icons/fa';
import '../styles/location.css';

const Location = () => {
  return (
    <section id="contato" className="location-section fade-in">
      <div className="location-container">

        <div className="location-info">
          <h2 className="location-title">A Localização</h2>

          <div className="info-item">
            <div className="icon-wrapper">
              <FaMapMarkerAlt />
            </div>
            <p>
              SEPN Comércio Residencial Norte<br />
              513 Bloco D Ed. Imperador Sala 101<br />
              Asa Norte, Brasília - DF<br />
              71065-310
            </p>
          </div>

          <a
            href="https://share.google/GGjR9bA4nT1Kf3kRa"
            target="_blank"
            rel="noopener noreferrer"
            className="directions-btn"
          >
            Abrir no Maps <FaMap style={{ marginLeft: '10px' }} />
          </a>
        </div>

        <div className="location-map">
          <iframe
            title="Localização Estúdio Vetra"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3839.883712613149!2d-47.88566168514555!3d-15.757303989073615!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x935a3b04873130d9%3A0xcda650d0d829dc74!2sEdif%C3%ADcio%20Imperador!5e0!3m2!1spt-BR!2sbr!4v1700000000000!5m2!1spt-BR!2sbr"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

      </div>
    </section>
  );
};

export default Location;