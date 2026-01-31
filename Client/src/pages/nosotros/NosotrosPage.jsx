import React from "react";
import AboutBanner from "../../components/AboutBanner";
import PresidenteBanner from "../../components/PresidenteBanner";
import "./NosotrosPage.css";

const NosotrosPage = () => {
  return (
    <div className="nosotros-page-wrapper">
      {/* 1. BANNER GIGANTE */}
      <AboutBanner />
      <PresidenteBanner />

      {/* Aquí irá el contenido de historia/misión más adelante */}
      <div className="nosotros-content-placeholder">
        {/* Espacio vacío por ahora */}
      </div>
    </div>
  );
};

export default NosotrosPage;
