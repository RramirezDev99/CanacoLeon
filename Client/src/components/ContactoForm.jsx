import React, { useState } from "react";
import "./ContactoForm.css";

const ContactoForm = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    empresa: "",
    asunto: "",
    mensaje: "",
  });

  const [status, setStatus] = useState({
    loading: false,
    error: null,
    success: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: null, success: false });

    try {
      const response = await fetch("http://localhost:5286/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus({ loading: false, error: null, success: true });
        setFormData({
          nombre: "",
          email: "",
          telefono: "",
          empresa: "",
          asunto: "",
          mensaje: "",
        });
      } else {
        setStatus({
          loading: false,
          error: "Error en el servidor",
          success: false,
        });
      }
    } catch (error) {
      setStatus({ loading: false, error: "Error de conexión", success: false });
    }
  };

  return (
    <section className="contacto-section">
      <div className="contacto-wrapper">
        <div className="contacto-card form-card">
          <h2>Contáctanos</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nombre</label>
              <input
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                type="text"
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                required
              />
            </div>
            <div className="form-group">
              <label>Teléfono</label>
              <input
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                type="tel"
              />
            </div>
            <div className="form-group">
              <label>Empresa</label>
              <input
                name="empresa"
                value={formData.empresa}
                onChange={handleChange}
                type="text"
              />
            </div>
            <div className="form-group">
              <label>Asunto</label>
              <input
                name="asunto"
                value={formData.asunto}
                onChange={handleChange}
                type="text"
              />
            </div>
            <div className="form-group">
              <label>Mensaje</label>
              <textarea
                name="mensaje"
                value={formData.mensaje}
                onChange={handleChange}
                rows="4"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="btn-enviar"
              disabled={status.loading}
            >
              {status.loading ? "Enviando..." : "Enviar"}
            </button>

            {status.success && (
              <p style={{ color: "#10b981", marginTop: "10px" }}>¡Enviado!</p>
            )}
            {status.error && (
              <p style={{ color: "#ef4444", marginTop: "10px" }}>
                {status.error}
              </p>
            )}
          </form>
        </div>

        <div className="contacto-card map-card">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3721.464654516757!2d-101.6853234!3d21.1339176!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x842bc02e47640001%3A0x77d7f2122394c498!2sCANACO%20SERVYTUR%20Le%C3%B3n!5e0!3m2!1ses-419!2smx!4v1700000000000"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default ContactoForm;
