import React, { useState, useEffect } from "react";
import "./DirectorioSection.css"; // Confirma que el nombre coincida

const API_URL = "http://localhost:5286/api/directorio";
const IMG_URL = "http://localhost:5286";

const DirectorySection = () => {
  const [miembros, setMiembros] = useState([]);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setMiembros(data))
      .catch((err) => console.error("Error cargando directorio", err));
  }, []);

  const renderCategoryGrid = (titulo, categoriaKey) => {
    // Filtramos
    const list = miembros.filter((m) => m.categoria === categoriaKey);

    // Si está vacío, no mostrar nada
    if (list.length === 0) return null;

    return (
      <div className="directory-category-row">
        <h2 className="category-title">{titulo}</h2>

        {/* CAMBIO AQUÍ: Usamos Grid en lugar de Carousel */}
        <div className="directory-grid">
          {list.map((miembro) => (
            <div key={miembro.id} className="glass-card">
              <div className="card-avatar-container">
                <img
                  src={
                    miembro.imagenUrl
                      ? `${IMG_URL}${miembro.imagenUrl}`
                      : "https://via.placeholder.com/150"
                  }
                  alt={miembro.nombre}
                />
              </div>

              <div className="card-content">
                <h3 className="member-name">{miembro.nombre}</h3>
                <h4 className="member-role">{miembro.cargo}</h4>
                <p className="member-desc">{miembro.descripcion}</p>
              </div>
            </div>
          ))}
          {/* Ya no necesitamos el spacer */}
        </div>
      </div>
    );
  };

  return (
    <section className="directory-section">
      <div className="directory-wrapper">
        {renderCategoryGrid("Consejeros", "Consejeros")}
        {renderCategoryGrid("Comité Ejecutivo", "ComiteEjecutivo")}
        {renderCategoryGrid("Secciones Especializadas", "Secciones")}
        {renderCategoryGrid("Vicepresidencias", "Vicepresidencias")}
      </div>
    </section>
  );
};

export default DirectorySection;
