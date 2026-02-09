import React, { useEffect } from "react";
import ContactoBanner from "../../components/ContactoBanner";
import ContactoForm from "../../components/ContactoForm";
import "./Contacto.css";

const Contacto = () => {
  // Hace que la página empiece arriba al cargar (buena práctica)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="contacto-page-wrapper">
      {/* 1. Banner Superior */}
      <ContactoBanner />

      {/* 2. Sección del Formulario y Mapa */}
      <ContactoForm />

      {/* Espacio extra abajo para que no se pegue al footer */}
      <div className="footer-spacer"></div>
    </div>
  );
};

export default Contacto;
