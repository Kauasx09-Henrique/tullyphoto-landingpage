import React, { useState, useEffect, useCallback } from 'react';
import { FaTimes, FaChevronLeft, FaChevronRight, FaPlus } from 'react-icons/fa'; // Instale: npm install react-icons
import '../styles/photogrid.css';

const Portfolio = () => {
  const [selectedIndex, setSelectedIndex] = useState(null);

  // Lista de Fotos (IMPORTANTE: Se estiver na pasta public, comece com /)
  const photos = [
    /* Parte Tiago */
    { id: 1, src: '/Tiago/Foto_Ana.jpg', alt: 'Ensaio Corporativo', category: 'Corporativo' },
    { id: 2, src: '/Tiago/Foto_Marias.jpg', alt: 'Evento Social', category: 'Social' },
    { id: 3, src: '/Tiago/Foto_Euler.jpg', alt: 'Retrato em Estúdio', category: 'Estúdio' },
    { id: 4, src: '/Tiago/Foto__Maria.jpg', alt: 'Ensaio Externo', category: 'Externo' },

    /* Parte Tully */
    { id: 5, src: '/Tully/Portifolio3.jpg', alt: 'Moda Editorial', category: 'Editorial' },
    { id: 6, src: '/Tully/Portifolio4.jpg', alt: 'Casamento', category: 'Wedding' },
    { id: 7, src: '/Tully/Portifolio5.jpg', alt: 'Lifestyle', category: 'Lifestyle' },
    { id: 8, src: '/Tully/Portifolio1.jpg', alt: 'Minimalismo', category: 'Artístico' },
  ];

  // Rolar para o topo ao abrir
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Bloquear scroll do body quando lightbox abrir
  useEffect(() => {
    if (selectedIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [selectedIndex]);

  // Funções de Navegação
  const handleNext = useCallback((e) => {
    e?.stopPropagation();
    setSelectedIndex((prev) => (prev + 1) % photos.length);
  }, [photos.length]);

  const handlePrev = useCallback((e) => {
    e?.stopPropagation();
    setSelectedIndex((prev) => (prev - 1 + photos.length) % photos.length);
  }, [photos.length]);

  const closeLightbox = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  // Controle por Teclado (Setas e ESC)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, handleNext, handlePrev, closeLightbox]);

  const currentPhoto = selectedIndex !== null ? photos[selectedIndex] : null;

  return (
    <div className="portfolio-page">
      <div className="portfolio-header">
        <h2>Portfólio</h2>
        <div className="header-divider"></div>
        <p>A essência capturada em cada detalhe.</p>
      </div>

      <div className="photo-grid fading-in">
        {photos.map((photo, index) => (
          <div key={photo.id} className="photo-item" onClick={() => setSelectedIndex(index)}>
            <img src={photo.src} alt={photo.alt} loading="lazy" />
            <div className="overlay">
              <span className="category-tag">{photo.category}</span>
              <div className="icon-container">
                <FaPlus />
              </div>
              <span className="text">Ampliar</span>
            </div>
          </div>
        ))}
      </div>

      {/* LIGHTBOX PREMIUM */}
      {currentPhoto && (
        <div className="lightbox" onClick={closeLightbox}>
          
          <button className="nav-btn prev-btn" onClick={handlePrev}>
            <FaChevronLeft />
          </button>

          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img src={currentPhoto.src} alt={currentPhoto.alt} />
            <div className="lightbox-info">
              <h3>{currentPhoto.alt}</h3>
              <span>{currentPhoto.category}</span>
            </div>
          </div>

          <button className="nav-btn next-btn" onClick={handleNext}>
            <FaChevronRight />
          </button>

          <button className="close-btn" onClick={closeLightbox}>
            <FaTimes />
          </button>
        </div>
      )}
    </div>
  );
};

export default Portfolio;