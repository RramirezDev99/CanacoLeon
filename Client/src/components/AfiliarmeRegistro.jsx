import React, { useState, useRef } from "react";
import "./AfiliarmeRegistro.css";

const AfiliarmeRegistro = () => {
  const [formData, setFormData] = useState({
    nombreCompleto: "",
    razonSocial: "",
    rfc: "",
    telefono: "",
    email: "",
  });

  const [files, setFiles] = useState({
    constancia: null,
    ine: null,
    domicilio: null,
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
    setLoading(true);

    const data = new FormData();

    // Sincronización exacta con las propiedades del DTO en C# (PascalCase)
    data.append("NombreCompleto", formData.nombreCompleto);
    data.append("RazonSocial", formData.razonSocial);
    data.append("RFC", formData.rfc);
    data.append("Telefono", formData.telefono || "Sin teléfono");
    data.append("Email", formData.email);

    // Archivos mapeados al DTO
    if (files.constancia) data.append("Constancia", files.constancia);
    if (files.ine) data.append("Ine", files.ine);
    if (files.domicilio) data.append("Comprobante", files.domicilio);

    try {
      const response = await fetch(
        "http://localhost:5286/api/afiliado/solicitar",
        {
          method: "POST",
          body: data,
        },
      );

      if (response.ok) {
        alert("¡Solicitud enviada con éxito, Rubén!");
      } else {
        alert(
          "Error 400/500: Revisa que el servidor en el puerto 5286 esté encendido.",
        );
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      alert("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

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
        <p className="file-name">{file ? file.name : subLabel}</p>
      </div>
    );
  };

  return (
    <section className="afiliarme-registro-section">
      <div className="registro-wrapper">
        <div className="section-title">
          <h3>Carga de Documentos</h3>
        </div>
        <div className="documents-grid">
          <DropZone
            label="Constancia de Situación Fiscal"
            fileKey="constancia"
            acceptedFormats=".pdf"
          />
          <DropZone
            label="Identificación Oficial (INE)"
            fileKey="ine"
            acceptedFormats=".pdf,.jpg"
          />
          <DropZone
            label="Comprobante de Domicilio"
            fileKey="domicilio"
            acceptedFormats=".pdf,.jpg"
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
