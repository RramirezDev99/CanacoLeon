// src/components/HeroCarousel.jsx
import { Swiper, SwiperSlide } from 'swiper/react';

// Importamos los estilos necesarios de Swiper
import 'swiper/css';
import 'swiper/css/effect-fade'; // Para que se desvanezca suave
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Módulos que vamos a usar
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';

import './HeroCarousel.css';

// Tus imágenes
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
        effect="fade" // Efecto de desvanecimiento elegante
        spaceBetween={0}
        slidesPerView={1}
        loop={true} // Infinito
        speed={1000} // Duración de la transición (1 seg)
        autoplay={{
          delay: 5000, // Cambio cada 5 seg
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        navigation={true} // Flechas
        className="mySwiper"
      >
        {images.map((img, index) => (
          <SwiperSlide key={index}>
            <div 
              className="slide-image" 
              style={{ backgroundImage: `url(${img})` }}
            >
              {/* Overlay oscuro integrado en cada slide */}
              <div className="overlay"></div>
            </div>
          </SwiperSlide>
        ))}

        {/* CONTENIDO FIJO (Encima del slider) */}
        {/* Lo sacamos del map para que el texto NO parpadee al cambiar foto, 
            o lo metemos dentro si quieres que el texto cambie con la foto.
            En tu Figma parece ser un texto fijo sobre las fotos. */}
        <div className="hero-content">
            <h1>ES UN ORGULLO SER<br/>CANACO SERVytUR LEÓN</h1>
        </div>

      </Swiper>
    </section>
  );
};

export default HeroCarousel;