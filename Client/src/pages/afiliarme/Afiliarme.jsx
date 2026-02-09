import React, { useEffect } from "react";

// --- IMPORTACIÓN DE COMPONENTES ---
// Asegúrate de que estos archivos existan en src/components/
import AfiliarmeBanner from "../../components/AfiliarmeBanner";
import AfiliarmeVideo from "../../components/AfiliarmeVideo";
import AfiliarmeRegistro from "../../components/AfiliarmeRegistro";

// Estilos de la página
import "./Afiliarme.css";

const Afiliarme = () => {
  // (Opcional) Hace que la página empiece arriba al cargar
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="afiliarme-page-wrapper">
      {/* 1. Banner Superior (Imagen azul) */}
      <AfiliarmeBanner />

      {/* 2. Video de Presentación (Grande y Glass) */}
      <AfiliarmeVideo />

      {/* 3. Sección de Registro (Drag & Drop + Formulario) */}
      <AfiliarmeRegistro />

      {/* Espaciador final para que el footer no quede pegado */}
      <div className="footer-spacer"></div>
    </div>
  );
};

export default Afiliarme;
