import React from "react";
import { FaBullseye, FaEye, FaHandshake, FaStar } from "react-icons/fa";
import { useScrollReveal } from "../hooks/useScrollReveal";
import "./MisionVision.css";

const MisionVision = () => {
  const [ref1, vis1] = useScrollReveal(0.1);
  const [ref2, vis2] = useScrollReveal(0.1);
  const [ref3, vis3] = useScrollReveal(0.1);

  return (
    <section className="mision-vision-section">
      <div className="mv-container">

        {/* Misión */}
        <div ref={ref1} className={`mv-card scroll-reveal ${vis1 ? 'revealed' : ''}`}>
          <div className="mv-icon-wrapper mision-icon">
            <FaBullseye />
          </div>
          <h3>Nuestra Misión</h3>
          <p>
            Representar, defender y promover los intereses legítimos del comercio,
            los servicios y el turismo de León, Guanajuato, impulsando la competitividad
            y el desarrollo económico de nuestros afiliados a través de servicios de alto
            valor, capacitación continua y vinculación estratégica.
          </p>
        </div>

        {/* Visión */}
        <div ref={ref2} className={`mv-card scroll-reveal delay-1 ${vis2 ? 'revealed' : ''}`}>
          <div className="mv-icon-wrapper vision-icon">
            <FaEye />
          </div>
          <h3>Nuestra Visión</h3>
          <p>
            Ser la cámara empresarial más influyente y reconocida del Bajío, líder en
            la promoción del comercio y los servicios, con una comunidad de afiliados
            comprometida con la innovación, la sustentabilidad y el crecimiento
            económico de la región.
          </p>
        </div>

        {/* Valores */}
        <div ref={ref3} className={`mv-card scroll-reveal delay-2 ${vis3 ? 'revealed' : ''}`}>
          <div className="mv-icon-wrapper valores-icon">
            <FaHandshake />
          </div>
          <h3>Nuestros Valores</h3>
          <p>
            Integridad, compromiso, colaboración, innovación y servicio.
            Trabajamos con transparencia y dedicación para fortalecer el ecosistema
            empresarial de León, creando valor para nuestros afiliados y la comunidad.
          </p>
        </div>
      </div>

      {/* Historia */}
      <div className="historia-section">
        <div className="historia-container">
          <div className="historia-badge">
            <FaStar />
            <span>+100 años de historia</span>
          </div>
          <h2>Nuestra Historia</h2>
          <p>
            Desde su fundación, CANACO SERVyTUR León ha sido pilar fundamental en
            el desarrollo del comercio y los servicios en la ciudad de León. A lo largo
            de más de un siglo, hemos acompañado a miles de empresarios en su crecimiento,
            siendo un puente entre el sector privado, el gobierno y la sociedad.
          </p>
          <p>
            Hoy, somos una de las cámaras de comercio más activas de México, con una
            red de afiliados que incluye desde emprendedores locales hasta grandes
            corporaciones, todos unidos por el compromiso de hacer de León un referente
            nacional en comercio y servicios.
          </p>
        </div>
      </div>
    </section>
  );
};

export default MisionVision;
