import React from "react";
import "./NewsBanner.css";

const NewsBanner = () => {
  return (
    <section className="news-banner-container">
      {/* IMAGEN DE FONDO (Usamos la estructura del slide-image) */}
      <div
        className="news-banner-image"
        style={{
          // Puedes cambiar esta URL por la que gustes, he puesto una de negocios/conferencia
          backgroundImage: `url('https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1600&auto=format&fit=crop')`,
        }}
      >
        {/* OVERLAY OSCURO (Idéntico al del Hero) */}
        <div className="news-banner-overlay"></div>
      </div>

      {/* CONTENIDO CENTRADO (Idéntico al hero-content) */}
      <div className="news-banner-content">
        <h1>NOTICIAS CANACO</h1>
      </div>
    </section>
  );
};

export default NewsBanner;
