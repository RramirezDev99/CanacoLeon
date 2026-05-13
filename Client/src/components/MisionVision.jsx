import React from "react";
import { FaBullseye, FaEye, FaHandshake } from "react-icons/fa";
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
          <p>Próximamente</p>
        </div>

        {/* Visión */}
        <div ref={ref2} className={`mv-card scroll-reveal delay-1 ${vis2 ? 'revealed' : ''}`}>
          <div className="mv-icon-wrapper vision-icon">
            <FaEye />
          </div>
          <h3>Nuestra Visión</h3>
          <p>Próximamente</p>
        </div>

        {/* Valores */}
        <div ref={ref3} className={`mv-card scroll-reveal delay-2 ${vis3 ? 'revealed' : ''}`}>
          <div className="mv-icon-wrapper valores-icon">
            <FaHandshake />
          </div>
          <h3>Nuestros Valores</h3>
          <p>Próximamente</p>
        </div>
      </div>
    </section>
  );
};

export default MisionVision;
