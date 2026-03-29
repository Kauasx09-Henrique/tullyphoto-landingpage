import React, { useRef } from 'react';
import '../styles/carrosel.css';

const photos = [
  {
    id: 1,
    src: '/carrosel/Foto_Inicio.webp',
    title: 'Espaço Criativo',
    subtitle: 'Ambientes inspiradores para suas fotos'
  },
  {
    id: 2,
    src: '/carrosel/Mesa.webp',
    title: 'Estúdio Profissional',
    subtitle: 'Alugue o estúdio'
  },
  {
    id: 3,
    src: '/carrosel/cadeira.webp',
    title: 'Conforto & Design',
    subtitle: 'Conheça nosso espaço'
  },
  {
    id: 4,
    src: './carrosel/cadeiraM.webp',
    title: "Estudio Completo",
    subtitle: "Alugue o estúdio"
  }
];

const PhotoGrid = () => {
  const containerRef = useRef(null);

  const scroll = (direction) => {
    const container = containerRef.current;
    const width = container.offsetWidth;

    container.scrollBy({
      left: direction === 'next' ? width : -width,
      behavior: 'smooth'
    });
  };

  return (
    <section className="carousel-section">

      <div className="carousel-container" ref={containerRef}>
        {photos.map((photo, index) => (
          <div className="carousel-item" key={photo.id}>
            <img
              src={photo.src}
              alt={photo.title}
              loading={index === 0 ? "eager" : "lazy"}
              fetchPriority={index === 0 ? "high" : "auto"}
            />

            <div className="overlay-gradient"></div>

            <div className="slide-content">
              <h3>{photo.subtitle}</h3>
              <h2>{photo.title}</h2>
              <div className="divider-small"></div>
            </div>
          </div>
        ))}
      </div>

      <button className="nav prev" onClick={() => scroll('prev')}>‹</button>
      <button className="nav next" onClick={() => scroll('next')}>›</button>

    </section>
  );
};

export default PhotoGrid;