import React from "react";

// Importamos el Banner
import ServicesBanner from "../../components/ServicesBanner";

// Importamos la Sección de Tarjetas (Aquí es donde viven las tarjetas ahora)
import ServiciosSection from "../../components/ServiciosSection";

// Estilos del contenedor
import "./servicios.css";

const Servicios = () => {
  return (
    <div className="servicios-page-wrapper">
      {/* 1. Banner Superior */}
      <ServicesBanner />

      {/* 2. Sección de Tarjetas (UNA SOLA VEZ) */}
      <ServiciosSection />
    </div>
  );
};

export default Servicios;
