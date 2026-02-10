import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
// Adicionei EffectFade para transição suave
import { Navigation, Pagination, Autoplay, A11y, EffectFade } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade'; // Importante importar o CSS do efeito

// Importe seu CSS personalizado
import '../styles/carrosel.css';

const photos = [
  {
    id: 1,
    src: '/Foto_Inicio.jpg',
    title: 'Espaço Criativo',
    subtitle: 'Ambientes inspiradores para suas fotos'
  },
  {
    id: 2,
    src: '/Mesa.jpg',
    title: 'Estúdio Profissional',
    subtitle: 'Alugue o estúdio'
  },
  {
    id: 3,
    src: '/Sofa.jpg',
    title: 'Conforto & Design',
    subtitle: 'conheça nosso espaço'
  },
  {
    id: 4,
    src: '/Cadeiras.jpg',
    title: 'Mobiliário de design para seus cenários',
    subtitle: 'Alugue o estúdio'
  },
];

const PhotoGrid = () => {
  return (
    <section id="portfolio" className="carousel-section">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, A11y, EffectFade]}
        effect={'fade'} 
        speed={1000} 
        spaceBetween={0}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        loop={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        className="hero-swiper"
      >
        {photos.map((photo) => (
          <SwiperSlide key={photo.id}>
            <div className="carousel-item">
              {/* Imagem de Fundo */}
              <div className="image-wrapper">
                <img src={photo.src} alt={photo.title} loading="lazy" />
              </div>

              {/* Overlay Escuro para o texto ler bem */}
              <div className="overlay-gradient"></div>

              {/* Texto sobre a imagem */}
              <div className="slide-content">
                <h3>{photo.subtitle}</h3>
                <h2>{photo.title}</h2>
                <div className="divider-small"></div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default PhotoGrid;