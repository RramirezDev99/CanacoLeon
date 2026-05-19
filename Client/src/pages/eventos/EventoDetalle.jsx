import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FaArrowLeft, FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";
import { API_URL, FILES_BASE } from "../../lib/api";
import "./EventoDetalle.css";

const EventoDetalle = () => {
  const { id } = useParams();
  const [evento, setEvento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/eventos/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("No encontrado");
        return res.json();
      })
      .then((data) => {
        setEvento(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="evento-detalle-wrapper">
        <div className="evento-detalle-loading">Cargando evento...</div>
      </div>
    );
  }

  if (error || !evento) {
    return (
      <div className="evento-detalle-wrapper">
        <div className="evento-detalle-error">
          <h2>Evento no encontrado</h2>
          <p>El evento que buscas no existe o fue eliminado.</p>
          <Link to="/" className="back-link">
            <FaArrowLeft /> Volver al Inicio
          </Link>
        </div>
      </div>
    );
  }

  const imgUrl = evento.imagenUrl
    ? `${FILES_BASE}${evento.imagenUrl}`
    : "/default-event.png";

  const fecha = evento.fecha
    ? new Date(evento.fecha).toLocaleDateString("es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  return (
    <div className="evento-detalle-wrapper">
      <div className="evento-detalle-container">
        <Link to="/" className="back-link">
          <FaArrowLeft /> Volver al Inicio
        </Link>

        <div className="evento-detalle-header">
          <div className="evento-meta">
            {fecha && (
              <div className="evento-fecha-badge">
                <FaCalendarAlt />
                <span>{fecha}</span>
              </div>
            )}
            {evento.lugar && (
              <div className="evento-lugar-badge">
                <FaMapMarkerAlt />
                <span>{evento.lugar}</span>
              </div>
            )}
          </div>
          <h1>{evento.titulo}</h1>
        </div>

        <div className="evento-detalle-imagen">
          <img src={imgUrl} alt={evento.titulo} />
        </div>

        <div className="evento-detalle-body">
          {evento.descripcion?.split("\n").map((parrafo, i) => (
            <p key={i}>{parrafo}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventoDetalle;
