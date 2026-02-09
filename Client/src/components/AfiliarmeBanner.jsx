import React from "react";
// Este importa su propio CSS que está en la misma carpeta components
import "./AfiliarmeBanner.css";

// --- AQUÍ CAMBIAS LA IMAGEN ---
// Si la imagen está en la carpeta 'public', pon "/nombre-imagen.jpg"
const bannerImg = "/blue-banner.jpg";

const AfiliarmeBanner = () => {
  return (
    <section className="afiliarme-banner-container">
      <div
        className="afiliarme-banner-image"
        style={{ backgroundImage: `url(${bannerImg})` }}
      ></div>

      <div className="afiliarme-banner-overlay"></div>

      <div className="afiliarme-banner-content">
        <h1>AFILIARME</h1>
      </div>
    </section>
  );
};

export default AfiliarmeBanner;
