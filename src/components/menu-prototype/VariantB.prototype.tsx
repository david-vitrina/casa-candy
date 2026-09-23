// PROTOTIPO — Variante B «Mercado en tarjetas»: cards blancas (con/sin foto), chips sticky con scrollspy,
// panel «Todas» con contadores y menú del día como card destacada. Ver research §5, dirección B.
import { ChevronDown, Sun } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { VariantProps, finalPrice, formatPrice, hasPhoto } from './shared';
import { scrollToSection, useScrollSpy } from './useScrollSpy';
import { Dish } from '@/types/menu';

const PRICE = 'text-[hsl(14_62%_38%)]';

const Card = ({ dish, category, onClick }: { dish: Dish; category: string; onClick: () => void }) => (
  <button
    onClick={onClick}
    className="text-left bg-white rounded-2xl border border-line overflow-hidden shadow-[0_1px_2px_hsl(28_26%_11%/0.06)] hover:shadow-md transition-shadow flex flex-col"
  >
    {hasPhoto(dish) && <img src={dish.image} alt="" loading="lazy" className="w-full aspect-[5/3] object-cover" />}
    <div className="p-4 flex flex-col gap-2 flex-1">
      <div className="flex items-start gap-3">
        {!hasPhoto(dish) && (
          <span aria-hidden className="shrink-0 w-10 h-10 rounded-full bg-paper border border-line grid place-items-center font-serif text-lg text-terracotta">
            {category.charAt(0)}
          </span>
        )}
        <h4 className="font-serif text-xl leading-tight text-ink">{dish.name}</h4>
      </div>
      {dish.description.trim() && dish.description.trim() !== dish.name && (
        <p className="text-sm text-ink/75 line-clamp-2">{dish.description}</p>
      )}
      <div className="mt-auto pt-1 flex justify-end">
        <span className={`${PRICE} font-semibold text-lg tabular-nums`}>{formatPrice(finalPrice(dish))}</span>
      </div>
    </div>
  </button>
);

const VariantB = ({ groups, daily, onDishClick }: VariantProps) => {
  const ids = useMemo(
    () => [...(daily ? ['cat-menu-del-dia'] : []), ...groups.map((g) => `cat-${g.category.slug}`)],
    [groups, daily],
  );
  const active = useScrollSpy(ids, 180);
  const [sheet, setSheet] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  // El chip activo se desplaza solo dentro de la barra.
  useEffect(() => {
    const chip = barRef.current?.querySelector<HTMLElement>(`[data-id="${active}"]`);
    chip?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
  }, [active]);

  const go = (id: string) => {
    setSheet(false);
    scrollToSection(id, 150);
  };

  const chip = (id: string, label: React.ReactNode) => (
    <button
      key={id}
      data-id={id}
      onClick={() => go(id)}
      className={`shrink-0 h-10 px-4 rounded-full text-sm whitespace-nowrap border transition-colors flex items-center gap-1.5 ${
        active === id ? 'bg-ink text-paper border-ink' : 'bg-white text-ink border-line'
      }`}
    >
      {label}
    </button>
  );

  return (
    <section id="menu" className="py-20 sm:py-28">
      <div className="container mx-auto px-4 sm:px-6">
        <p className="uppercase tracking-[0.2em] text-xs font-medium text-olive mb-3">Nuestra propuesta</p>
        <h2 className="font-serif text-4xl sm:text-5xl text-ink mb-6">La carta</h2>
      </div>

      <div className="sticky top-16 sm:top-20 z-40 bg-paper/95 backdrop-blur-sm border-b border-line">
        <div ref={barRef} className="container mx-auto px-4 sm:px-6 flex gap-2 overflow-x-auto py-2 [scrollbar-width:none]">
          {daily && chip('cat-menu-del-dia', <><Sun className="w-4 h-4" /> Menú del día</>)}
          {groups.map((g) => chip(`cat-${g.category.slug}`, g.category.name))}
          <button onClick={() => setSheet(true)} className="shrink-0 h-10 px-4 rounded-full text-sm border border-ink/40 bg-paper flex items-center gap-1">
            Todas <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 pt-8">
        {daily && (
          <div id="cat-menu-del-dia" className="mb-12 rounded-2xl bg-olive text-paper p-6 sm:p-8">
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="font-serif text-3xl">Menú del día</h3>
              <span className="font-serif text-3xl tabular-nums">{formatPrice(daily.price)}</span>
            </div>
            <p className="text-paper/85 text-sm mb-5">Incluye bebida y postre o café</p>
            <div className="grid sm:grid-cols-2 gap-4">
              {(['primeros', 'segundos'] as const).map((k) => (
                <div key={k} className="bg-paper/10 rounded-xl p-4">
                  <p className="uppercase tracking-[0.15em] text-xs font-semibold mb-2">{k === 'primeros' ? 'Primeros' : 'Segundos'}</p>
                  {daily[k].length ? (
                    daily[k].map((d) => (
                      <button key={d.id} onClick={() => onDishClick(d)} className="block text-left py-1.5 min-h-[44px] font-serif text-lg">
                        {d.name}
                      </button>
                    ))
                  ) : (
                    <p className="text-sm text-paper/85 py-1.5">Pregunta al camarero</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {groups.map(({ category, dishes }) => (
          <div key={category.id} id={`cat-${category.slug}`} className="mb-12">
            <h3 className="font-serif text-3xl text-ink mb-1">{category.name}</h3>
            <p className="text-sm text-ink/70 mb-4">{dishes.length} {dishes.length === 1 ? 'plato' : 'platos'}</p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {dishes.map((d) => (
                <Card key={d.id} dish={d} category={category.name} onClick={() => onDishClick(d)} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {sheet && (
        <div className="fixed inset-0 z-[110] bg-ink/40 flex items-end justify-center" onClick={() => setSheet(false)}>
          <div className="bg-paper w-full sm:max-w-lg rounded-t-2xl p-5 max-h-[80vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <div className="w-10 h-1 bg-ink/20 rounded-full mx-auto mb-4" />
            <p className="font-serif text-2xl text-ink mb-2">Categorías</p>
            {daily && (
              <button onClick={() => go('cat-menu-del-dia')} className="w-full flex justify-between py-3 min-h-[48px] border-b border-line text-olive font-medium">
                <span>Menú del día</span>
                <span className="tabular-nums">{formatPrice(daily.price)}</span>
              </button>
            )}
            {groups.map((g) => (
              <button key={g.category.id} onClick={() => go(`cat-${g.category.slug}`)} className="w-full flex justify-between py-3 min-h-[48px] border-b border-line text-ink">
                <span>{g.category.name}</span>
                <span className="text-ink/60 tabular-nums">{g.dishes.length}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

VariantB.label = 'Mercado en tarjetas';
export default VariantB;
