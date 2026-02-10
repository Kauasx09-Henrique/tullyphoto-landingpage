import React, { useState, useEffect, useCallback } from 'react';
import { FaTimes, FaChevronLeft, FaChevronRight, FaPlus } from 'react-icons/fa';
import '../styles/photogrid.css';
import { id } from 'date-fns/locale';

const Portfolio = () => {
  const [selectedIndex, setSelectedIndex] = useState(null);

  const photos = [
    { id: 1, src: '/Tiago/Foto_Ana.jpg', alt: 'Ensaio Corporativo', category: 'Corporativo' },
    /*{ id: 2, src: '/portfolio/DSC_8891.jpeg', alt: 'Evento Social', category: 'Social' },*/

    { id: 3, src: '/Tiago/Foto_Euler.jpg', alt: 'Ensaio Corporativo', category: 'Estúdio' },
    { id: 4, src: '/portfolio/foto4.jpeg', alt: 'Ensaio Corporativo', category: 'Estúdio' },
    { id: 5, src: '/Tully/Portifolio3.jpg', alt: 'Ensaio Corporativo', category: 'Estúdio' },
    { id: 6, src: '/Tully/Portifolio4.jpg', alt: 'Ensaio Corporativo', category: 'Estúdio' },
    { id: 7, src: '/Tully/Portifolio5.jpg', alt: 'Ensaio Corporativo', category: 'Estúdio' },
    { id: 8, src: '/Tully/Portifolio1.jpg', alt: 'Ensaio Corporativo', category: 'Estúdio' },
    {
      id: 9, src: '/portfolio/foto9.jpeg', alt: 'Ensaio Corporativo', category: 'Estúdio'
    },
    {
      id: 10, src: '/Tiago/Foto__Maria.jpg',
      alt: 'Ensaio Corporativo',
      category: 'Estúdio'
    },
    {
      id: 11, src: '/portfolio/foto11.jpg',
      alt: 'Ensaio Corporativo',
      category: 'Estúdio'
    },

    {
      id: 12, src: '/portfolio/foto12.jpeg',
      alt: 'Ensaio Corporativo',
      category: 'Estúdio'
    },
    {
      id: 13, src: '/portfolio/foto13.jpeg',
      alt: 'Ensaio Corporativo',
      category: 'Estúdio'
    },
    {
      id: 14, src: '/Tiago/Foto_Marias.jpg',
      alt: 'Ensaio Corporativo',
      category: 'Estúdio'
    }

  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (selectedIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
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
            <div className="image-wrapper">
              <img src={photo.src} alt={photo.alt} loading="lazy" />
            </div>
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