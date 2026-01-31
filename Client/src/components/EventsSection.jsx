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
        console.log("Eventos cargados:", data);
        setEventos(data);
      })
      .catch((err) => console.error("Error cargando eventos:", err));
  }, []);

  // --- FUNCIÓN IZQUIERDA ---
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

  // --- FUNCIÓN DERECHA ---
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
        {/* HEADER */}
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
          <p style={{ textAlign: "center", color: "#888" }}>
            Cargando eventos...
          </p>
        )}

        <div className="slider-wrapper">
          <div className="events-slider" ref={sliderRef}>
            {eventos.map((evento, index) => {
              // 1. OBTENER LA RUTA SEGURA (Minúscula o Mayúscula)
              const rawImg = evento.imagenUrl || evento.ImagenUrl;

              // 2. CONSTRUIR URL COMPLETA
              // Si hay imagen, limpiamos las barras invertidas '\' por '/' y agregamos el host
              const bgImage = rawImg
                ? `http://localhost:5286${rawImg.replace(/\\/g, "/")}`
                : "/default-event.png"; // Asegúrate de tener esta imagen en /public

              return (
                <div
                  key={evento.id || index}
                  className="event-card"
                  style={{
                    // 3. USAR LA URL PROCESADA
                    backgroundImage: `url('${bgImage}')`,
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
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
