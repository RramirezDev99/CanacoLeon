// src/components/HeroCarousel.jsx
import { Swiper, SwiperSlide } from 'swiper/react';
import { Link } from 'react-router-dom';

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';

import './HeroCarousel.css';

const images = [
  "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1600&auto=format&fit=crop"
];

const HeroCarousel = () => {
  return (
    <section className="hero-slider-container">
      <Swiper
        modules={[Autoplay, EffectFade, Navigation, Pagination]}
        effect="fade"
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        speed={1000}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        navigation={true}
        className="mySwiper"
      >
        {images.map((img, index) => (
          <SwiperSlide key={index}>
            <div
              className="slide-image"
              style={{ backgroundImage: `url(${img})` }}
            >
              <div className="overlay"></div>
            </div>
          </SwiperSlide>
        ))}

        <div className="hero-content">
            <p className="hero-subtitle">Cámara Nacional de Comercio, Servicios y Turismo</p>
            <h1>CANACO SERVyTUR<br/>LEÓN</h1>
            <p className="hero-description">Impulsando el desarrollo empresarial de León, Guanajuato</p>
            <div className="hero-buttons">
              <Link to="/afiliarme" className="hero-btn hero-btn-primary">Afíliate Ahora</Link>
              <Link to="/servicios" className="hero-btn hero-btn-secondary">Conoce Nuestros Servicios</Link>
            </div>
        </div>

      </Swiper>
    </section>
  );
};

export default HeroCarousel;