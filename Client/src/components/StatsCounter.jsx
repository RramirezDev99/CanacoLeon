import React, { useState, useEffect, useRef } from "react";
import { FaUsers, FaBuilding, FaHandshake, FaAward } from "react-icons/fa";
import "./StatsCounter.css";

const stats = [
  { icon: <FaAward />, end: 100, suffix: "+", label: "Años de historia", prefix: "" },
  { icon: <FaUsers />, end: 2000, suffix: "+", label: "Afiliados activos", prefix: "" },
  { icon: <FaBuilding />, end: 500, suffix: "+", label: "Empresas registradas", prefix: "" },
  { icon: <FaHandshake />, end: 50, suffix: "+", label: "Alianzas estratégicas", prefix: "" },
];

const useCountUp = (end, duration = 2000, start = false) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;
    let startTime = null;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, start]);

  return count;
};

const StatItem = ({ icon, end, suffix, label, prefix, isVisible, delay }) => {
  const [shouldStart, setShouldStart] = useState(false);
  const count = useCountUp(end, 2000, shouldStart);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => setShouldStart(true), delay);
      return () => clearTimeout(timer);
    }
  }, [isVisible, delay]);

  return (
    <div className="stat-item">
      <div className="stat-icon">{icon}</div>
      <div className="stat-number">
        {prefix}{count.toLocaleString("es-MX")}{suffix}
      </div>
      <div className="stat-label">{label}</div>
    </div>
  );
};

const StatsCounter = () => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="stats-section">
      <div className="stats-container">
        {stats.map((stat, i) => (
          <StatItem key={i} {...stat} isVisible={isVisible} delay={i * 150} />
        ))}
      </div>
    </section>
  );
};

export default StatsCounter;
