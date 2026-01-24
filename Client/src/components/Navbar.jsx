import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom'; // <--- OJO: Agregamos Link
import { FaSun, FaMoon, FaBars, FaTimes, FaChevronDown } from 'react-icons/fa'; // <--- 1. Agregamos la flecha
import logoIcon from '../assets/logo.svg';
import logoText from '../assets/textIcon.svg';
import './Navbar.css';

function Navbar() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  
  // 2. ESTADO PARA EL MENÚ SECRETO
  const [showAdmin, setShowAdmin] = useState(false); 

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
        
        {/* LOGO (Igual que antes) */}
        <div className="logo-container">
            <NavLink to="/" className="logo-area" onClick={() => setMenuOpen(false)}>
                <img src={logoIcon} alt="Logo" className="brand-icon" />
                <img src={logoText} alt="Canaco" className="brand-text" />
            </NavLink>
        </div>

        {/* NAV LINKS (Igual que antes) */}
        <nav className={`nav-links ${menuOpen ? 'active-mobile' : ''}`}>
            <NavLink to="/" className={linkClass} onClick={toggleMenu}>Inicio</NavLink>
            <NavLink to="/nosotros" className={linkClass} onClick={toggleMenu}>Nosotros</NavLink>
            <NavLink to="/servicios" className={linkClass} onClick={toggleMenu}>Servicios</NavLink>
            <NavLink to="/afiliarme-info" className={linkClass} onClick={toggleMenu}>Afiliarme</NavLink> 
            <NavLink to="/contacto" className={linkClass} onClick={toggleMenu}>Contacto</NavLink>
            <NavLink to="/directorio" className={linkClass} onClick={toggleMenu}>Directorio</NavLink>
            
            <div className="mobile-btn">
                <NavLink to="/afiliarme" className="btn-afiliarme" onClick={toggleMenu}>
                    Soy Afiliado
                </NavLink>
            </div>
        </nav>

        {/* ACCIONES (AQUÍ ESTÁ LA MAGIA) */}
        <div className="nav-actions">
            
            {/* 3. MODIFICAMOS EL CONTENEDOR DEL BOTÓN DE ESCRITORIO */}
            <div className="desktop-btn admin-wrapper">
                
                {/* El Botón Azul Normal */}
                <NavLink to="/afiliarme" className="btn-afiliarme">
                    Soy Afiliado
                </NavLink>

                {/* La Flechita Discreta */}
                <button 
                    className="admin-arrow-btn" 
                    onClick={() => setShowAdmin(!showAdmin)}
                >
                    <FaChevronDown />
                </button>

                {/* El Menú Desplegable (Solo aparece si showAdmin es true) */}
                {showAdmin && (
                    <div className="admin-dropdown">
                        <Link to="/login" onClick={() => setShowAdmin(false)}>
                             Acceso Admin
                        </Link>
                    </div>
                )}
            </div>
            
            {/* TUS OTROS BOTONES (Tema y Hamburguesa) */}
            <div className="theme-switch" onClick={toggleTheme}>
                <div className="switch-circle">
                    {isDarkMode ? <FaMoon /> : <FaSun />}
                </div>
            </div>

            <div className="hamburger-icon" onClick={toggleMenu}>
                {menuOpen ? <FaTimes /> : <FaBars />}
            </div>
        </div>

      </div>
    </header>
  );
}

export default Navbar;