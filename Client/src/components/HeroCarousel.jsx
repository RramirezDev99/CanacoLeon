// src/components/HeroCarousel.jsx
import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Link } from 'react-router-dom';

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
import { API_URL } from '../lib/api';

import './HeroCarousel.css';

const defaultImages = [
  "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1600&auto=format&fit=crop"
];

const HeroCarousel = () => {
  const [contenido, setContenido] = useState({});

  useEffect(() => {
    fetch(`${API_URL}/ContenidoSitio`)
      .then((res) => res.json())
      .then((data) => {
        const map = {};
        (data || []).forEach((item) => {
          map[item.clave] = item.valor;
        });
        setContenido(map);
      })
      .catch(() => {});
  }, []);

  // Valores del API o fallback por defecto
  const titulo = contenido.hero_titulo || "CANACO SERVyTUR\nLEÓN";
  const subtitulo = contenido.hero_subtitulo || "Cámara Nacional de Comercio, Servicios y Turismo";
  const descripcion = contenido.hero_descripcion || "Impulsando el desarrollo empresarial de León, Guanajuato";

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
        {defaultImages.map((img, index) => (
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
            <p className="hero-subtitle">{subtitulo}</p>
            <h1>{titulo.split('\n').map((line, i) => (
              <React.Fragment key={i}>{line}{i < titulo.split('\n').length - 1 && <br/>}</React.Fragment>
            ))}</h1>
            <p className="hero-description">{descripcion}</p>
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
