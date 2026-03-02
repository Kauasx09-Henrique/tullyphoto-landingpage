import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import '../styles/servicecards.css';

const services = [
  {
    id: 1,
    title: 'Frame 05',
    subtitle: 'Ensaio Fotográfico',
    price: 'R$ 500,00',
    details: '5 fotos / 30 minutos',
    description: 'Um ensaio rápido, direcionado e eficiente, mantendo o padrão Vetra.',
    image: '/Card/Ensaio_Card1.jpeg',
    message: 'Olá, gostaria de agendar o pacote Frame 05.'
  },
  {
    id: 2,
    title: 'Frame 20',
    subtitle: 'Ensaio Fotográfico',
    price: 'R$ 1.000,00',
    details: '20 fotos / 60 minutos',
    description: 'Perfeito para quem busca variedade e consistência visual.',
    image: '/Card/Ensaio_Card2.jpeg',
    message: 'Olá, gostaria de agendar o pacote Frame 20.'
  },
  {
    id: 3,
    title: 'Frame 30',
    subtitle: 'Ensaio Fotográfico',
    price: 'R$ 1.450,00',
    details: '30 fotos / 90 minutos',
    description: 'Um acervo de imagens pensado para sustentar sua marca no longo prazo.',
    image: '/Card/Ensaio_Card3.jpeg',
    message: 'Olá, gostaria de agendar o pacote Frame 30.'
  }
];

const ServiceCards = () => {
  const whatsappNumber = "556182873111";

  return (
    <section className="services-section">
      <div className="services-intro-container fade-in">
        <h2 className="intro-title">
          No Estúdio Vetra, você conta com o nosso time para construir suas imagens.
        </h2>
        <div className="intro-gold-divider"></div>
        
        <div className="intro-text-body">
          <p>
            Os ensaios fotográficos são conduzidos com direção cuidadosa e olhar atento, para criar imagens elegantes, consistentes e alinhadas ao momento que você está vivendo.
          </p>
          <p>
            Pensamos junto, organizamos ideias e construímos imagens que representem você de forma verdadeira e consciente. Seja para sua marca ou para um novo momento da sua trajetória, o ensaio é um espaço de presença e construção.
          </p>
          <p className="intro-highlight">
            Agende seu ensaio e comece a construir a imagem que representa quem você é hoje.
          </p>
        </div>
      </div>

      <div className="services-grid">
        {services.map((service) => (
          <div key={service.id} className="service-card">
            
            <div 
              className="card-bg-image" 
              style={{ backgroundImage: `url(${service.image})` }}
            ></div>

            <div className="card-overlay"></div>
            
            <div className="card-content">
              <div className="card-header-group">
                <h3 className="card-title">{service.title}</h3>
                <span className="card-subtitle">{service.subtitle}</span>
              </div>
              
              <div className="static-info">
                <span className="card-price">{service.price}</span>
                
                <span className="card-details">{service.details}</span>
                <p className="card-description">{service.description}</p>
                
                <a 
                  href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(service.message)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card-button"
                >
                  Agendar <FaWhatsapp style={{ marginLeft: 8, fontSize: '1.2em' }} />
                </a>
              </div>

            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ServiceCards;