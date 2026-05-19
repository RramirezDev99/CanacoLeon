import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// --- COMPONENTES GLOBALES ---
import Navbar from "./components/Navbar";
import HeroCarousel from "./components/HeroCarousel";
// import StatsCounter from "./components/StatsCounter";
import NewsSection from "./components/NewsSection";
import EventsSection from "./components/EventsSection";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoute";

// --- PÁGINAS ---
import Login from "./pages/admin/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import NoticiasPage from "./pages/noticias/NoticiasPage";
import NoticiaDetalle from "./pages/noticias/NoticiaDetalle";
import EventoDetalle from "./pages/eventos/EventoDetalle";
import NosotrosPage from "./pages/nosotros/NosotrosPage";
import Servicios from "./pages/servicios/servicios";
import Afiliarme from "./pages/afiliarme/Afiliarme";
import Contacto from "./pages/contacto/Contacto";
import DirectorioComercial from "./pages/directorio-comercial/directorio-comercial";
import NotFound from "./pages/NotFound";

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

      <ScrollToTop />
      <Navbar />

      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/noticias" element={<NoticiasPage />} />
        <Route path="/noticias/:id" element={<NoticiaDetalle />} />
        <Route path="/eventos/:id" element={<EventoDetalle />} />
        <Route path="/nosotros" element={<NosotrosPage />} />
        <Route path="/servicios" element={<Servicios />} />
        <Route path="/afiliarme" element={<Afiliarme />} />

        {/* 2. RUTA CORREGIDA: Ahora carga la página real */}
        <Route path="/contacto" element={<Contacto />} />

        <Route path="/directorio" element={<DirectorioComercial />} />

        {/* Rutas Admin */}
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<Dashboard />} />
        </Route>

        {/* 404 - Ruta catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
