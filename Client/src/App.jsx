import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar';
import logo from './assets/logo.png';
import './App.css';

// 1. Creamos un pequeño componente para el contenido de "Inicio"
// (Esto es lo que tenías antes, pero encapsulado)
const Inicio = () => {
  return (
    <div className="container">
      <div className="content">
        <img src={logo} alt="Logo" className="logo" />
        <h1>Próxima página...</h1>
      </div>
    </div>
  );
};

// 2. Este es el componente principal que arma todo
function App() {
  return (
    <BrowserRouter>
      {/* El Navbar va FUERA de Routes para que siempre se vea, no importa en qué página estés */}
      {/* <Navbar /> */}

      {/* Routes decide qué mostrar abajo según la URL */}
      <Routes>
        {/* Cuando la ruta sea "/" (el inicio), muestra el componente Inicio */}
        <Route path="/" element={<Inicio />} />
        
        {/* Aquí irás agregando las otras páginas en el futuro */}
        <Route path="/idiomas" element={<div style={{marginTop: '100px', textAlign: 'center'}}>Aquí irá el Centro de Idiomas</div>} />
        <Route path="/contacto" element={<div style={{marginTop: '100px', textAlign: 'center'}}>Aquí irá el formulario de contacto</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;