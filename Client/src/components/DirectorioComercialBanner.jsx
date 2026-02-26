import React from "react";
import "./DirectorioComercialBanner.css"; // Asegúrate de tener este archivo o usa el CSS global

const bannerImg = "/blue-banner.jpg"; 

const DirectorioComercialBanner = () => {
  return (
    <section className="directorio-banner-container">
      <div
        className="directorio-banner-image"
        style={{ backgroundImage: `url(${bannerImg})` }}
      ></div>
      <div className="directorio-banner-overlay"></div>
      <div className="directorio-banner-content">
        <h1>Directorio Comercial</h1>
      </div>
    </section>
  );
};

export default DirectorioComercialBanner;