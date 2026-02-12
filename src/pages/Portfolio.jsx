import React, { useState, useEffect, useCallback } from 'react';
import { FaTimes, FaChevronLeft, FaChevronRight, FaPlus } from 'react-icons/fa';
import '../styles/photogrid.css';

// Componente para carregar imagem de forma suave (Resolve a sensação de peso)
const ProgressiveImage = ({ src, alt }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`image-wrapper ${isLoaded ? 'loaded' : 'loading'}`}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        className="grid-img"
      />
    </div>
  );
};

const Portfolio = () => {
  const [selectedIndex, setSelectedIndex] = useState(null);

  // Seus dados (Mantive todos)
  const photos = [
    { id: 1, src: '/Tiago/Foto_Ana.jpg', alt: 'Ensaio Corporativo', category: 'Corporativo' },
    { id: 3, src: '/Tiago/Foto_Euler.jpg', alt: 'Ensaio Corporativo', category: 'Estúdio' },
    { id: 4, src: '/portfolio/foto4.jpeg', alt: 'Ensaio Corporativo', category: 'Estúdio' },
    { id: 5, src: '/Tully/Portifolio3.jpg', alt: 'Ensaio Corporativo', category: 'Estúdio' },
    { id: 6, src: '/Tully/Portifolio4.jpg', alt: 'Ensaio Corporativo', category: 'Estúdio' },
    { id: 7, src: '/Tully/Portifolio5.jpg', alt: 'Ensaio Corporativo', category: 'Estúdio' },
    { id: 8, src: '/Tully/Portifolio1.jpg', alt: 'Ensaio Corporativo', category: 'Estúdio' },
    { id: 9, src: '/portfolio/foto9.jpeg', alt: 'Ensaio Corporativo', category: 'Estúdio' },
    { id: 10, src: '/Tiago/Foto__Maria.jpg', alt: 'Ensaio Corporativo', category: 'Estúdio' },
    { id: 11, src: '/portfolio/foto11.jpg', alt: 'Ensaio Corporativo', category: 'Estúdio' },
    { id: 12, src: '/portfolio/foto12.jpeg', alt: 'Ensaio Corporativo', category: 'Estúdio' },
    { id: 13, src: '/portfolio/foto13.jpeg', alt: 'Ensaio Corporativo', category: 'Estúdio' },
    { id: 14, src: '/Tiago/Foto_Marias.jpg', alt: 'Ensaio Corporativo', category: 'Estúdio' },
    { id: 15, src: '/portfolio/Felipe/Foto2.jpg', alt: 'Ensaio Corporativo', category: 'Estúdio' },
    { id: 16, src: '/portfolio/Felipe/Foto3.jpg', alt: 'Ensaio Corporativo', category: 'Estúdio' },
    { id: 17, src: '/portfolio/Felipe/Foto4.jpg', alt: 'Ensaio Corporativo', category: 'Estúdio' },
    { id: 18, src: '/portfolio/Felipe/Foto5.jpg', alt: 'Ensaio Corporativo', category: 'Estúdio' },
    { id: 19, src: '/portfolio/Felipe/Foto6.jpg', alt: 'Ensaio Corporativo', category: 'Estúdio' },
    { id: 20, src: '/portfolio/Felipe/Foto7.jpg', alt: 'Ensaio Corporativo', category: 'Estúdio' },
    { id: 21, src: '/portfolio/Felipe/Foto8.jpg', alt: 'Ensaio Corporativo', category: 'Estúdio' },
    { id: 22, src: '/portfolio/Felipe/Foto9.jpg', alt: 'Ensaio Corporativo', category: 'Estúdio' },
    { id: 23, src: '/portfolio/Felipe/Foto10.jpg', alt: 'Ensaio Corporativo', category: 'Estúdio' },
    { id: 24, src: '/portfolio/Felipe/Foto11.jpg', alt: 'Ensaio Corporativo', category: 'Estúdio' },
    { id: 25, src: '/portfolio/Felipe/Foto12.jpg', alt: 'Ensaio Corporativo', category: 'Estúdio' },
    { id: 26, src: '/portfolio/Felipe/Foto13.jpg', alt: 'Ensaio Corporativo', category: 'Estúdio' },
    { id: 27, src: '/portfolio/Felipe/Foto14.jpg', alt: 'Ensaio Corporativo', category: 'Estúdio' },
    { id: 28, src: '/portfolio/Felipe/Foto15.jpg', alt: 'Ensaio Corporativo', category: 'Estúdio' },
    { id: 29, src: '/portfolio/Felipe/Foto16.jpg', alt: 'Ensaio Corporativo', category: 'Estúdio' },
    { id: 30, src: '/portfolio/Felipe/Foto17.jpg', alt: 'Ensaio Corporativo', category: 'Estúdio' },
    { id: 31, src: '/portfolio/Felipe/Foto18.jpg', alt: 'Ensaio Corporativo', category: 'Estúdio' }
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Bloqueia scroll quando lightbox abre
  useEffect(() => {
    document.body.style.overflow = selectedIndex !== null ? 'hidden' : 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [selectedIndex]);

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

  // Atalhos de teclado
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
            
            {/* Componente Otimizado de Imagem */}
            <ProgressiveImage src={photo.src} alt={photo.alt} />

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