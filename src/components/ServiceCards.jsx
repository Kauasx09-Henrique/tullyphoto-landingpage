import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/servicecards.css';

const services = [
  {
    id: 1,
    title: 'Frame 05',
    subtitle: 'Ensaio Fotográfico',
    price: 'R$ 500,00',
    description: 'Pacote essencial. Ideal para locações rápidas e ensaios express com qualidade profissional.',
    image: '/Card/Ensaio_Card1.jpg', 
    link: '/agendamento',
    btnText: 'Agendar'
  },
  {
    id: 2,
    title: 'Frame 20',
    subtitle: 'Ensaio Fotográfico',
    price: 'R$ 1.000,00',
    description: 'Nosso plano intermediário. Perfeito para editoriais de moda e produções que exigem mais tempo.',
    image: '/Card/Ensaio_Card2.jpg',
    link: '/agendamento',
    btnText: 'Agendar'
  },
  {
    id: 3,
    title: 'Frame 30',
    subtitle: 'Produção Completa',
    price: 'R$ 1.450,00',
    description: 'A experiência definitiva. Direção de arte, fotografia ilimitada e suporte total da nossa equipe.',
    image: '/Card/Ensaio_Card3.jpg',
    link: '/orcamento',
    btnText: 'Contratar'
  }
];

const ServiceCards = () => {
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
                <p className="card-description">{service.description}</p>
                
                <Link to={service.link}>
                  <button className="card-button">
                    {service.btnText} <span>&rarr;</span>
                  </button>
                </Link>
              </div>

            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ServiceCards;