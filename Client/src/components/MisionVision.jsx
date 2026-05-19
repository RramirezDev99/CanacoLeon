import React, { useState, useEffect } from "react";
import { FaBullseye, FaEye, FaHandshake } from "react-icons/fa";
import { API_URL } from "../lib/api";
import "./MisionVision.css";

const MisionVision = () => {
  const [contenido, setContenido] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/ContenidoSitio`)
      .then((res) => res.json())
      .then((data) => {
        const map = {};
        (data || []).forEach((item) => {
          map[item.clave] = item.valor;
        });
        setContenido(map);
      })
      .catch(() => setContenido({}));
  }, []);

  // Mientras carga, no mostrar nada
  if (contenido === null) return null;

  const mision = contenido.mision;
  const vision = contenido.vision;
  const valores = contenido.valores;

  // Si no hay ningún contenido definido, no renderizar la sección
  if (!mision && !vision && !valores) return null;

  return (
    <section className="mision-vision-section">
      <div className="mv-container">

        {/* Misión */}
        {mision && (
          <div className="mv-card">
            <div className="mv-icon-wrapper mision-icon">
              <FaBullseye />
            </div>
            <h3>Nuestra Misión</h3>
            <p>{mision}</p>
          </div>
        )}

        {/* Visión */}
        {vision && (
          <div className="mv-card">
            <div className="mv-icon-wrapper vision-icon">
              <FaEye />
            </div>
            <h3>Nuestra Visión</h3>
            <p>{vision}</p>
          </div>
        )}

        {/* Valores */}
        {valores && (
          <div className="mv-card">
            <div className="mv-icon-wrapper valores-icon">
              <FaHandshake />
            </div>
            <h3>Nuestros Valores</h3>
            <p>{valores}</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default MisionVision;
