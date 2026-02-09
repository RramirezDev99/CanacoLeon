import React, { useState, useRef } from "react";
import "./AfiliarmeRegistro.css";

const AfiliarmeRegistro = () => {
  // Estados para controlar los archivos subidos
  const [files, setFiles] = useState({
    registro: null,
    constancia: null,
    domicilio: null,
  });

  // Función genérica para manejar la selección de archivos
  const handleFileChange = (key, event) => {
    const file = event.target.files[0];
    if (file) {
      setFiles((prev) => ({ ...prev, [key]: file }));
    }
  };

  // Componente interno para la Zona de "Drag & Drop"
  const DropZone = ({ label, subLabel, fileKey, acceptedFormats }) => {
    const file = files[fileKey];
    const inputRef = useRef(null);

    const handleClick = () => inputRef.current.click();

    return (
      <div
        className={`drop-zone-card ${file ? "uploaded" : ""}`}
        onClick={handleClick}
      >
        <input
          type="file"
          ref={inputRef}
          style={{ display: "none" }}
          accept={acceptedFormats}
          onChange={(e) => handleFileChange(fileKey, e)}
        />

        {/* ICONO: Si hay archivo muestra Check, si no muestra Más (+) */}
        <div className={`icon-circle ${file ? "success" : "default"}`}>
          {file ? (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          ) : (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          )}
        </div>

        <h4>{label}</h4>
        <p className="file-name">{file ? file.name : subLabel}</p>
      </div>
    );
  };

  return (
    <section className="afiliarme-registro-section">
      <div className="registro-wrapper">
        {/* 1. TARJETA DE DESCARGA (Excel) */}
        <div className="glass-panel download-card">
          <div className="download-info">
            <h3>Formato de Registro</h3>
            <p>
              Descarga este archivo, llénalo con los datos y guárdalo para
              subirlo en el siguiente paso.
            </p>
            <button className="btn-download">Descargar Formato</button>
          </div>
          <div className="excel-icon">
            {/* Icono de Excel SVG */}
            <svg viewBox="0 0 50 50" width="80" height="80">
              <rect x="5" y="5" width="40" height="40" rx="5" fill="#1D6F42" />
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dy=".3em"
                fill="white"
                fontSize="24"
                fontWeight="bold"
              >
                X
              </text>
              <rect
                x="30"
                y="20"
                width="10"
                height="10"
                fill="white"
                opacity="0.3"
              />
              <rect
                x="30"
                y="32"
                width="10"
                height="8"
                fill="white"
                opacity="0.3"
              />
            </svg>
          </div>
        </div>

        {/* 2. CARGA DE DOCUMENTOS (Drag & Drop) */}
        <div className="section-title">
          <h3>Carga de Documentos</h3>
        </div>

        <div className="documents-grid">
          <DropZone
            label="Formato de Registro (Excel)"
            subLabel="registro_final.xlsx"
            fileKey="registro"
            acceptedFormats=".xlsx, .xls"
          />
          <DropZone
            label="Constancia de Situación Fiscal (PDF)"
            subLabel="Arrastra el archivo o haz click para buscar"
            fileKey="constancia"
            acceptedFormats=".pdf"
          />
          <DropZone
            label="Comprobante de Domicilio"
            subLabel="Arrastra el archivo o haz click para buscar"
            fileKey="domicilio"
            acceptedFormats=".pdf, .jpg, .png"
          />
        </div>

        {/* 3. DATOS COMPLEMENTARIOS Y ENVÍO */}
        <div className="section-title">
          <h3>Datos Complementarios y Envío</h3>
        </div>

        <div className="glass-panel form-card">
          <div className="form-group">
            <label>Correo Electrónico</label>
            <input type="email" placeholder="ejemplo@organizacion.com" />
          </div>
          <div className="form-group">
            <label>Método de Pago Preferido</label>
            <div className="select-wrapper">
              <span className="bank-icon">🏦</span>
              <select>
                <option>Transferencia</option>
                <option>Tarjeta de Crédito / Débito</option>
                <option>Efectivo en Ventanilla</option>
              </select>
            </div>
          </div>
        </div>

        <button className="btn-submit">Enviar Solicitud de Afiliación</button>
      </div>
    </section>
  );
};

export default AfiliarmeRegistro;
