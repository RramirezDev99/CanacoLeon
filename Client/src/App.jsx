import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HeroCarousel from './components/HeroCarousel';
import './App.css';

// 1. IMPORTA LA IMAGEN AQUÍ (Asegúrate de que la ruta sea ./ si assets está junto a App.js)
import imagenConstruccion from './assets/construccion.jpg'; 

const Inicio = () => {
  return (
    <div className="page-home">
      <HeroCarousel />
      <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
        {/* 2. USA LA VARIABLE IMPORTADA EN EL SRC */}
        <img 
            src={imagenConstruccion} 
            alt="Sitio en construcción" 
            style={{ maxWidth: '100%', height: 'auto' }} /* Estilo recomendado para evitar desbordes */
        />
      </div>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Inicio />} />
        {/* ... resto de rutas ... */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;