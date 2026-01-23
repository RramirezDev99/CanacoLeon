import React, { useState, useEffect, useRef } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './EventsSection.css'; // Aquí importamos el CSS correctamente

const EventsSection = () => {
  const [eventos, setEventos] = useState([]);
  const sliderRef = useRef(null);

  useEffect(() => {
    // Asegúrate que este puerto (7234) sea el correcto de tu backend
    fetch('https://localhost:7234/api/eventos')
      .then(res => res.json())
      .then(data => setEventos(data))
      .catch(err => console.error(err));
  }, []);

  const slideLeft = () => {
    sliderRef.current.scrollLeft -= 400;
  };

  const slideRight = () => {
    sliderRef.current.scrollLeft += 400;
  };

  return (
    <section className="events-section">
      <div className="events-vignette"></div>

      <div className="events-container">
        <div className="header-container">
             <h2 className="section-title">Próximos Eventos</h2>
        </div>

        <div className="slider-wrapper">
            <button className="nav-btn left-btn" onClick={slideLeft}>
                <FaChevronLeft />
            </button>

            <div className="events-slider" ref={sliderRef}>
                {eventos.map((evento) => (
                    <div key={evento.id} className="event-card" style={{ backgroundImage: `url(${evento.imagen})` }}>
                        <div className="event-overlay">
                            <span className="event-date-badge">{evento.fecha}</span>
                            <h3 className="event-title">{evento.titulo}</h3>
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