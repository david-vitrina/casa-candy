import { useEffect, useState } from 'react';

// Devuelve el id de la última sección cuyo borde superior ya pasó por debajo de offsetPx.
export const useScrollSpy = (ids: string[], offsetPx: number) => {
  const [active, setActive] = useState<string | null>(ids[0] ?? null);

  useEffect(() => {
    const onScroll = () => {
      let current: string | null = ids[0] ?? null;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top - offsetPx <= 0) current = id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [ids, offsetPx]);

  return active;
};

// Desplaza a una sección dejando hueco para la cabecera fija y la barra de categorías.
export const scrollToSection = (id: string, offsetPx: number) => {
  const el = document.getElementById(id);
  if (!el) return;
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - offsetPx, behavior: 'smooth' });
};
