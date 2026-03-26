import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import '../styles/carrosel.css';

const photos = [
  {
    id: 1,
    src: '/home/Foto_Inicio.webp',
    title: 'Espaço Criativo',
    subtitle: 'Ambientes inspiradores para suas fotos'
  },
  {
    id: 2,
    src: '/home/Mesa.webp',
    title: 'Estúdio Profissional',
    subtitle: 'Alugue o estúdio'
  },
  {
    id: 3,
    src: '/home/cadeira.webp',
    title: 'Conforto & Design',
    subtitle: 'Conheça nosso espaço',
  },
];

const PhotoGrid = () => {
  return (
    <section className="carousel-section">
      <Swiper
        modules={[Navigation, Pagination, A11y]}
        speed={600}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        loop={true}
        className="hero-swiper"
      >
        {photos.map((photo, index) => (
          <SwiperSlide key={photo.id}>
            <div className="carousel-item">
              <div className="image-wrapper">
                <img
                  src={photo.src}
                  alt={photo.title}
                  loading={index === 0 ? "eager" : "lazy"} // 🔥 CORREÇÃO
                />
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