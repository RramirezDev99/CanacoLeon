import React, { useState, useEffect } from 'react';
import './NewsSection.css';

const NewsSection = () => {
  const [noticias, setNoticias] = useState([]);

  useEffect(() => {
    // Usamos el puerto correcto 5286
    fetch('http://localhost:5286/api/noticias')
      .then(res => res.json())
      .then(data => setNoticias(data))
      .catch(err => console.error("Error cargando noticias:", err));
  }, []);

  return (
    <section className="news-section">
      <div className="news-container">
        
        <div className="header-container">
            <h2 className="section-title">Noticias Recientes</h2>
        </div>

        <div className="news-grid">
          {noticias.map((noticia, index) => (
            <div key={noticia.id || index} className="glass-card">
              <div className="card-image-wrapper">
                {/* --- CAMBIO AQUÍ --- */}
                {/* Forzamos la imagen que subiste a la carpeta public. */}
                <img 
                  src="/default-new.png" 
                  alt="Portada de noticia" 
                />
              </div>
              
              <div className="card-content">
                <h3>{noticia.titulo || noticia.Titulo}</h3>
                <p>{noticia.resumen || noticia.Resumen}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="news-footer">
            <a href="/noticias" className="see-all-link">
                Todas las noticias &rarr;
            </a>
        </div>

      </div>
    </section>
  );
};

export default NewsSection;