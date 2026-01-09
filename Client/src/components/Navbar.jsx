import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { FaFacebookF, FaYoutube, FaInstagram, FaMoon, FaSun, FaBars, FaTimes } from 'react-icons/fa';
import logo from '../assets/logo.png'; 
import './Navbar.css';

function Navbar() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="header-modern">
      {/* --- BARRA SUPERIOR (DESKTOP) --- */}
      <div className="top-bar">
        <div className="container-xl top-bar-content">
          <div className="contact-info">
             <span>Blvd. Francisco Villa #1028</span>
             <span className="separator">•</span>
             <span>477 714 2800</span>
          </div>
          <div className="social-actions">
            <div className="social-icons">
              <a href="#"><FaFacebookF /></a>
              <a href="#"><FaInstagram /></a>
              <a href="#"><FaYoutube /></a>
            </div>
            
            {/* AQUÍ FALTABA ESTE BOTÓN PARA DESKTOP */}
            <button 
              className="theme-btn" 
              onClick={() => setIsDarkMode(!isDarkMode)}
              title="Cambiar tema"
            >
              {isDarkMode ? <FaSun /> : <FaMoon />}
            </button>

          </div>
        </div>
      </div>

      {/* --- NAVEGACIÓN --- */}
      <div className="main-nav-wrapper">
        <div className="container-xl nav-content">
          
          <NavLink to="/" className="brand-logo" onClick={closeMenu}>
            <img src={logo} alt="Canaco León" />
          </NavLink>

          <div className="mobile-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FaTimes /> : <FaBars />}
          </div>

          <nav className={`nav-links ${menuOpen ? 'active' : ''}`}>
            <NavLink to="/" className="nav-item" onClick={closeMenu}>INICIO</NavLink>
            <NavLink to="/nosotros" className="nav-item" onClick={closeMenu}>NOSOTROS</NavLink>
            <NavLink to="/servicios" className="nav-item" onClick={closeMenu}>SERVICIOS</NavLink>
            <NavLink to="/beneficios" className="nav-item" onClick={closeMenu}>BENEFICIOS</NavLink>
            <NavLink to="/salas" className="nav-item" onClick={closeMenu}>SALAS</NavLink>
            
            <div className="action-buttons">
              <NavLink to="/afiliarme" className="btn-outline" onClick={closeMenu}>AFILIARME</NavLink>
              <NavLink to="/contacto" className="btn-solid" onClick={closeMenu}>CONTACTO</NavLink>
              
              {/* Botón Móvil */}
              <button 
                className="theme-btn-mobile" 
                onClick={() => { setIsDarkMode(!isDarkMode); closeMenu(); }}
              >
                {/* Usamos Flexbox en CSS para centrar este contenido */}
                {isDarkMode ? "Modo Claro" : "Modo Oscuro"}
              </button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Navbar;