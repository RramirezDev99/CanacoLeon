import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./NewsSection.css";

const NewsSection = () => {
  const [noticias, setNoticias] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5286/api/noticias")
      .then((res) => res.json())
      .then((data) => {
        const ordenadas = data.sort(
          (a, b) => new Date(b.fechaPublicacion) - new Date(a.fechaPublicacion)
        );
        setNoticias(ordenadas.slice(0, 3));
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <section className="news-section">
      <div className="background-blobs-css">
        <div className="blob blob-blue-left"></div>
        <div className="blob blob-blue-right"></div>
      </div>

      <div className="news-container">
        <div className="header-container">
          <h2 className="section-title">Últimas Noticias</h2>
        </div>

        <div className="news-grid">
          {noticias.length === 0
            ? // LOADER: Tarjetas vacías con spinner mientras carga
              [1, 2, 3].map((n) => (
                <div key={n} className="glass-card">
                  <div className="card-loader-container">
                    <div className="loader-spinner"></div>
                  </div>
                </div>
              ))
            : noticias.map((item, index) => (
                <div key={item.id || index} className="glass-card">
                  <div className="card-image-wrapper">
                    <img
                      src={
                        item.imagenUrl
                          ? `http://localhost:5286${item.imagenUrl}`
                          : "/default-new.png"
                      }
                      alt={item.titulo}
                    />
                  </div>
                  <div className="card-content">
                    <span className="news-date">
                      {new Date(item.fechaPublicacion).toLocaleDateString(
                        "es-ES",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </span>
                    <h3>{item.titulo}</h3>
                    <p>{item.resumen}</p>
                  </div>
                </div>
              ))}
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
