import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// --- COMPONENTES GLOBALES ---
import Navbar from "./components/Navbar";
import HeroCarousel from "./components/HeroCarousel";
import NewsSection from "./components/NewsSection";
import EventsSection from "./components/EventsSection";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

// --- PÁGINAS ---
import Login from "./pages/admin/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import NoticiasPage from "./pages/noticias/NoticiasPage";
import NosotrosPage from "./pages/nosotros/NosotrosPage";
import Servicios from "./pages/servicios/servicios";
import Afiliarme from "./pages/afiliarme/Afiliarme";

// 1. IMPORTA LA PÁGINA DE CONTACTO AQUÍ
import Contacto from "./pages/contacto/Contacto";

// --- ESTILOS ---
import "./App.css";

const Inicio = () => {
  return (
    <div className="page-home">
      <HeroCarousel />
      <NewsSection />
      <EventsSection />
    </div>
  );
};

// Componente Placeholder
const PaginaTemporal = ({ titulo }) => (
  <div
    style={{
      marginTop: "120px",
      textAlign: "center",
      fontSize: "2rem",
      color: "#555",
      minHeight: "50vh",
    }}
  >
    <h1>{titulo}</h1>
    <p>Sección en construcción...</p>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      {/* --- FONDO GLOBAL --- */}
      <div className="background-blobs-global">
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

      <div className="background-arc"></div>

      <Navbar />

      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/noticias" element={<NoticiasPage />} />
        <Route path="/nosotros" element={<NosotrosPage />} />
        <Route path="/servicios" element={<Servicios />} />
        <Route path="/afiliarme" element={<Afiliarme />} />

        {/* 2. RUTA CORREGIDA: Ahora carga la página real */}
        <Route path="/contacto" element={<Contacto />} />

        {/* Rutas Temporales */}
        <Route
          path="/directorio"
          element={<PaginaTemporal titulo="Directorio Comercial" />}
        />

        {/* Rutas duplicadas (Legacy) */}
        <Route path="/afiliarme-info" element={<Afiliarme />} />

        {/* Rutas Admin */}
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<Dashboard />} />
        </Route>
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
