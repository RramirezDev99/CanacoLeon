import React from "react";
import "./AboutBanner.css";

// src/components/AboutBanner.jsx

const AboutBanner = () => {
  return (
    <section className="about-banner-container">
      <div 
        className="about-banner-image" 
        style={{ 
          // React buscará esto automáticamente en la carpeta public
          backgroundImage: `url('public/blue-banner.jpg')`, 
        }}
      >
        <div className="about-banner-overlay"></div>
      </div>

      <div className="about-banner-content">
          <h1>QUIENES SOMOS</h1>
      </div>
    </section>
  );
};

export default AboutBanner;
