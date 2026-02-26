import React from "react";
import "./directorio-comercial.css";

// Importamos los componentes
import DirectorioComercialBanner from "../../components/DirectorioComercialBanner";
import EmpresasGrid from "../../components/EmpresasGrid";

const DirectorioComercial = () => {
  return (
    <div className="directorio-page-wrapper">
      <DirectorioComercialBanner />
      <EmpresasGrid />
    </div>
  );
};

export default DirectorioComercial;