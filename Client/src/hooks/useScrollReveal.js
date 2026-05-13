import { useEffect, useRef, useState } from "react";

/**
 * Hook que detecta cuando un elemento entra al viewport y activa una clase CSS.
 * Uso: const [ref, isVisible] = useScrollReveal();
 *      <div ref={ref} className={`mi-clase ${isVisible ? 'revealed' : ''}`}>
 */
export function useScrollReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target); // Solo anima una vez
        }
      },
      { threshold }
    );

    const current = ref.current;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, [threshold]);

  return [ref, isVisible];
}
