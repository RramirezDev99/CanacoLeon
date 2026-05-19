import React, { useState, useEffect } from "react";
import { FaUserTie } from "react-icons/fa";
import "./PresidenteBanner.css";
import { API_URL, FILES_BASE } from "../lib/api";
import EmptyState from "./EmptyState";

const PresidenteBanner = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/presidente`)
      .then(async (res) => {
        // Si el backend regresa 204 No Content (sin presidente),
        // res.json() truena. Tratamos ese caso explícitamente para evitar
        // el "parpadeo" donde la sección se muestra y luego desaparece.
        if (res.status === 204 || !res.ok) return null;
        try { return await res.json(); } catch { return null; }
      })
      .then((result) => {
        // Verificamos que tenga algo real (no objeto vacío ni null)
        const tieneContenido = result && (result.nombre || result.cargo || result.mensaje);
        setData(tieneContenido ? result : null);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error cargando presidente:", err);
        setLoading(false);
      });
  }, []);

  const info = data;

  // Cuando no hay presidente configurado mostramos un estado vacío
  // limpio en lugar de un placeholder roto o de hacer disappear la sección
  // (el "actúa extraño" que se veía antes).
  if (!loading && !info) {
    return (
      <section className="president-section">
        <div className="president-container president-empty-wrapper">
          <EmptyState
            icon={<FaUserTie />}
            title="Mensaje del Presidente Próximamente"
            message="Una vez que el panel de administración configure al Presidente, su mensaje aparecerá aquí."
          />
        </div>
      </section>
    );
  }

  const getImg = (url) => {
    if (!url) return null;
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
            ) : getImg(info.imagenUrl) ? (
              <img src={getImg(info.imagenUrl)} alt={info.nombre} className="fadeIn" />
            ) : (
              <div className="photo-placeholder fadeIn">
                <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" width="120" height="120">
                  <circle cx="60" cy="45" r="22" fill="rgba(0,74,173,0.15)"/>
                  <ellipse cx="60" cy="100" rx="35" ry="22" fill="rgba(0,74,173,0.1)"/>
                </svg>
              </div>
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