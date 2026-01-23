import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import './NewsSection.css'; // Importante: Aquí llamamos a los estilos

const NewsSection = () => {
  const [noticias, setNoticias] = useState([]);

  useEffect(() => {
    // Asegúrate de que el puerto 7234 es el correcto de tu backend
    fetch('https://localhost:7234/api/noticias') 
      .then(response => response.json())
      .then(data => setNoticias(data))
      .catch(error => console.error("Error conectando:", error));
  }, []);

  return (
    <section className="news-section">
      {/* Fondo de Blobs */}
      <div className="background-blobs">
          <div className="blob blob-blue-left"></div>
          <div className="blob blob-blue-right"></div>
      </div>

      <div className="news-container">
        
        {/* Header */}
        <div className="header-container">
             <h2 className="section-title">
                Noticias Recientes
             </h2>
        </div>

        {/* Grid de Noticias */}
        <div className="news-grid">
          {noticias.length === 0 && <p style={{textAlign:'center', width:'100%'}}>Cargando noticias...</p>}

          {noticias.map((nota) => (
             <article key={nota.id} className="glass-card">
                <div className="card-image-wrapper">
                    <img 
                      src={nota.imagen} 
                      alt={nota.titulo} 
                      onError={(e) => {e.target.src = "https://via.placeholder.com/300x200?text=CANACO"}}
                    />
                </div>
                <div className="card-content">
                    <h3>{nota.titulo}</h3>
                    <p>{nota.resumen}</p>
                </div>
             </article>
          ))}
        </div>

        {/* Footer Link */}
        <div className="news-footer">
          <NavLink to="/noticias" className="see-all-link">
            TODAS LAS NOTICIAS <FaArrowRight style={{ marginLeft: '8px' }}/>
          </NavLink>
        </div>

      </div>
    </section>
  );
};

export default NewsSection;