import React from "react";
import "./ContactoBanner.css";

// Puedes usar la misma imagen de fondo azul abstracto que usamos en Afiliarme
// o una similar para mantener la identidad visual.
const bannerImg = "/blue-banner.jpg"; // Asegúrate de tener esta imagen o usa una URL

const ContactoBanner = () => {
  return (
    <section className="contacto-banner-container">
      <div
        className="contacto-banner-image"
        style={{ backgroundImage: `url(${bannerImg})` }}
      ></div>
      <div className="contacto-banner-overlay"></div>
      <div className="contacto-banner-content">
        <h1>CONTACTO</h1>
      </div>
    </section>
  );
};

export default ContactoBanner;
