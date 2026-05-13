import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./NewsSection.css";
import { API_URL, FILES_BASE } from "../lib/api";
import { useScrollReveal } from "../hooks/useScrollReveal";

const NewsSection = () => {
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sectionRef, isVisible] = useScrollReveal(0.1);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/noticias`)
      .then((res) => res.json())
      .then((data) => {
        const ordenadas = data.sort(
          (a, b) => new Date(b.fechaPublicacion) - new Date(a.fechaPublicacion)
        );
        setNoticias(ordenadas.slice(0, 3));
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <section ref={sectionRef} className={`news-section scroll-reveal ${isVisible ? 'revealed' : ''}`}>
      <div className="background-blobs-css">
        <div className="blob blob-blue-left"></div>
        <div className="blob blob-blue-right"></div>
      </div>

      <div className="news-container">
        <div className="header-container">
          <h2 className="section-title">Últimas Noticias</h2>
        </div>

        <div className="news-grid">
          {loading ? (
            // LOADER: Skeleton Shimmer en lugar de spinner
            [1, 2, 3].map((n) => (
              <div key={n} className="glass-card skeleton-card">
                <div className="skeleton-shimmer"></div>
              </div>
            ))
          ) : noticias.length > 0 ? (
            noticias.map((item, index) => (
              <div key={item.id || index} className="glass-card">
                <div className="card-image-wrapper">
                  <img
                    src={
                      item.imagenUrl
                        ? `${FILES_BASE}${item.imagenUrl}`
                        : "/default-new.png"
                    }
                    alt={item.titulo}
                  />
                </div>
                <div className="card-content">
                  <span className="news-date">
                    {new Date(item.fechaPublicacion).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                  <h3>{item.titulo}</h3>
                  <p>{item.resumen}</p>
                </div>
              </div>
            ))
          ) : (
            <p style={{ gridColumn: "1/-1", textAlign: "center", color: "#888" }}>
              No hay noticias disponibles.
            </p>
          )}
        </div>

        <div className="news-footer">
          <Link to="/noticias" className="see-all-link">
            TODAS LAS NOTICIAS &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;