import React, { useState, useEffect, useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "./EventsSection.css";

const EventsSection = () => {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true); // <--- AGREGADO: Estado de carga
  const sliderRef = useRef(null);

  useEffect(() => {
    setLoading(true); // Iniciamos carga
    fetch("http://localhost:5286/api/eventos")
      .then((res) => res.json())
      .then((data) => {
        console.log("Eventos cargados:", data);
        setEventos(data);
        setLoading(false); // Finalizamos carga
      })
      .catch((err) => {
        console.error("Error cargando eventos:", err);
        setLoading(false); // Finalizamos carga aunque falle
      });
  }, []);

  // --- TUS FUNCIONES DE SCROLL (SIN TOCAR) ---
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

        <div className="slider-wrapper">
          <div className="events-slider" ref={sliderRef}>
            
            {/* --- LÓGICA DE CARGA / SKELETONS --- */}
            {loading ? (
              // Mostramos 4 tarjetas grises mientras carga
              [1, 2, 3, 4].map((n) => (
                <div key={n} className="event-card skeleton-card">
                  <div className="skeleton-shimmer"></div>
                </div>
              ))
            ) : eventos.length > 0 ? (
              eventos.map((evento, index) => {
                const rawImg = evento.imagenUrl || evento.ImagenUrl;
                const bgImage = rawImg
                  ? `http://localhost:5286${rawImg.replace(/\\/g, "/")}`
                  : "/default-event.png";

                return (
                  <div
                    key={evento.id || index}
                    className="event-card"
                    style={{ backgroundImage: `url('${bgImage}')` }}
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
              })
            ) : (
              // Si la API no tiene nada
              <p style={{ color: "#888", width: "100%", textAlign: "center" }}>
                No hay eventos disponibles.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventsSection;