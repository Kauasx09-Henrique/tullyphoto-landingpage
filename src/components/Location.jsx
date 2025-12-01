import React from 'react';
import '../styles/location.css';

const Location = () => {
    return (
        <section id="contato" className="location-section">
            <div className="location-container">
                <div className="location-info">
                    <h2>Localização</h2>
                    <div className="info-item">
                        <h3>Endereço</h3>
                        <p>
                            Rua da Fotografia, 150<br />
                            Bairro das Artes<br />
                            São Paulo - SP
                        </p>
                    </div>
                    <div className="info-item">
                        <h3>Contato</h3>
                        <p>
                            (11) 99999-9999<br />
                            contato@seusite.com.br
                        </p>
                    </div>
                    <a
                        href="https://share.google/GGjR9bA4nT1Kf3kRa"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="directions-btn"
                    >
                        abrir no maps &rarr;
                    </a>
                </div>

                <div className="location-map">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m12!1m8!1m3!1d245743.77577908634!2d-48.0046355!3d-15.7645443!3m2!1i1024!2i768!4f13.1!2m1!1stuly%20migotto!5e0!3m2!1spt-BR!2sbr!4v1764427502600!5m2!1spt-BR!2sbr"
                        width="600"
                        height="450"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>
            </div>
        </section>
    );
};

export default Location;