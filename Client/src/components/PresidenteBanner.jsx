import React, { useState, useEffect } from "react";
import "./PresidenteBanner.css";
import { API_URL, FILES_BASE } from "../lib/api";

const PresidenteBanner = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/presidente`)
      .then((res) => res.json())
      .then((result) => {
        setData(result);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error cargando presidente:", err);
        setLoading(false);
      });
  }, []);

  // Combinamos los datos: Preferencia a la API, fallback a estático
  const info = data || {
    nombre: "RUBÉN RAMÍREZ",
    cargo: "Presidente de CANACO",
    mensaje: "En la CANACO trabajamos todos los días para fortalecer al sector comercio, servicios y turismo...",
    imagenUrl: null,
  };

  const getImg = (url) => {
    if (!url) return "https://via.placeholder.com/600x600?text=Foto+Presidente";
    return `${FILES_BASE}${url}`;
  };

  return (
    <section className="president-section">
      <div className={`president-container ${loading ? "is-loading" : ""}`}>
        {/* COLUMNA IZQUIERDA: FOTO */}
        <div className="president-photo-col">
          <div className="photo-frame">
            {loading ? (
              <div className="skeleton-shimmer full-height"></div>
            ) : (
              <img src={getImg(info.imagenUrl)} alt={info.nombre} className="fadeIn" />
            )}
          </div>
        </div>

        {/* COLUMNA DERECHA: TEXTO */}
        <div className="president-text-col">
          {loading ? (
            <div className="skeleton-content">
              <div className="skeleton-line name"></div>
              <div className="skeleton-line role"></div>
              <div className="skeleton-line message"></div>
              <div className="skeleton-line message"></div>
              <div className="skeleton-line message short"></div>
              <div className="skeleton-shimmer"></div>
            </div>
          ) : (
            <>
              <h2 className="president-name fadeIn">{info.nombre}</h2>
              <h4 className="president-role fadeIn">{info.cargo}</h4>
              <div className="blue-zigzag fadeIn"></div>
              <div className="president-message fadeIn">
                {info.mensaje?.split("\n").map((parrafo, i) => (
                  <p key={i}>{parrafo}</p>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default PresidenteBanner;