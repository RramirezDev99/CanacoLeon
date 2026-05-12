import React, { useState, useEffect } from "react";
import "./NoticiasList.css";
import { API_URL, FILES_BASE } from "../lib/api";

const NoticiasList = () => {
  const [noticias, setNoticias] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    setCargando(true);
    fetch(`${API_URL}/noticias`)
      .then((res) => res.json())
      .then((data) => {
        const ordenadas = data.sort((a, b) => {
          const fechaA = new Date(a.fechaPublicacion || a.FechaPublicacion);
          const fechaB = new Date(b.fechaPublicacion || b.FechaPublicacion);
          return fechaB - fechaA;
        });
        setNoticias(ordenadas);
        setCargando(false);
      })
      .catch((err) => {
        console.error(err);
        setCargando(false);
      });
  }, []);

  const getImgUrl = (item) => {
    const raw = item.imagenUrl || item.ImagenUrl;
    return raw ? `${FILES_BASE}${raw.replace(/\\/g, "/")}` : "/default-new.png";
  };

  const noticiasPrincipales = noticias.slice(0, 6);
  const noticiasAnteriores = noticias.slice(6);

  return (
    <div className="noticias-list-container">
      {/* --- GRID SUPERIOR --- */}
      <div className="news-top-grid">
        {cargando ? (
          // SKELETONS PARA EL GRID
          [1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="news-card-featured skeleton-card">
              <div className="skeleton-shimmer"></div>
            </div>
          ))
        ) : (
          noticiasPrincipales.map((item, index) => (
            <div key={item.id || index} className="news-card-featured">
              <span className="category-badge">NOTICIAS</span>
              <img src={getImgUrl(item)} alt={item.titulo} className="featured-img" />
              <div className="featured-overlay">
                <h3>{item.titulo}</h3>
                <p>{item.resumen}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {(noticiasAnteriores.length > 0 || cargando) && <div className="news-divider-line"></div>}

      {/* --- LISTA INFERIOR --- */}
      <div className="news-bottom-list">
        {cargando ? (
          // SKELETONS PARA LA LISTA (Mantiene la forma de tus noticias viejas)
          [1, 2, 3].map((n) => (
            <div key={n} className="news-row-card skeleton-row">
              <div className="row-content">
                <div className="skeleton-line title"></div>
                <div className="skeleton-line date"></div>
                <div className="skeleton-line body"></div>
              </div>
              <div className="row-image skeleton-img"></div>
              <div className="skeleton-shimmer"></div>
            </div>
          ))
        ) : (
          noticiasAnteriores.map((item, index) => (
            <div key={item.id || index} className="news-row-card">
              <div className="row-content">
                <span className="category-badge-dark">NOTICIAS</span>
                <h3>{item.titulo}</h3>
                <p>{item.resumen}</p>
              </div>
              <div className="row-image">
                <img src={getImgUrl(item)} alt={item.titulo} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NoticiasList;