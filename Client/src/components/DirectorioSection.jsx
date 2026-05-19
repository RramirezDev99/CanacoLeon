import React, { useState, useEffect } from "react";
import { FaUsers } from "react-icons/fa";
import "./DirectorioSection.css";
import { API_URL, FILES_BASE } from "../lib/api";
import EmptyState from "./EmptyState";

const DirectorySection = () => {
  const [miembros, setMiembros] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/directorio`)
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
            <div key={miembro.id} className="dir-card">
              <div className="dir-avatar">
                <img
                  src={
                    miembro.imagenUrl
                      ? `${FILES_BASE}${miembro.imagenUrl}`
                      : "https://via.placeholder.com/150"
                  }
                  alt={miembro.nombre}
                />
              </div>

              <div className="dir-info">
                <h3 className="dir-name">{miembro.nombre}</h3>
                <h4 className="dir-role">{miembro.cargo}</h4>
                {miembro.descripcion && <p className="dir-desc">{miembro.descripcion}</p>}
              </div>
            </div>
          ))}
          {/* Ya no necesitamos el spacer */}
        </div>
      </div>
    );
  };

  const hayMiembros = miembros.length > 0;

  return (
    <section className="directory-section">
      <div className="directory-wrapper">
        {hayMiembros ? (
          <>
            {renderCategoryGrid("Consejeros", "Consejeros")}
            {renderCategoryGrid("Comité Ejecutivo", "ComiteEjecutivo")}
            {renderCategoryGrid("Secciones Especializadas", "Secciones")}
            {renderCategoryGrid("Vicepresidencias", "Vicepresidencias")}
          </>
        ) : (
          <EmptyState
            icon={<FaUsers />}
            title="Directorio Próximamente"
            message="Los miembros del directorio agregados desde el panel de administración aparecerán aquí."
          />
        )}
      </div>
    </section>
  );
};

export default DirectorySection;
