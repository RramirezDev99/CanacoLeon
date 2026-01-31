import React from "react";
import "./AboutBanner.css";

// 1. IMPORTA LA IMAGEN AQUÍ
// (Asegúrate que la ruta coincida con donde la pusiste)
import bannerImg from "../../assets/blue-banner.jpg";

const AboutBanner = () => {
  return (
    <section className="about-banner-container">
      <div
        className="about-banner-image"
        style={{
          // 2. USA LA VARIABLE IMPORTADA
          // Vite se encargará de poner la ruta correcta final
          backgroundImage: `url(${bannerImg})`,
        }}
      ></div>

      <div className="about-banner-overlay"></div>

      <div className="about-banner-content">
        <h1>QUIENES SOMOS</h1>
      </div>
    </section>
  );
};

export default AboutBanner;
