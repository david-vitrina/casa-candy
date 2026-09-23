// PROTOTIPO — barra flotante para cambiar de variante con ?variant=. No va a producción.
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

interface PrototypeSwitcherProps {
  variants: { key: string; name: string }[];
  current: string;
}

const PrototypeSwitcher = ({ variants, current }: PrototypeSwitcherProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const index = Math.max(0, variants.findIndex((v) => v.key === current));

  const go = (delta: number) => {
    const next = variants[(index + delta + variants.length) % variants.length];
    const params = new URLSearchParams(searchParams);
    params.set('variant', next.key);
    setSearchParams(params, { replace: true, preventScrollReset: true });
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = document.activeElement as HTMLElement | null;
      if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable)) return;
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === 'ArrowRight') go(1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  if (!import.meta.env.DEV) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-1 rounded-full bg-black text-white shadow-2xl px-2 py-1.5 font-mono text-xs">
      <button onClick={() => go(-1)} className="px-3 py-1.5 rounded-full hover:bg-white/15" aria-label="Variante anterior">←</button>
      <span className="px-2 whitespace-nowrap">
        {variants[index].key} — {variants[index].name}
      </span>
      <button onClick={() => go(1)} className="px-3 py-1.5 rounded-full hover:bg-white/15" aria-label="Variante siguiente">→</button>
    </div>
  );
};

export default PrototypeSwitcher;
