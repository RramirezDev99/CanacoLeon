import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div style={{
      marginTop: "120px",
      minHeight: "50vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      padding: "40px 20px",
    }}>
      <h1 style={{
        fontSize: "8rem",
        fontWeight: 900,
        color: "#004aad",
        lineHeight: 1,
        marginBottom: "0",
        opacity: 0.15,
      }}>
        404
      </h1>
      <h2 style={{
        fontSize: "1.8rem",
        fontWeight: 700,
        color: "#0f3057",
        marginTop: "-20px",
        marginBottom: "16px",
      }}>
        Página no encontrada
      </h2>
      <p style={{
        fontSize: "1.05rem",
        color: "#64748b",
        maxWidth: "450px",
        marginBottom: "30px",
        lineHeight: 1.6,
      }}>
        Lo sentimos, la página que buscas no existe o fue movida.
        Te invitamos a regresar al inicio.
      </p>
      <Link
        to="/"
        style={{
          display: "inline-block",
          padding: "14px 36px",
          background: "#004aad",
          color: "white",
          borderRadius: "50px",
          fontWeight: 600,
          fontSize: "0.95rem",
          textDecoration: "none",
          boxShadow: "0 4px 20px rgba(0, 74, 173, 0.3)",
          transition: "all 0.3s ease",
        }}
      >
        Volver al Inicio
      </Link>
    </div>
  );
};

export default NotFound;
