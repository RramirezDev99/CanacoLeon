import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaSun, FaMoon, FaBars, FaTimes } from 'react-icons/fa'; // 1. Importamos iconos extra
import logoIcon from '../assets/logo.svg';
import logoText from '../assets/textIcon.svg';
import './Navbar.css';

function Navbar() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // 2. Estado del menú

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark-mode');
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const linkClass = ({ isActive }) => isActive ? "nav-link active" : "nav-link";

  return (
    <header className="navbar-container">
      <div className="navbar-content">
        
        {/* 1. IZQUIERDA: Logo */}
        <div className="logo-container">
            <NavLink to="/" className="logo-area" onClick={() => setMenuOpen(false)}>
                <img src={logoIcon} alt="Logo" className="brand-icon" />
                <img src={logoText} alt="Canaco" className="brand-text" />
            </NavLink>
        </div>

        {/* 2. CENTRO: Links (Ahora con clase condicional para móvil) */}
        <nav className={`nav-links ${menuOpen ? 'active-mobile' : ''}`}>
            <NavLink to="/" className={linkClass} onClick={toggleMenu}>Inicio</NavLink>
            <NavLink to="/nosotros" className={linkClass} onClick={toggleMenu}>Nosotros</NavLink>
            <NavLink to="/servicios" className={linkClass} onClick={toggleMenu}>Servicios</NavLink>
            <NavLink to="/afiliarme-info" className={linkClass} onClick={toggleMenu}>Afiliarme</NavLink> 
            <NavLink to="/contacto" className={linkClass} onClick={toggleMenu}>Contacto</NavLink>
            <NavLink to="/directorio" className={linkClass} onClick={toggleMenu}>Directorio</NavLink>
            
            {/* Botón extra SOLO para el menú móvil */}
            <div className="mobile-btn">
                <NavLink to="/afiliarme" className="btn-afiliarme" onClick={toggleMenu}>
                    Soy Afiliado
                </NavLink>
            </div>
        </nav>

        {/* 3. DERECHA: Botones de Acción */}
        <div className="nav-actions">
            {/* Botón de escritorio (se oculta en móvil con CSS) */}
            <div className="desktop-btn">
                <NavLink to="/afiliarme" className="btn-afiliarme">
                    Soy Afiliado
                </NavLink>
            </div>
            
            <div className="theme-switch" onClick={toggleTheme}>
                <div className="switch-circle">
                    {isDarkMode ? <FaMoon /> : <FaSun />}
                </div>
            </div>

            {/* Icono Hamburguesa (Nuevo) */}
            <div className="hamburger-icon" onClick={toggleMenu}>
                {menuOpen ? <FaTimes /> : <FaBars />}
            </div>
        </div>

      </div>
    </header>
  );
}

export default Navbar;