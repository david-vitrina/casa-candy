// PROTOTIPO — devuelve el id de la sección visible, para resaltar su chip/tab.
import { useEffect, useState } from 'react';

export const useScrollSpy = (ids: string[], offsetPx = 160) => {
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

// Desplaza a una sección dejando hueco para la cabecera fija y la barra sticky.
export const scrollToSection = (id: string, offsetPx = 150) => {
  const el = document.getElementById(id);
  if (!el) return;
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - offsetPx, behavior: 'smooth' });
};
