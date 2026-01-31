import React, { useState, useEffect } from "react";
import "./NoticiasList.css";

const NoticiasList = () => {
  const [noticias, setNoticias] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5286/api/noticias")
      .then((res) => res.json())
      .then((data) => {
        // 1. Ordenar por fecha (más nuevas primero)
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

  if (cargando) {
    return <div className="loading-msg">Cargando noticias...</div>;
  }

  // DIVIDIMOS LAS NOTICIAS
  // Las primeras 6 van arriba (Grid tipo Pinterest/Masonry)
  const noticiasPrincipales = noticias.slice(0, 6);
  // El resto van abajo (Lista horizontal)
  const noticiasAnteriores = noticias.slice(6);

  // Helper para imágenes
  const getImgUrl = (item) => {
    const raw = item.imagenUrl || item.ImagenUrl;
    return raw
      ? `http://localhost:5286${raw.replace(/\\/g, "/")}`
      : "/default-new.png";
  };

  return (
    <div className="noticias-list-container">
      {/* --- SECCIÓN SUPERIOR: GRID DESTACADO --- */}
      <div className="news-top-grid">
        {noticiasPrincipales.map((item, index) => (
          <div key={item.id || index} className="news-card-featured">
            {/* Etiqueta flotante (puedes hacerla dinámica si tu API tiene categoría) */}
            <span className="category-badge">NOTICIAS</span>

            <img
              src={getImgUrl(item)}
              alt={item.titulo}
              className="featured-img"
            />

            <div className="featured-overlay">
              <h3>{item.titulo}</h3>
              <p>{item.resumen}</p>
            </div>
          </div>
        ))}
      </div>

      {/* --- LÍNEA DIVISORIA --- */}
      {noticiasAnteriores.length > 0 && (
        <div className="news-divider-line"></div>
      )}

      {/* --- SECCIÓN INFERIOR: LISTA HORIZONTAL (VIEJAS) --- */}
      <div className="news-bottom-list">
        {noticiasAnteriores.map((item, index) => (
          <div key={item.id || index} className="news-row-card">
            <div className="row-content">
              <span className="category-badge-dark">NOTICIAS</span>
              <h3>{item.titulo}</h3>
              <span className="row-date">
                {new Date(item.fechaPublicacion).toLocaleDateString("es-ES", {
                  dateStyle: "long",
                })}
              </span>
              <p>{item.resumen}</p>
              <button className="read-more-btn">Leer más &rarr;</button>
            </div>
            <div className="row-image">
              <img src={getImgUrl(item)} alt={item.titulo} />
            </div>
          </div>
        ))}
      </div>

      {noticias.length === 0 && !cargando && (
        <p className="no-news-msg">No hay noticias disponibles.</p>
      )}
    </div>
  );
};

export default NoticiasList;
