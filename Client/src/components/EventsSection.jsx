import React, { useState, useEffect, useRef } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './EventsSection.css';

const EventsSection = () => {
  const [eventos, setEventos] = useState([]); 
  const sliderRef = useRef(null);

  useEffect(() => {
    fetch('http://localhost:5286/api/eventos')
      .then(res => res.json())
      .then(data => {
        console.log("Eventos cargados:", data);
        setEventos(data); 
      })
      .catch(err => console.error("Error cargando eventos:", err));
  }, []);

  // --- FUNCIÓN INTELIGENTE IZQUIERDA (CON LOOP) ---
  const slideLeft = () => {
    if (sliderRef.current) {
      const slider = sliderRef.current;
      // Calculamos cuánto mide UNA tarjeta basada en lo que se ve en pantalla
      const anchoTarjeta = slider.clientWidth / 4; 

      // Si estamos al principio (scroll casi 0), saltamos al FINAL
      if (slider.scrollLeft <= 10) {
        slider.scrollLeft = slider.scrollWidth; 
      } else {
        // Si no, retrocedemos una tarjeta exacta
        slider.scrollLeft -= anchoTarjeta; 
      }
    }
  };

  // --- FUNCIÓN INTELIGENTE DERECHA (CON LOOP) ---
  const slideRight = () => {
    if (sliderRef.current) {
      const slider = sliderRef.current;
      // Calculamos cuánto mide UNA tarjeta
      const anchoTarjeta = slider.clientWidth / 4;

      // Detectamos si llegamos al final (con un margen de error pequeño)
      // Si (lo que he scrolleado + lo que veo) es mayor o igual al total...
      if (Math.ceil(slider.scrollLeft + slider.clientWidth) >= slider.scrollWidth - 10) {
         // ...Saltamos al PRINCIPIO
         slider.scrollLeft = 0;
      } else {
         // Si no, avanzamos una tarjeta exacta
         slider.scrollLeft += anchoTarjeta;
      }
    }
  };

  return (
    <section className="events-section">
      <div className="events-vignette"></div>

      <div className="events-container">
        
        {/* HEADER CON TÍTULO Y BOTONES */}
        <div className="header-container">
             <h2 className="section-title">Próximos Eventos</h2>
             
             <div className="nav-buttons-group">
                 <button className="nav-btn-small" onClick={slideLeft}>
                     <FaChevronLeft />
                 </button>
                 <button className="nav-btn-small" onClick={slideRight}>
                     <FaChevronRight />
                 </button>
             </div>
        </div>

        {eventos.length === 0 && (
            <p style={{textAlign:'center', color:'#888'}}>Cargando eventos...</p>
        )}

        <div className="slider-wrapper">
            <div className="events-slider" ref={sliderRef}>
                {eventos.map((evento, index) => (
                    <div key={evento.id || index} className="event-card" style={{ 
                        backgroundImage: `url(${evento.imagenUrl || evento.ImagenUrl || '/default-event.png'})` 
                    }}>
                        <div className="event-overlay">
                            <span className="event-date-badge">{evento.fecha || evento.Fecha}</span>
                            <h3 className="event-title">{evento.titulo || evento.Titulo}</h3>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </section>
  );
};

export default EventsSection;