import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import './NewsSection.css';

// CORRECCIÓN:
// 1. Usamos '../' para salir de 'components' hacia 'src' y entrar a 'assets'
// 2. Apuntamos a 'default-new.png.png' tal cual aparece en tu explorador
import defaultNewsImage from '../assets/default-new.png.png';

const DEFAULT_IMG = defaultNewsImage;

const noticiasMock = [
  {
    id: 1,
    titulo: "Buscamos que el sector Comercio, Servicios y Turismo se sumen a Marca Gto",
    resumen: "El día de hoy nos acompañan de Secretaría de Desarrollo Económico Sustentable (SDES) para que el sector Comercio, Servicios y Turismo de nuestro Estado se sumen a Marca Gto...",
    imagen: DEFAULT_IMG
  },
  {
    id: 2,
    titulo: "Expo Provee en la Velaria de la Feria",
    resumen: "Participando en la inauguración de la 2da edición de Expo Provee en la Velaria de la Feria, reuniendo a la cadena productiva de la industria de hospedaje...",
    imagen: DEFAULT_IMG
  },
  {
    id: 3,
    titulo: "Feria Regreso a Clases León",
    resumen: "Participando en la inauguración de la 2da edición de Expo Provee en la Velaria de la Feria, reuniendo a la cadena productiva de la industria de hospedaje...",
    imagen: DEFAULT_IMG
  }
];

const NewsSection = () => {
  return (
    <section className="news-section">
      
      {/* Container Principal */}
      <div className="news-container">
        
        {/* Blobs de Fondo (Efecto Spray) */}
        <div className="background-blobs">
            <div className="blob blob-blue-left"></div>
            <div className="blob blob-blue-right"></div>
        </div>

        {/* Header (Título) */}
        <div className="header-container">
             <h2 className="section-title">Noticias Recientes</h2>
        </div>

        {/* Grid de Tarjetas */}
        <div className="news-grid">
          {noticiasMock.map((nota) => (
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
            TODAS LAS NOTICIAS <FaArrowRight style={{ marginLeft: '8px', fontSize: '0.9em' }}/>
          </NavLink>
        </div>

      </div>
    </section>
  );
};

export default NewsSection;