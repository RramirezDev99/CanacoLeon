import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HeroCarousel from './components/HeroCarousel';
import NewsSection from './components/NewsSection';
import './App.css';
import EventsSection from './components/EventsSection';
import Footer from './components/Footer';


const Inicio = () => {
  return (
    <div className="page-home">
      
      {/* 1. TU FONDO DE BLOBS Y PUNTOS (Lo que ya tenías) */}
      <div className="background-blobs-global">
          {/* ... tus blobs y el svg de puntos ... */}
           <div className="global-svg-pattern"></div>
           <div className="blob blob-1"></div>
           <div className="blob blob-2"></div>
           <div className="blob blob-3"></div>
           <div className="blob blob-4"></div>
           <div className="blob blob-center"></div>
           <div className="blob blob-mid-left"></div>
           <div className="blob blob-mid-right"></div>
           <div className="blob blob-bottom-fill"></div>
      </div>

      {/* 2. AQUÍ AGREGAMOS TU ARCO SVG */}
      <div className="background-arc"></div>

      <HeroCarousel />
      <NewsSection />
      <EventsSection />
      <Footer />
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