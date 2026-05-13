import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaLinkedin, FaInstagram, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import './Footer.css';
import logo from '../assets/logo.svg';
import textlogo from '../assets/textIcon.svg';

const Footer = () => {
  return (
    <footer className="footer-section">
      <div className="footer-card">

        <div className="footer-grid">

          {/* Columna 1: Logo y Marca */}
          <div className="footer-col brand-col">
            <img src={logo} alt="Logo Icono" className="footer-logo" style={{height: '80px', marginBottom: '0'}}/>
            <img src={textlogo} alt="Logo Texto" className="footer-logo" style={{height: '50px'}}/>
            <p className="brand-text">
              CÁMARA NACIONAL DE COMERCIO,<br />
              SERVICIOS Y TURISMO LEÓN.
            </p>
            <div className="footer-social">
              <a href="https://www.facebook.com/canacoservyturleon" target="_blank" rel="noreferrer" aria-label="Facebook"><FaFacebook /></a>
              <a href="https://www.linkedin.com/in/canaco-le%C3%B3n-941056115/" target="_blank" rel="noreferrer" aria-label="LinkedIn"><FaLinkedin /></a>
              <a href="https://x.com/canacoleon" target="_blank" rel="noreferrer" aria-label="X"><FaXTwitter /></a>
              <a href="https://www.instagram.com/canacoleon/" target="_blank" rel="noreferrer" aria-label="Instagram"><FaInstagram /></a>
            </div>
          </div>

          {/* Columna 2: Menú */}
          <div className="footer-col menu-col">
            <h3>Menú</h3>
            <ul>
              <li><Link to="/">Inicio</Link></li>
              <li><Link to="/nosotros">Nosotros</Link></li>
              <li><Link to="/servicios">Servicios</Link></li>
              <li><Link to="/afiliarme">Afiliarme</Link></li>
              <li><Link to="/contacto">Contacto</Link></li>
              <li><Link to="/directorio">Directorio Comercial</Link></li>
            </ul>
          </div>

          {/* Columna 3: Contacto + Dirección */}
          <div className="footer-col address-col">
            <h3>Contacto</h3>
            <div className="footer-contact-item">
              <FaMapMarkerAlt className="footer-contact-icon" />
              <div>
                <p>Blvd. Francisco Villa #1028</p>
                <p>Fracc. María Dolores CP. 37550</p>
                <p>León, Guanajuato, México</p>
              </div>
            </div>
            <div className="footer-contact-item">
              <FaPhoneAlt className="footer-contact-icon" />
              <p>477 714 2800</p>
            </div>
            {/* Email: agregar cuando se tenga el correo oficial */}
          </div>

          {/* Columna 4: Mapa */}
          <div className="footer-col map-col">
            <h3>Ubicación</h3>
            <div className="footer-map-wrapper">
              <iframe
                title="Ubicación CANACO León"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3721.0!2d-101.6713!3d21.1236!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x842bbe1c7e0b0001%3A0x1!2sBlvd.+Francisco+Villa+1028%2C+Mar%C3%ADa+Dolores%2C+37550+Le%C3%B3n%2C+Gto.!5e0!3m2!1ses!2smx!4v1"
                width="100%"
                height="200"
                style={{ border: 0, borderRadius: '12px' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="footer-bottom">
          <div className="divider"></div>
          <p className="copyright">
            © {new Date().getFullYear()} CANACO SERVyTUR León. TODOS LOS DERECHOS RESERVADOS
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;