import React, { useEffect } from "react";
import ContactoBanner from "../../components/ContactoBanner";
import ContactoForm from "../../components/ContactoForm";
import "./Contacto.css";

const Contacto = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="contacto-page-wrapper">
      <ContactoBanner />
      <ContactoForm />
      <div className="footer-spacer"></div>
    </div>
  );
};

export default Contacto;
