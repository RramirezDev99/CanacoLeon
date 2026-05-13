import React from "react";
import "./EmptyState.css";

/**
 * Componente reutilizable para mostrar cuando una sección no tiene datos.
 * Props:
 *   icon    – Componente de React Icon (ej. <FaNewspaper />)
 *   title   – Título principal (ej. "Próximamente")
 *   message – Texto descriptivo
 *   compact – boolean, si es true usa menos padding (para secciones inline)
 */
const EmptyState = ({ icon, title = "Próximamente", message, compact = false }) => {
  return (
    <div className={`empty-state ${compact ? "empty-state--compact" : ""}`}>
      {icon && <div className="empty-state__icon">{icon}</div>}
      <h3 className="empty-state__title">{title}</h3>
      {message && <p className="empty-state__message">{message}</p>}
    </div>
  );
};

export default EmptyState;
