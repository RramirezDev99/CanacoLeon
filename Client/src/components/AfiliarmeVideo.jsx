import React from "react";
import "./AfiliarmeVideo.css";

const AfiliarmeVideo = () => {
  return (
    <section className="afiliarme-video-section">
      {/* El Contenedor Glass */}
      <div className="video-glass-card">
        {/* --- SE ELIMINÓ EL HEADER DE TEXTO AQUÍ --- */}

        {/* Contenedor del Video */}
        <div className="video-wrapper">
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/5qap5aO4i9A" // REEMPLAZA CON TU VIDEO
            title="Video Afiliación"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>

          {/* --- NUEVO: Texto superpuesto en la esquina inferior --- */}
          <div className="video-overlay-text">
            <h3>Canaco León</h3>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AfiliarmeVideo;
