import React, { useState, useEffect } from "react";
import "./PresidenteBanner.css";

const PresidenteBanner = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Intentar cargar datos reales desde tu API
    fetch("http://localhost:5286/api/presidente")
      .then((res) => res.json())
      .then((result) => {
        setData(result);
        setLoading(false);
      })
      .catch((err) => {
        console.error("No se pudo cargar info presidente, usando default", err);
        setLoading(false);
      });
  }, []);

  // DATOS POR DEFECTO (Placeholder si la API falla o está vacía)
  const info = data || {
    nombre: "RUBÉN RAMÍREZ",
    cargo: "Presidente de CANACO",
    mensaje:
      "En la CANACO trabajamos todos los días para fortalecer al sector comercio, servicios y turismo, convencidos de que las empresas son el motor del desarrollo económico y social de nuestro Estado.\n\nNuestro compromiso es acompañar a nuestros afiliados mediante capacitación, asesoría, vinculación y representación.",
    imagenUrl: null, // null cargará la imagen de placeholder
  };

  const getImg = (url) => {
    // Si la URL viene de la API, le pegamos el host. Si es null, una de placeholder.
    if (!url) return "https://via.placeholder.com/600x600?text=Foto+Presidente";
    return `http://localhost:5286${url}`;
  };

  if (loading)
    return (
      <div style={{ padding: "50px", textAlign: "center" }}>Cargando...</div>
    );

  return (
    <section className="president-section">
      <div className="president-container">
        {/* COLUMNA IZQUIERDA: FOTO */}
        <div className="president-photo-col">
          <div className="photo-frame">
            <img src={getImg(info.imagenUrl)} alt={info.nombre} />
          </div>
        </div>

        {/* COLUMNA DERECHA: TEXTO */}
        <div className="president-text-col">
          <h2 className="president-name">{info.nombre}</h2>
          <h4 className="president-role">{info.cargo}</h4>

          {/* Decoración zigzag azul */}
          <div className="blue-zigzag"></div>

          <div className="president-message">
            {/* Renderizamos el mensaje respetando saltos de línea */}
            {info.mensaje &&
              info.mensaje
                .split("\n")
                .map((parrafo, i) => <p key={i}>{parrafo}</p>)}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PresidenteBanner;
