import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/servicecards.css';

const services = [
  {
    id: 1,
    title: 'Frame 05',
    subtitle: 'Ensaio Fotográfico',
    price: 'R$ 500,00',
    // Separei em duas linhas para estilizar melhor
    details: '5 fotos / 30 minutos',
    description: 'Um ensaio rápido, direcionado e eficiente, mantendo o padrão Vetra.',
    image: '/Card/Ensaio_Card1.jpg',
    link: '/agendamento',
    btnText: 'Agendar'
  },
  {
    id: 2,
    title: 'Frame 20',
    subtitle: 'Ensaio Fotográfico',
    price: 'R$ 1.000,00',
    details: '20 fotos / 60 minutos',
    description: 'Perfeito para quem busca variedade e consistência visual.',
    image: '/Card/Ensaio_Card2.jpg',
    link: '/agendamento',
    btnText: 'Agendar'
  },
  {
    id: 3,
    title: 'Frame 30',
    subtitle: 'Ensaio Fotográfico', // Alterado conforme pedido
    price: 'R$ 1.450,00',
    details: '30 fotos / 90 minutos',
    description: 'Um acervo de imagens pensado para sustentar sua marca no longo prazo.',
    image: '/Card/Ensaio_Card3.jpg',
    link: '/agendamento',
    btnText: 'Agendar'
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

                {/* Bloco de Texto Atualizado */}
                <div className="text-block">
                  <span className="card-details">{service.details}</span>
                  <p className="card-description">{service.description}</p>
                </div>

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