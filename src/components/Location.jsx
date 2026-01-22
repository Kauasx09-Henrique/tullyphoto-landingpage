import React from 'react';
import '../styles/location.css';

const Location = () => {
    return (
        <section id="contato" className="location-section">
            <div className="location-container">
                
                {/* Lado Esquerdo: Informações */}
                <div className="location-info">
                    <h2 className="location-title">A Localização</h2>
                    
                    <div className="info-item">
                        {/* <h3>Endereço</h3> (Opcional, no PDF é direto o texto) */}
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
                        Abrir no Maps →
                    </a>
                </div>

                {/* Lado Direito: Mapa */}
                <div className="location-map">
                    <iframe
                        title="Localização Estúdio Vetra"
                        src="https://www.google.com/maps/embed?pb=!1m12!1m8!1m3!1d245743.77577908634!2d-48.0046355!3d-15.7645443!3m2!1i1024!2i768!4f13.1!2m1!1stuly%20migotto!5e0!3m2!1spt-BR!2sbr!4v1764427502600!5m2!1spt-BR!2sbr" 
                        width="100%"
                        height="100%"
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