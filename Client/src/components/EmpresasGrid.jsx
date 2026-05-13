import React, { useState, useEffect } from "react";
import { FaFacebook, FaInstagram, FaGlobe, FaStore } from "react-icons/fa";
import "./EmpresasGrid.css";
import { API_URL, FILES_BASE } from "../lib/api";
import EmptyState from "./EmptyState";

const EmpresasGrid = () => {
  const [empresas, setEmpresas] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarDirectorio = async () => {
      try {
        const respuesta = await fetch(`${API_URL}/EmpresaDirectorio`);
        
        if (!respuesta.ok) {
          throw new Error("Error al jalar los datos del servidor");
        }

        const datos = await respuesta.json();
        setEmpresas(datos);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setCargando(false);
      }
    };

    cargarDirectorio();
  }, []);

  return (
    <section className="empresas-section">
      <h2 className="empresas-titulo">Empresas Afiliadas</h2>

      {cargando ? (
        <p className="cargando-texto">Cargando directorio...</p>
      ) : empresas.length === 0 ? (
        <EmptyState
          icon={<FaStore />}
          title="Directorio Comercial Próximamente"
          message="Estamos registrando a las empresas afiliadas. Pronto podrás explorar el directorio completo con información de contacto y redes sociales de cada negocio."
        />
      ) : (
        <div className="empresas-grid">
          {empresas.map((empresa) => (
            <div className="empresa-card" key={empresa.id}>
              
              <div className="empresa-logo-container">
                <div className="empresa-logo-circle">
                  <img 
                    src={`${FILES_BASE}${empresa.rutaLogo}`}
                    alt={`Logo ${empresa.nombre}`} 
                    onError={(e) => { e.target.src = "/default-new.png"; }} 
                  />
                </div>
              </div>

              <div className="empresa-info">
                <h3>{empresa.nombre}</h3>
                <p className="empresa-giro">Giro: {empresa.giro}</p>
                <p className="empresa-desc">{empresa.descripcion}</p>

                <div className="empresa-contacto">
                  {empresa.telefono && <p><strong>Tel:</strong> {empresa.telefono}</p>}
                  {empresa.email && <p><strong>Email:</strong> {empresa.email}</p>}
                  {empresa.sitioWeb && <p><strong>Website:</strong> {empresa.sitioWeb}</p>}
                </div>

                <div className="empresa-sociales">
                  {empresa.facebookUrl && (
                    <a href={empresa.facebookUrl} target="_blank" rel="noreferrer" aria-label="Facebook">
                      <FaFacebook />
                    </a>
                  )}
                  {empresa.instagramUrl && (
                    <a href={empresa.instagramUrl} target="_blank" rel="noreferrer" aria-label="Instagram">
                      <FaInstagram />
                    </a>
                  )}
                  {empresa.sitioWeb && (
                    <a href={empresa.sitioWeb} target="_blank" rel="noreferrer" aria-label="Website">
                      <FaGlobe />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default EmpresasGrid;