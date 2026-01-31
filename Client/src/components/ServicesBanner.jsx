import React from "react";
import "./ServicesBanner.css";

// CORRECCIÓN:
// Al estar en la carpeta 'public', no usamos import.
// Solo ponemos la ruta directa como texto.
const bannerImg = "/blue-banner.jpg";

const ServicesBanner = () => {
  return (
    <section className="services-banner-container">
      {/* Imagen de fondo con Parallax */}
      <div
        className="services-banner-image"
        style={{ backgroundImage: `url(${bannerImg})` }}
      ></div>

      <div className="services-banner-overlay"></div>

      <div className="services-banner-content">
        <h1>NUESTROS SERVICIOS</h1>
      </div>
    </section>
  );
};

export default ServicesBanner;
