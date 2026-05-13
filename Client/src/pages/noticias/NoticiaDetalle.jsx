import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FaArrowLeft, FaCalendarAlt } from "react-icons/fa";
import { API_URL, FILES_BASE } from "../../lib/api";
import "./NoticiaDetalle.css";

const NoticiaDetalle = () => {
  const { id } = useParams();
  const [noticia, setNoticia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/noticias/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("No encontrada");
        return res.json();
      })
      .then((data) => {
        setNoticia(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="noticia-detalle-wrapper">
        <div className="noticia-detalle-loading">Cargando noticia...</div>
      </div>
    );
  }

  if (error || !noticia) {
    return (
      <div className="noticia-detalle-wrapper">
        <div className="noticia-detalle-error">
          <h2>Noticia no encontrada</h2>
          <p>La noticia que buscas no existe o fue eliminada.</p>
          <Link to="/noticias" className="back-link">
            <FaArrowLeft /> Volver a Noticias
          </Link>
        </div>
      </div>
    );
  }

  const imgUrl = noticia.imagenUrl
    ? `${FILES_BASE}${noticia.imagenUrl}`
    : "/default-new.png";

  const fecha = new Date(noticia.fechaPublicacion || noticia.FechaPublicacion)
    .toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  return (
    <div className="noticia-detalle-wrapper">
      <div className="noticia-detalle-container">
        <Link to="/noticias" className="back-link">
          <FaArrowLeft /> Volver a Noticias
        </Link>

        <div className="noticia-detalle-header">
          <div className="noticia-fecha-badge">
            <FaCalendarAlt />
            <span>{fecha}</span>
          </div>
          <h1>{noticia.titulo}</h1>
        </div>

        <div className="noticia-detalle-imagen">
          <img src={imgUrl} alt={noticia.titulo} />
        </div>

        <div className="noticia-detalle-body">
          {noticia.resumen?.split("\n").map((parrafo, i) => (
            <p key={i}>{parrafo}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NoticiaDetalle;
