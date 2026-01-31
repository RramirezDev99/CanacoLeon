import React, { useState, useEffect } from "react";
import NewsBanner from "../../components/NewsBanner";
import "./NoticiasPage.css";

const NoticiasPage = () => {
  const [noticias, setNoticias] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5286/api/noticias")
      .then((res) => res.json())
      .then((data) => {
        // Ordenar por fecha (más nuevas primero)
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

  // --- HELPERS ---

  // 1. Obtener URL de imagen
  const getImg = (item) => {
    if (!item) return "/default-new.png";
    const raw = item.imagenUrl || item.ImagenUrl;
    return raw
      ? `http://localhost:5286${raw.replace(/\\/g, "/")}`
      : "/default-new.png";
  };

  // 2. Formatear Fecha (Para que salga en el Tag)
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    // Formato: "12 de octubre de 2025" o "12/10/2023" según prefieras.
    // Aquí uso formato largo en español:
    return date
      .toLocaleDateString("es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
      .toUpperCase(); // Mayúsculas para que se vea estilo etiqueta
  };

  // --- SUB-COMPONENTE: TARJETAS GRID (Overlay) ---
  const OverlayCard = ({ item, sizeClass }) => {
    if (!item) return null;
    return (
      <div className={`overlay-card ${sizeClass}`}>
        <img src={getImg(item)} alt={item.titulo} className="bg-image" />
        <div className="card-gradient">
          {/* AQUÍ ESTÁ EL CAMBIO: LA FECHA EN EL TAG */}
          <span className="badge-category">
            {formatDate(item.fechaPublicacion || item.FechaPublicacion)}
          </span>

          <h3>{item.titulo}</h3>
          {sizeClass !== "card-small" && <p>{item.resumen}</p>}
        </div>
      </div>
    );
  };

  // --- REBANANDO EL ARRAY ---
  const noticiaHero = noticias[0];
  const noticiasGrid = noticias.slice(1, 5);
  const noticiasFila = noticias.slice(5, 8);
  const noticiasViejas = noticias.slice(8);

  return (
    <div className="noticias-page-wrapper">
      <NewsBanner />

      <div className="noticias-layout-container">
        {cargando && (
          <div style={{ textAlign: "center", padding: "50px" }}>
            Cargando noticias...
          </div>
        )}

        {!cargando && noticias.length > 0 && (
          <>
            {/* 1. SECCIÓN SUPERIOR: HERO + GRID */}
            <div className="hero-grid-section">
              <div className="hero-col-left">
                {noticiaHero && (
                  <OverlayCard item={noticiaHero} sizeClass="card-large" />
                )}
              </div>

              <div className="hero-col-right">
                {noticiasGrid.map((item, i) => (
                  <OverlayCard
                    key={item.id || i}
                    item={item}
                    sizeClass="card-small"
                  />
                ))}
              </div>
            </div>

            {/* 2. FILA DE 3 */}
            {noticiasFila.length > 0 && (
              <div className="three-row-section">
                {noticiasFila.map((item, i) => (
                  <OverlayCard
                    key={item.id || i}
                    item={item}
                    sizeClass="card-medium"
                  />
                ))}
              </div>
            )}

            {/* Divisor */}
            {noticiasViejas.length > 0 && (
              <div className="section-divider"></div>
            )}

            {/* 3. LISTA FINAL */}
            <div className="old-news-list">
              {noticiasViejas.map((item, i) => (
                <div key={item.id || i} className="old-news-item">
                  <div className="old-news-text">
                    {/* AQUÍ TAMBIÉN CAMBIAMOS EL TAG POR LA FECHA */}
                    <span className="badge-category-dark">
                      {formatDate(
                        item.fechaPublicacion || item.FechaPublicacion,
                      )}
                    </span>

                    <h3>{item.titulo}</h3>
                    <p>{item.resumen}</p>
                  </div>
                  <div className="old-news-img-wrapper">
                    <img src={getImg(item)} alt={item.titulo} />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default NoticiasPage;
