import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HeroCarousel from './components/HeroCarousel';
import './App.css';

// 1. IMPORTA LA IMAGEN AQUÍ
import imagenConstruccion from './assets/construccion.jpg'; 

// Componente para la página de Inicio
const Inicio = () => {
  return (
    <div className="page-home">
      <HeroCarousel />
      <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <img 
            src={imagenConstruccion} 
            alt="Sitio en construcción" 
            style={{ maxWidth: '100%', height: 'auto' }} 
        />
      </div>
    </div>
  );
};

// Componente Placeholder (Para que las otras páginas no den error)
const PaginaTemporal = ({ titulo }) => (
  <div style={{ marginTop: '120px', textAlign: 'center', fontSize: '2rem', color: '#555' }}>
    <h1>{titulo}</h1>
    <p>Sección en construcción...</p>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* Ruta Principal */}
        <Route path="/" element={<Inicio />} />

        {/* --- RUTAS AGREGADAS PARA CORREGIR ERRORES --- */}
        <Route path="/nosotros" element={<PaginaTemporal titulo="Nosotros" />} />
        <Route path="/servicios" element={<PaginaTemporal titulo="Servicios" />} />
        <Route path="/afiliarme-info" element={<PaginaTemporal titulo="Información de Afiliación" />} />
        <Route path="/contacto" element={<PaginaTemporal titulo="Contacto" />} />
        <Route path="/directorio" element={<PaginaTemporal titulo="Directorio Comercial" />} />
        
        {/* Ruta para el botón "Soy Afiliado" */}
        <Route path="/afiliarme" element={<PaginaTemporal titulo="Portal de Afiliados" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;