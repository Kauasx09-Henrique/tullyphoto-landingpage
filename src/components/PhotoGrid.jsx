import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, A11y, EffectFade } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

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
    src: '/home/cadeira.jpeg',
    title: 'Conforto & Design',
    subtitle: 'conheça nosso espaço',
    isPortrait: true
  },
  {
    id: 4,
    src: '/home/cadeiraM.jpeg',
    title: 'Mobiliário diversos para seus cenários',
    subtitle: 'Alugue o estúdio',
    isPortrait: true
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
            <div className={`carousel-item ${photo.isPortrait ? 'vertical' : ''}`}>
              <div className="image-wrapper">
                <img src={photo.src} alt={photo.title} loading="lazy" />
              </div>

              <div className="overlay-gradient"></div>

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