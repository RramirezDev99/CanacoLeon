import React from "react";
import "./AfiliarmeVideo.css";

// 1. IMPORTAMOS EL VIDEO DIRECTAMENTE DESDE ASSETS
import canacoVideo from "../assets/canacovid.mp4";

const AfiliarmeVideo = () => {
  return (
    <section className="afiliarme-video-section">
      {/* El Contenedor Glass */}
      <div className="video-glass-card">
        
        {/* Contenedor del Video */}
        <div className="video-wrapper">
          
          {/* 2. REEMPLAZAMOS IFRAME POR ETIQUETA VIDEO NATIVA */}
          <video
            width="100%"
            height="100%"
            controls       /* Muestra controles de play/pausa/volumen */
            playsInline    /* Para que no se abra a pantalla completa a la fuerza en iOS */
            style={{ 
              borderRadius: "8px", 
              objectFit: "cover",
              backgroundColor: "#000" /* Fondo negro por si tarda medio segundo en cargar */
            }}
          >
            {/* 3. LE PASAMOS LA VARIABLE DEL IMPORT */}
            <source src={canacoVideo} type="video/mp4" />
            Tu navegador no soporta la reproducción de videos.
          </video>

          {/* NUEVO: Texto superpuesto en la esquina inferior */}
          {/* Agregamos pointerEvents: 'none' para que el texto no tape los clics del video */}
          <div className="video-overlay-text" style={{ pointerEvents: "none" }}>
            <h3>Canaco León</h3>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AfiliarmeVideo;