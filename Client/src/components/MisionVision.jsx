import React, { useState, useEffect } from "react";
import { FaBullseye, FaEye, FaHandshake } from "react-icons/fa";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { API_URL } from "../lib/api";
import "./MisionVision.css";

const MisionVision = () => {
  const [ref1, vis1] = useScrollReveal(0.1);
  const [ref2, vis2] = useScrollReveal(0.1);
  const [ref3, vis3] = useScrollReveal(0.1);

  const [contenido, setContenido] = useState({});

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
      .catch(() => {});
  }, []);

  const mision = contenido.mision;
  const vision = contenido.vision;
  const valores = contenido.valores;

  // Si no hay ningún contenido definido, no renderizar la sección
  if (!mision && !vision && !valores) {
    return null;
  }

  return (
    <section className="mision-vision-section">
      <div className="mv-container">

        {/* Misión */}
        {mision && (
          <div ref={ref1} className={`mv-card scroll-reveal ${vis1 ? 'revealed' : ''}`}>
            <div className="mv-icon-wrapper mision-icon">
              <FaBullseye />
            </div>
            <h3>Nuestra Misión</h3>
            <p>{mision}</p>
          </div>
        )}

        {/* Visión */}
        {vision && (
          <div ref={ref2} className={`mv-card scroll-reveal delay-1 ${vis2 ? 'revealed' : ''}`}>
            <div className="mv-icon-wrapper vision-icon">
              <FaEye />
            </div>
            <h3>Nuestra Visión</h3>
            <p>{vision}</p>
          </div>
        )}

        {/* Valores */}
        {valores && (
          <div ref={ref3} className={`mv-card scroll-reveal delay-2 ${vis3 ? 'revealed' : ''}`}>
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
