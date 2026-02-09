import React from "react";
import "./ContactoForm.css";

const ContactoForm = () => {
  return (
    <section className="contacto-section">
      <div className="contacto-wrapper">
        {/* COLUMNA IZQUIERDA: FORMULARIO */}
        <div className="contacto-card form-card">
          <h2>Contáctanos</h2>
          <form>
            <div className="form-group">
              <label>Nombre</label>
              <input type="text" placeholder="Tu nombre completo" />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input type="email" placeholder="ejemplo@organizacion.com" />
            </div>

            <div className="form-group">
              <label>Teléfono</label>
              <input type="tel" placeholder="477 123 4567" />
            </div>

            <div className="form-group">
              <label>Empresa</label>
              <input type="text" placeholder="Nombre de tu negocio" />
            </div>

            <div className="form-group">
              <label>Asunto</label>
              <input
                type="text"
                placeholder="Información, Afiliación, Dudas..."
              />
            </div>

            <div className="form-group">
              <label>Escriba su mensaje</label>
              <textarea
                rows="4"
                placeholder="Hola, me gustaría recibir más información sobre..."
              ></textarea>
            </div>

            <button type="button" className="btn-enviar">
              Enviar
            </button>
          </form>
        </div>

        {/* COLUMNA DERECHA: MAPA */}
        <div className="contacto-card map-card">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3721.408734685374!2d-101.66699392496556!3d21.13612888053995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x842bdb796472496d%3A0x60064f27110e54d6!2sC%C3%A1mara%20Nacional%20de%20Comercio%20Servicios%20y%20Turismo%20de%20Le%C3%B3n!5e0!3m2!1ses-419!2smx!4v1707500000000!5m2!1ses-419!2smx"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Mapa Canaco León"
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default ContactoForm;
