import React, { useState, useEffect, useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "./EventsSection.css";

const EventsSection = () => {
  const [eventos, setEventos] = useState([]);
  const sliderRef = useRef(null);

  useEffect(() => {
    fetch("http://localhost:5286/api/eventos")
      .then((res) => res.json())
      .then((data) => {
        setEventos(data);
      })
      .catch((err) => console.error("Error cargando eventos:", err));
  }, []);

  const slideLeft = () => {
    if (sliderRef.current) {
      const slider = sliderRef.current;
      const anchoTarjeta = slider.clientWidth / 4;
      if (slider.scrollLeft <= 10) {
        slider.scrollLeft = slider.scrollWidth;
      } else {
        slider.scrollLeft -= anchoTarjeta;
      }
    }
  };

  const slideRight = () => {
    if (sliderRef.current) {
      const slider = sliderRef.current;
      const anchoTarjeta = slider.clientWidth / 4;
      if (
        Math.ceil(slider.scrollLeft + slider.clientWidth) >=
        slider.scrollWidth - 10
      ) {
        slider.scrollLeft = 0;
      } else {
        slider.scrollLeft += anchoTarjeta;
      }
    }
  };

  return (
    <section className="events-section">
      <div className="events-vignette"></div>

      <div className="events-container">
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

        <div className="slider-wrapper">
          <div className="events-slider" ref={sliderRef}>
            {eventos.length === 0
              ? // LOADER: Tarjetas de evento vacías con spinner
                [1, 2, 3, 4].map((n) => (
                  <div key={n} className="event-card">
                    <div className="card-loader-container">
                      <div className="loader-spinner"></div>
                    </div>
                  </div>
                ))
              : eventos.map((evento, index) => (
                  <div
                    key={evento.id || index}
                    className="event-card"
                    style={{
                      backgroundImage: `url(${
                        evento.imagenUrl
                          ? `http://localhost:5286${evento.imagenUrl}`
                          : "/default-event.png"
                      })`,
                    }}
                  >
                    <div className="event-overlay">
                      <span className="event-date-badge">
                        {evento.fecha || evento.Fecha}
                      </span>
                      <h3 className="event-title">
                        {evento.titulo || evento.Titulo}
                      </h3>
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
