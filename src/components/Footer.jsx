import React from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaWhatsapp, FaEnvelope, FaMapMarkerAlt, FaArrowUp } from 'react-icons/fa';
import '../styles/footer.css';

const Footer = () => {
    
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="footer">
            {/* Detalhe Dourado Superior */}
            <div className="footer-border"></div>

            <div className="footer-content">
                
                {/* Coluna 1: Marca */}
                <div className="footer-brand">
                    <h3>Estúdio Vetra</h3>
                    <p>Capturando a essência através de uma ótica atemporal. Espaços, momentos e histórias que merecem ser eternizados.</p>
                    <div className="brand-location">
                        <FaMapMarkerAlt className="icon-gold" />
                        <span> Sepn 513 Bloco D, lote 15 S/Nº, Brasília - DF</span>
                    </div>
                </div>

                {/* Coluna 2: Navegação */}
                <div className="footer-links">
                    <h4>Explorar</h4>
                    <ul>
                        <li><Link to="/" onClick={scrollToTop}>Início</Link></li>
                        <li><Link to="/informacoes" onClick={scrollToTop}>Cenários & Infos</Link></li>
                        <li><Link to="/portfolio" onClick={scrollToTop}>Portfólio</Link></li>
                        <li><Link to="/agendamento" onClick={scrollToTop}>Reservar</Link></li>
                    </ul>
                </div>

                {/* Coluna 3: Contato e Social */}
                <div className="footer-social">
                    <h4>Conecte-se</h4>
                    <div className="contact-info">
                        <a href="mailto:contato@estudiovetra.com.br" className="contact-item">
                            <FaEnvelope /> contato@estudiovetra.com.br
                        </a>
                    </div>
                    
                    <div className="social-icons">
                        <a href="https://www.instagram.com/estudiovetra/" target="_blank" rel="noopener noreferrer" title="Instagram">
                            <FaInstagram />
                        </a>
                        <a href="https://wa.me/556182873111" target="_blank" rel="noopener noreferrer" title="WhatsApp">
                            <FaWhatsapp />
                        </a>
                    </div>
                </div>
            </div>

            {/* Rodapé Inferior */}
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} Estúdio Vetra. Todos os direitos reservados.</p>
                
                <button onClick={scrollToTop} className="back-to-top" title="Voltar ao topo">
                    <FaArrowUp />
                </button>
            </div>
        </footer>
    );
};

export default Footer;