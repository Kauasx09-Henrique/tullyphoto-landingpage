import React, { useState, useEffect } from 'react';
import '../styles/photogrid.css';

const Portfolio = () => {
  const [selectedImg, setSelectedImg] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const photos = [
    { id: 1, src: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80', alt: 'Ensaio Corporativo' },
    { id: 2, src: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=600&q=80', alt: 'Evento Social' },
    { id: 3, src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80', alt: 'Retrato em Estúdio' },
    { id: 4, src: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=600&q=80', alt: 'Ensaio Externo' },
    { id: 5, src: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80', alt: 'Moda Editorial' },
    { id: 6, src: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80', alt: 'Casamento' },
    { id: 7, src: 'https://images.unsplash.com/photo-1520854221256-17451cc330e7?auto=format&fit=crop&w=600&q=80', alt: 'Lifestyle' },
    { id: 8, src: 'https://images.unsplash.com/photo-1605901309584-818e25960b8f?auto=format&fit=crop&w=600&q=80', alt: 'Minimalismo' },
  ];

  return (
    <div className="portfolio-page">
      <div className="portfolio-header">
        <h2>Portfólio</h2>
        <p>A essência capturada em cada detalhe.</p>
      </div>

      <div className="photo-grid fading-in">
        {photos.map((photo) => (
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
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
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