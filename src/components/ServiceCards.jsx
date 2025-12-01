import React from 'react';
import '../styles/servicecards.css';

const services = [
  {
    id: 1,
    title: 'Ensaio Profissional',
    description: 'Imagens de alta qualidade para elevar sua carreira e presença no mercado.',
    image: '../public/Ensaio_Card1.jpg',
    buttonText: 'Agendar',
    link: '#agendar-profissional'
  },
  {
    id: 2,
    title: 'Natal',
    description: 'Registre a magia das festas com cenários exclusivos e encantadores.',
    image: '../public/Ensaio_Card2.jpg',
    buttonText: 'Saiba Mais',
    link: '#natal'
  },
  {
    id: 3,
    title: 'Ensaio Corporativo',
    description: 'Transmita credibilidade e profissionalismo para sua empresa e equipe.',
    image: '../public/Ensaio_Card3.jpg',
    buttonText: 'Orçamento',
    link: '#orcamento'
  }
];

const ServiceCards = () => {
  return (
    <section className="services-section">
      <div className="services-grid">
        {services.map((service) => (
          <div 
            key={service.id} 
            className="service-card" 
            style={{ backgroundImage: `url(${service.image})` }}
          >
            <div className="card-overlay"></div>
            <div className="card-content">
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <a href={service.link} className="card-button">
                {service.buttonText} &rarr;
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ServiceCards;