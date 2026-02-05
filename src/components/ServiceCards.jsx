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
      <div className="services-grid">
        {services.map((service) => (
          <div key={service.id} className="service-card">
            
            <div 
              className="card-bg-image" 
              style={{ backgroundImage: `url(${service.image})` }}
            ></div>

            <div className="card-overlay"></div>
            
            <div className="card-content">
              <h3 className="card-title">{service.title}</h3>
              <span className="card-subtitle">{service.subtitle}</span>
              
              <div className="static-info">
                <span className="card-price">{service.price}</span>
                
                <div className="text-block">
                    <span className="card-details">{service.details}</span>
                    <p className="card-description">{service.description}</p>
                </div>
                
                <a 
                  href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(service.message)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card-button"
                >
                  Agendar <FaWhatsapp style={{ marginLeft: 5, fontSize: '1.1em' }} /> <span>&rarr;</span>
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