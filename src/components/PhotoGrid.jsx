import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, A11y } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '../styles/photogrid.css';

const photos = [
  { id: 1, src: '/Inicio.jpg', alt: 'Fotografia de Início' },
  { id: 2, src: '/Estudio.jpg', alt: 'Fotografia em Estúdio' },
  { id: 3, src: '/Ambiente.jpg', alt: 'Fotografia de Ambiente' },
  { id: 4, src: '/Estudio_Deitada.png', alt: 'Fotografia de Ambiente' },

];

const PhotoGrid = () => {
  return (
    <section id="portfolio" className="carousel-section">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, A11y]}
        spaceBetween={0}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        loop={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        className="mySwiper"
      >
        {photos.map((photo) => (
          <SwiperSlide key={photo.id}>
            <div className="carousel-item">
              <img src={photo.src} alt={photo.alt} loading="lazy" />
              <div className="overlay">
                <span>Visualizar</span>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default PhotoGrid;