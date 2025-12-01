import React, { useState, useEffect } from 'react';
import '../styles/photogrid.css';

const fullPortfolio = [
  { id: 1, src: '/Portifolio1.jpg', category: 'ensaios', alt: 'Ensaio Corporativo' },
  { id: 2, src: '/Portifolio2.jpg', category: 'eventos', alt: 'Evento Social' },
  { id: 3, src: '/Portifolio3.jpg', category: 'estudio', alt: 'Retrato em Estúdio' },
  { id: 4, src: '/Portifolio4.jpg', category: 'ensaios', alt: 'Ensaio Externo' },
  { id: 5, src: '/Portifolio5.jpg', category: 'estudio', alt: 'Moda Editorial' },
];

const Portfolio = () => {
  const [filter, setFilter] = useState('todos');
  const [selectedImg, setSelectedImg] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleFilterChange = (newFilter) => {
    if (newFilter === filter) return;
    setIsAnimating(true);
    setFilter(newFilter);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const filteredPhotos = filter === 'todos' 
    ? fullPortfolio 
    : fullPortfolio.filter(photo => photo.category === filter);

  return (
    <div className="portfolio-page">
      <div className="portfolio-header">
        <h2>Portfólio</h2>
        <p>A essência capturada em cada detalhe.</p>
        
        <div className="filters">
          {['todos', 'ensaios', 'eventos', 'estudio'].map((cat) => (
            <button 
              key={cat}
              className={filter === cat ? 'active' : ''} 
              onClick={() => handleFilterChange(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className={`photo-grid ${isAnimating ? 'fading-out' : 'fading-in'}`}>
        {filteredPhotos.map((photo) => (
          <div key={photo.id} className="photo-item" onClick={() => setSelectedImg(photo)}>
            <img src={photo.src} alt={photo.alt} loading="lazy" />
            <div className="overlay">
              <span className="icon-plus">+</span>
              <span className="text">Visualizar</span>
            </div>
          </div>
        ))}
      </div>

      {selectedImg && (
        <div className="lightbox" onClick={() => setSelectedImg(null)}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedImg(null)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            <img src={selectedImg.src} alt={selectedImg.alt} />
            <div className="lightbox-caption">{selectedImg.alt}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Portfolio;