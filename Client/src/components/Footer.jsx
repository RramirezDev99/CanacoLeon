import React from 'react';
import './Footer.css';
import logo from '../assets/logo.svg';
import textlogo from '../assets/textIcon.svg';

const Footer = () => {
  return (
    <footer className="footer-section">
      <div className="footer-card">
        
        <div className="footer-grid">
            
            {/* Columna 1: Logo y Marca (Alineado Izquierda) */}
            <div className="footer-col brand-col">
                <img src={logo} alt="Logo Icono" className="footer-logo" style={{height: '80px', marginBottom: '0'}}/>
                <img src={textlogo} alt="Logo Texto" className="footer-logo" style={{height: '50px'}}/>
                <p className="brand-text">
                    CÁMARA NACIONAL DE COMERCIO,<br />
                    SERVICIOS Y TURISMO LEÓN.
                </p>
            </div>

            {/* Columna 2: Menú (Alineado Derecha) */}
            <div className="footer-col menu-col">
                <h3>Menú</h3>
                <ul>
                    <li><a href="/">Inicio</a></li>
                    <li><a href="/nosotros">Nosotros</a></li>
                    <li><a href="/servicios">Servicios</a></li>
                    <li><a href="/afiliarme">Afiliarme</a></li>
                    <li><a href="/contacto">Contacto</a></li>
                    <li><a href="/directorio">Directorio comercial</a></li>
                </ul>
            </div>

            {/* Columna 3: Dirección (Alineado Derecha) */}
            <div className="footer-col address-col">
                <h3>Dirección</h3>
                <p>Blvd. Francisco Villa #1028</p>
                <p>Fracc. María Dolores CP. 37550</p>
                <p>León, Guanajuato, México</p>
                <p className="phone">Tel: 477 714 2800</p>
            </div>
        </div>

        {/* Copyright */}
        <div className="footer-bottom">
            <div className="divider"></div>
            <p className="copyright">© {new Date().getFullYear()}. TODOS LOS DERECHOS RESERVADOS</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;