import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaSun, FaMoon } from 'react-icons/fa'; 
import logoIcon from '../assets/logo.svg';     // Ajusta tus rutas
import logoText from '../assets/textIcon.svg'; // Ajusta tus rutas
import './Navbar.css';

function Navbar() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark-mode');
  };

  // Función auxiliar para mantener limpio el JSX de los links
  const linkClass = ({ isActive }) => isActive ? "nav-link active" : "nav-link";

  return (
    <header className="navbar-container">
      <div className="navbar-content">
        
        {/* 1. IZQUIERDA: Logo (Independiente) */}
        <div className="logo-container">
            <NavLink to="/" className="logo-area">
                <img src={logoIcon} alt="Logo" className="brand-icon" />
                <img src={logoText} alt="Canaco" className="brand-text" />
            </NavLink>
        </div>

        {/* 2. CENTRO: Links de Navegación */}
        <nav className="nav-links">
            <NavLink to="/" className={linkClass}>Inicio</NavLink>
            <NavLink to="/nosotros" className={linkClass}>Nosotros</NavLink>
            <NavLink to="/servicios" className={linkClass}>Servicios</NavLink>
            <NavLink to="/afiliarme-info" className={linkClass}>Afiliarme</NavLink> 
            <NavLink to="/contacto" className={linkClass}>Contacto</NavLink>
            <NavLink to="/directorio" className={linkClass}>Directorio</NavLink>
        </nav>

        {/* 3. DERECHA: Botones de Acción */}
        <div className="nav-actions">
            <NavLink to="/afiliarme" className="btn-afiliarme">
                Soy Afiliado
            </NavLink>
            
            <div className="theme-switch" onClick={toggleTheme}>
                <div className="switch-circle">
                    {isDarkMode ? <FaMoon /> : <FaSun />}
                </div>
            </div>
        </div>

      </div>
    </header>
  );
}

export default Navbar;