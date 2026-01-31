import React, { useState, useEffect } from "react";
import NewsBanner from "../components/NewsBanner"; 
import "./NoticiasPage.css"; 

const NoticiasPage = () => {
  const [todasLasNoticias, setTodasLasNoticias] = useState([]);
  const [cargando, setCargando] = useState(true);

  // En NoticiasPage.js -> useEffect

  useEffect(() => {
    fetch("http://localhost:5286/api/noticias")
      .then((res) => res.json())
      .then((data) => {
        console.log("Data cruda:", data); // Revisa esto en la consola (F12)

        // 1. VALIDACIÓN DE SEGURIDAD
        // Si data no es un array (es null, undefined o un objeto), detenemos para evitar el crash.
        if (!Array.isArray(data)) {
          console.error("La API no devolvió una lista válida:", data);
          setTodasLasNoticias([]); // Dejamos la lista vacía para que no truene
          setCargando(false);
          return;
        }

        // 2. ORDENAMIENTO SEGURO
        const ordenadas = [...data].sort((a, b) => {
          const fechaA = new Date(a.fechaPublicacion || a.FechaPublicacion);
          const fechaB = new Date(b.fechaPublicacion || b.FechaPublicacion);
          return fechaB - fechaA;
        });

        setTodasLasNoticias(ordenadas);
        setCargando(false);
      })
      .catch((err) => {
        console.error("Error fetching noticias:", err);
        setCargando(false);
      });
  }, []);

  return (
    <div className="noticias-page-wrapper">
      {/* 1. EL BANNER HERO */}
      <NewsBanner />

      {/* 2. EL CONTENIDO PRINCIPAL */}
      <div className="noticias-directory-container">
        <div className="directory-header">
          <h2>Archivo de Noticias</h2>
          <p>
            Explora todas las novedades y comunicados de CANACO Servytur León.
          </p>
        </div>

        {/* 3. EL GRID DE NOTICIAS */}
        {cargando ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Cargando noticias...</p>
          </div>
        ) : (
          <div className="directory-grid">
            {todasLasNoticias.map((item, index) => {
              // --- ZONA DE SEGURIDAD DE DATOS ---
              // Detectamos si viene en minúscula o mayúscula
              const tituloSafe = item.titulo || item.Titulo || "Sin Título";
              const resumenSafe =
                item.resumen || item.Resumen || "Sin descripción disponible.";
              const fechaSafe = item.fechaPublicacion || item.FechaPublicacion;
              const imgRaw = item.imagenUrl || item.ImagenUrl;

              // Procesar URL de imagen
              const imgSrc = imgRaw
                ? `http://localhost:5286${imgRaw.replace(/\\/g, "/")}`
                : "/default-new.png";

              return (
                <div
                  key={item.id || index}
                  className="glass-card directory-card"
                >
                  <div className="card-image-wrapper">
                    <img
                      src={imgSrc}
                      alt={tituloSafe}
                      onError={(e) => (e.target.src = "/default-new.png")} // Si falla, carga default
                    />
                  </div>

                  <div className="card-content">
                    <span className="news-date">
                      {fechaSafe
                        ? new Date(fechaSafe).toLocaleDateString("es-ES", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "Fecha no disponible"}
                    </span>

                    <h3>{tituloSafe}</h3>
                    <p>{resumenSafe}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!cargando && todasLasNoticias.length === 0 && (
          <div className="empty-state">
            <h3>No hay noticias publicadas aún.</h3>
          </div>
        )}
      </div>
    </div>
  );
};;

export default NoticiasPage;