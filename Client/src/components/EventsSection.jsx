import React, { useState, useEffect, useRef } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './EventsSection.css';

const EventsSection = () => {
  // Aquí declaramos 'eventos' y 'setEventos'
  const [eventos, setEventos] = useState([]); 
  const sliderRef = useRef(null);

  useEffect(() => {
    // Usamos el puerto 5286 (que confirmamos que funciona)
    fetch('http://localhost:5286/api/eventos')
      .then(res => res.json())
      .then(data => {
        console.log("Eventos cargados:", data);
        // CORRECCIÓN: Usamos setEventos, NO setNoticias
        setEventos(data); 
      })
      .catch(err => console.error("Error cargando eventos:", err));
  }, []);

  const slideLeft = () => {
    if(sliderRef.current) sliderRef.current.scrollLeft -= 400;
  };

  const slideRight = () => {
    if(sliderRef.current) sliderRef.current.scrollLeft += 400;
  };

  return (
    <section className="events-section">
      <div className="events-vignette"></div>

      <div className="events-container">
        <div className="header-container">
             <h2 className="section-title">Próximos Eventos</h2>
        </div>

        {/* Mensaje de seguridad por si la lista está vacía */}
        {eventos.length === 0 && (
            <p style={{textAlign:'center', color:'#888'}}>Cargando eventos...</p>
        )}

        <div className="slider-wrapper">
            <button className="nav-btn left-btn" onClick={slideLeft}>
                <FaChevronLeft />
            </button>

            <div className="events-slider" ref={sliderRef}>
                {eventos.map((evento, index) => (
                    <div key={evento.id || index} className="event-card" style={{ 
                        // Aseguramos que lea la imagen venga como venga (mayúscula/minúscula)
                        backgroundImage: `url(${evento.imagen || evento.Imagen})` 
                    }}>
                        <div className="event-overlay">
                            <span className="event-date-badge">{evento.fecha || evento.Fecha}</span>
                            <h3 className="event-title">{evento.titulo || evento.Titulo}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <button className="nav-btn right-btn" onClick={slideRight}>
                <FaChevronRight />
            </button>
        </div>
      </div>
    </section>
  );
};

export default EventsSection;