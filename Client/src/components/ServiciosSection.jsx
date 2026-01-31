import React from "react";
import "./ServiciosSection.css"; // Importamos su propio CSS

// Datos estáticos basados en tu diseño
const serviciosData = [
  {
    id: 1,
    titulo: "Capacitación",
    descripcion:
      "El día de hoy nos acompañan de Secretaría de Desarrollo Económico Sustentable (SDES) para que el sector Comercio, Servicios y Turismo de nuestro Estado se sumen a Marca Gto y así se fortalezcan y dotados de identidad.",
    imagen:
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80",
    reverse: false,
  },
  {
    id: 2,
    titulo: "Networking",
    descripcion:
      "Generamos espacios de vinculación entre empresas, emprendedores e instituciones, fomentando alianzas estratégicas que fortalecen el ecosistema empresarial y abren nuevas oportunidades de negocio.",
    imagen:
      "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80",
    reverse: true, // FOTO A LA IZQUIERDA
  },
  {
    id: 3,
    titulo: "Asesorías",
    descripcion:
      "Brindamos asesoría especializada para apoyar la toma de decisiones, el desarrollo empresarial y la solución de retos, mediante el acompañamiento de expertos en distintas áreas.",
    imagen:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80",
    reverse: false,
  },
  {
    id: 4,
    titulo: "Representatividad",
    descripcion:
      "Representamos los intereses del sector ante instancias públicas y privadas, impulsando iniciativas que favorezcan el crecimiento, la competitividad y el desarrollo económico del Estado.",
    imagen:
      "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=800&q=80",
    reverse: true, // FOTO A LA IZQUIERDA
  },
  {
    id: 5,
    titulo: "Renta de Salas",
    descripcion:
      "Ponemos a tu disposición salas equipadas para reuniones, capacitaciones y eventos empresariales, en un entorno profesional que facilita la colaboración y el trabajo efectivo.",
    imagen:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
    reverse: false,
  },
];

const ServiciosSection = () => {
  return (
    <section className="servicios-section-container">
      <div className="servicios-wrapper">
        {serviciosData.map((servicio) => (
          <div
            key={servicio.id}
            className={`servicio-card glass-panel ${servicio.reverse ? "reverse" : ""}`}
          >
            {/* Texto */}
            <div className="servicio-info">
              <h2>{servicio.titulo}</h2>
              <p>{servicio.descripcion}</p>
            </div>

            {/* Imagen */}
            <div className="servicio-img-container">
              <img src={servicio.imagen} alt={servicio.titulo} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ServiciosSection;
