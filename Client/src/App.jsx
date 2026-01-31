import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// --- COMPONENTES ---
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
import NosotrosPage from "./pages/nosotros/NosotrosPage"; // <--- 1. IMPORT AGREGADO

// --- ESTILOS ---
import "./App.css";

const Inicio = () => {
  return (
    <div className="page-home">
      {/* AQUÍ YA NO VAN LOS BLOBS, SOLO EL CONTENIDO EXCLUSIVO DE INICIO */}
      <HeroCarousel />
      <NewsSection />
      <EventsSection />
    </div>
  );
};

// Componente Placeholder (Para páginas que aún no haces)
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
      {/* --- FONDO GLOBAL (VISIBLE EN TODAS LAS PÁGINAS) --- */}
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

      {/* --- NAVBAR SIEMPRE VISIBLE --- */}
      <Navbar />

      <Routes>
        {/* Rutas Principales */}
        <Route path="/" element={<Inicio />} />
        <Route path="/noticias" element={<NoticiasPage />} />

        {/* <--- 2. RUTA CORREGIDA: AHORA LLEVA A TU PÁGINA REAL */}
        <Route path="/nosotros" element={<NosotrosPage />} />

        {/* Rutas Temporales (Placeholders) */}
        <Route
          path="/servicios"
          element={<PaginaTemporal titulo="Servicios" />}
        />
        <Route
          path="/afiliarme-info"
          element={<PaginaTemporal titulo="Información de Afiliación" />}
        />
        <Route
          path="/contacto"
          element={<PaginaTemporal titulo="Contacto" />}
        />
        <Route
          path="/directorio"
          element={<PaginaTemporal titulo="Directorio Comercial" />}
        />
        <Route
          path="/afiliarme"
          element={<PaginaTemporal titulo="Portal de Afiliados" />}
        />

        {/* Rutas Admin */}
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<Dashboard />} />
        </Route>
      </Routes>

      {/* --- FOOTER SIEMPRE VISIBLE --- */}
      <Footer />
    </BrowserRouter>
  );
}

export default App;
