import React, { useState, useRef } from "react";
import "./AfiliarmeRegistro.css";
import { API_URL } from "../lib/api";

const AfiliarmeRegistro = () => {
  const [formData, setFormData] = useState({
    nombreCompleto: "",
    razonSocial: "",
    rfc: "",
    telefono: "",
    email: "",
  });

  // 1. Agregamos formatoExcel al estado inicial
  const [files, setFiles] = useState({
    constancia: null,
    ine: null,
    domicilio: null,
    formatoExcel: null, // <--- NUEVO
  });

  const [loading, setLoading] = useState(false);

  const handleTextChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (key, event) => {
    const file = event.target.files[0];
    if (file) {
      setFiles((prev) => ({ ...prev, [key]: file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación rápida para que no manden el form incompleto
    if (!files.constancia || !files.ine || !files.domicilio || !files.formatoExcel) {
      alert("Por favor, sube los 4 documentos requeridos antes de enviar.");
      return;
    }

    setLoading(true);
    const data = new FormData();

    // Sincronización exacta con las propiedades del DTO en C# (PascalCase)
    data.append("NombreCompleto", formData.nombreCompleto);
    data.append("RazonSocial", formData.razonSocial);
    data.append("RFC", formData.rfc);
    data.append("Telefono", formData.telefono || "Sin teléfono");
    data.append("Email", formData.email);

    // Archivos mapeados al DTO
    data.append("Constancia", files.constancia);
    data.append("Ine", files.ine);
    data.append("Comprobante", files.domicilio);
    data.append("FormatoExcel", files.formatoExcel); // <--- NUEVO (Mismo nombre que en el DTO)

    try {
      const response = await fetch(
        `${API_URL}/afiliado/solicitar`,
        {
          method: "POST",
          body: data,
        }
      );

      if (response.ok) {
        alert("¡Solicitud enviada con éxito, Rubén!");
        // Opcional: Limpiar el formulario después de enviar
      } else {
        alert(
          "Error 400/500: Revisa que el servidor en el puerto 5286 esté encendido o que el modelo sea válido."
        );
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      alert("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  // Componente interno para las zonas de carga
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
        <div className={`icon-circle ${file ? "success" : "default"}`}>
          {file ? "✓" : "+"}
        </div>
        <h4>{label}</h4>
        <p className="file-name">{file ? file.name : subLabel || "Click para subir"}</p>
      </div>
    );
  };

  return (
    <section className="afiliarme-registro-section">
      <div className="registro-wrapper">
        
        {/* --- TARJETA DE DESCARGA DE FORMATO (NUEVA) --- */}
        <div className="glass-panel download-card">
          <div className="download-info">
            <h3>Formato de Registro</h3>
            <p>
              Descarga este archivo, llénalo con los datos y guárdalo para subirlo en el siguiente paso
            </p>
            {/* Asegúrate de poner tu archivo excel real en la carpeta public de React */}
            <a 
              href="/formato_registro_canaco.xlsx" 
              download 
              className="btn-download"
              style={{ display: 'inline-block', textDecoration: 'none', textAlign: 'center' }}
            >
              Descargar Formato
            </a>
          </div>
          <div className="download-image-container">
            {/* Logo de Excel en modo Glassmorphism puro */}
            <div className="glass-excel-wrapper">
              <svg 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg" 
                className="excel-icon-svg"
              >
                <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" fill="url(#excel-grad)" fillOpacity="0.6"/>
                <path d="M14 2V8H20" stroke="rgba(255,255,255,0.9)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9.5 12.5L14.5 18.5M14.5 12.5L9.5 18.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <defs>
                  <linearGradient id="excel-grad" x1="4" y1="2" x2="20" y2="22" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#107C41" />
                    <stop offset="1" stopColor="#185C37" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="excel-glass-text">XLSX</span>
            </div>
          </div>
        </div>
        {/* ---------------------------------------------- */}

        <div className="section-title">
          <h3>Carga de Documentos</h3>
        </div>
        
        {/* Aquí ahora hay 4 DropZones */}
        <div className="documents-grid">
          {/* 2. Agregamos el DropZone para el Excel al principio */}
          <DropZone
            label="Formato de Registro (Excel)"
            fileKey="formatoExcel"
            acceptedFormats=".xlsx, .xls"
            subLabel="registro_final.xlsx"
          />
          <DropZone
            label="Constancia de Situación Fiscal"
            fileKey="constancia"
            acceptedFormats=".pdf"
            subLabel="Archivo PDF"
          />
          <DropZone
            label="Identificación Oficial (INE)"
            fileKey="ine"
            acceptedFormats=".pdf,.jpg"
            subLabel="PDF o JPG"
          />
          <DropZone
            label="Comprobante de Domicilio"
            fileKey="domicilio"
            acceptedFormats=".pdf,.jpg"
            subLabel="PDF o JPG"
          />
        </div>

        <div className="section-title">
          <h3>Datos de la Empresa</h3>
        </div>
        <div className="glass-panel form-card">
          <div
            className="form-grid-layout"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
            }}
          >
            <div className="form-group">
              <label>Nombre Completo</label>
              <input
                type="text"
                name="nombreCompleto"
                value={formData.nombreCompleto}
                onChange={handleTextChange}
                placeholder="Tu nombre"
              />
            </div>
            <div className="form-group">
              <label>Razón Social</label>
              <input
                type="text"
                name="razonSocial"
                value={formData.razonSocial}
                onChange={handleTextChange}
                placeholder="Nombre de la empresa"
              />
            </div>
            <div className="form-group">
              <label>RFC</label>
              <input
                type="text"
                name="rfc"
                value={formData.rfc}
                onChange={handleTextChange}
                placeholder="RFC de 13 dígitos"
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleTextChange}
                placeholder="correo@canaco.com"
              />
            </div>
          </div>
        </div>
        <button
          className="btn-submit"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Enviando..." : "Enviar Solicitud de Afiliación"}
        </button>
      </div>
    </section>
  );
};

export default AfiliarmeRegistro;