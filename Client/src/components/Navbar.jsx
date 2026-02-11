import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
// Usamos la versión estable que no rompe tu página en León
import {
  FaSun,
  FaMoon,
  FaBars,
  FaTimes,
  FaChevronDown,
  FaFacebook,
  FaLinkedin,
  FaInstagram,
  FaTwitter, // Lo usaremos como base
} from "react-icons/fa";
import logoIcon from "../assets/logo.svg";
import logoText from "../assets/textIcon.svg";
import "./Navbar.css";

function Navbar() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle("dark-mode");
  };

  const toggleMenu = () => setMenuOpen(false);

  const linkClass = ({ isActive }) =>
    isActive ? "nav-link active" : "nav-link";

  return (
    <header className="navbar-container">
      <div className="navbar-content">
        <div className="logo-container">
          <NavLink
            to="/"
            className="logo-area"
            onClick={() => setMenuOpen(false)}
          >
            <img src={logoIcon} alt="Logo" className="brand-icon" />
            <img src={logoText} alt="Canaco" className="brand-text" />
          </NavLink>
        </div>

        <nav className={`nav-links ${menuOpen ? "active-mobile" : ""}`}>
          <NavLink to="/" className={linkClass} onClick={toggleMenu}>
            Inicio
          </NavLink>
          <NavLink to="/nosotros" className={linkClass} onClick={toggleMenu}>
            Nosotros
          </NavLink>
          <NavLink to="/servicios" className={linkClass} onClick={toggleMenu}>
            Servicios
          </NavLink>
          <NavLink
            to="/afiliarme-info"
            className={linkClass}
            onClick={toggleMenu}
          >
            Afiliarme
          </NavLink>
          <NavLink to="/contacto" className={linkClass} onClick={toggleMenu}>
            Contacto
          </NavLink>
          <NavLink to="/directorio" className={linkClass} onClick={toggleMenu}>
            Directorio
          </NavLink>

          <div className="social-icons-desktop">
            <a
              href="https://www.facebook.com/canacoservyturleon"
              target="_blank"
              rel="noreferrer"
              className="social-link facebook"
            >
              <FaFacebook />
            </a>
            <a
              href="https://www.linkedin.com/in/canaco-le%C3%B3n-941056115/"
              target="_blank"
              rel="noreferrer"
              className="social-link linkedin"
            >
              <FaLinkedin />
            </a>
            {/* Aquí aplicamos la clase x-twitter para el cambio visual */}
            <a
              href="https://x.com/canacoleon"
              target="_blank"
              rel="noreferrer"
              className="social-link x-twitter"
            >
              <FaTwitter />
            </a>
            <a
              href="https://www.instagram.com/canacoleon/"
              target="_blank"
              rel="noreferrer"
              className="social-link instagram"
            >
              <FaInstagram />
            </a>
            <span className="separator">|</span>
          </div>

          <div className="mobile-btn">
            <NavLink
              to="/afiliarme"
              className="btn-afiliarme"
              onClick={toggleMenu}
            >
              Soy Afiliado
            </NavLink>
          </div>
        </nav>

        <div className="nav-actions">
          {/* ... resto de tus acciones (admin, switch tema, etc) ... */}
          <div className="desktop-btn admin-wrapper">
            <NavLink to="/afiliarme" className="btn-afiliarme">
              Soy Afiliado
            </NavLink>
            <button
              className="admin-arrow-btn"
              onClick={() => setShowAdmin(!showAdmin)}
            >
              <FaChevronDown />
            </button>
            {showAdmin && (
              <div className="admin-dropdown">
                <Link to="/login" onClick={() => setShowAdmin(false)}>
                  Acceso Admin
                </Link>
              </div>
            )}
          </div>
          <div className="theme-switch" onClick={toggleTheme}>
            <div className="switch-circle">
              {isDarkMode ? <FaMoon /> : <FaSun />}
            </div>
          </div>
          <div
            className="hamburger-icon"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
