// PROTOTIPO — Variante C «Pedido rápido»: filas compactas tipo app de delivery, miniatura solo si hay foto,
// tabs sticky subrayadas con scrollspy, buscador y carrusel de destacados. Ver research §5, dirección C.
import { Search, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { VariantProps, finalPrice, formatPrice, hasPhoto } from './shared';
import { scrollToSection, useScrollSpy } from './useScrollSpy';
import { Dish } from '@/types/menu';

const Row = ({ dish, onClick }: { dish: Dish; onClick: () => void }) => (
  <button onClick={onClick} className="w-full text-left flex gap-4 py-4 min-h-[72px] border-b border-line items-start">
    <div className="flex-1 min-w-0">
      <h4 className="font-medium text-base text-ink">{dish.name}</h4>
      {dish.description.trim() && dish.description.trim() !== dish.name && (
        <p className="text-sm text-ink/75 line-clamp-2 mt-0.5">{dish.description}</p>
      )}
      <p className="mt-1.5 font-semibold text-ink tabular-nums">{formatPrice(finalPrice(dish))}</p>
    </div>
    {hasPhoto(dish) && <img src={dish.image} alt="" loading="lazy" className="w-[88px] h-[88px] rounded-xl object-cover shrink-0" />}
  </button>
);

const normalize = (s: string) => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();

const VariantC = ({ groups, daily, onDishClick }: VariantProps) => {
  const [query, setQuery] = useState('');
  const q = normalize(query.trim());

  const filtered = useMemo(
    () =>
      q
        ? groups
            .map((g) => ({ ...g, dishes: g.dishes.filter((d) => normalize(`${d.name} ${d.description}`).includes(q)) }))
            .filter((g) => g.dishes.length)
        : groups,
    [groups, q],
  );

  const ids = useMemo(() => filtered.map((g) => `cat-${g.category.slug}`), [filtered]);
  const active = useScrollSpy(ids, 200);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tab = barRef.current?.querySelector<HTMLElement>(`[data-id="${active}"]`);
    tab?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
  }, [active]);

  const featured = groups.flatMap((g) => g.dishes).filter(hasPhoto).slice(0, 5);

  return (
    <section id="menu" className="py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
        <h2 className="font-serif text-4xl text-ink mb-4">La carta</h2>

        {daily && (
          <div
            className="w-full flex items-center justify-between gap-4 rounded-xl bg-ink text-paper px-4 py-3 mb-6 text-left"
          >
            <span>
              <span className="block font-semibold">Menú del día</span>
              <span className="block text-sm text-paper/80">
                {daily.primeros.length} primeros · {daily.segundos.length} segundos · bebida y postre
              </span>
            </span>
            <span className="font-semibold text-lg tabular-nums">{formatPrice(daily.price)}</span>
          </div>
        )}

        {featured.length > 0 && !q && (
          <div className="mb-6">
            <p className="font-semibold text-ink mb-2">Destacados</p>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 snap-x [scrollbar-width:none]">
              {featured.map((d) => (
                <button key={d.id} onClick={() => onDishClick(d)} className="snap-start shrink-0 w-40 text-left">
                  <img src={d.image} alt="" loading="lazy" className="w-40 h-28 rounded-xl object-cover" />
                  <p className="text-sm font-medium text-ink mt-1.5 line-clamp-1">{d.name}</p>
                  <p className="text-sm text-ink/75 tabular-nums">{formatPrice(finalPrice(d))}</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="sticky top-16 sm:top-20 z-40 bg-paper border-b border-line">
        <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
          <label className="flex items-center gap-2 h-11 mt-2 px-3 rounded-lg bg-white border border-line">
            <Search className="w-4 h-4 text-ink/60" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar plato o ingrediente"
              className="flex-1 bg-transparent outline-none text-sm text-ink placeholder:text-ink/60"
            />
            {query && (
              <button onClick={() => setQuery('')} aria-label="Borrar búsqueda">
                <X className="w-4 h-4 text-ink/60" />
              </button>
            )}
          </label>
          <div ref={barRef} className="flex overflow-x-auto [scrollbar-width:none] -mx-4 px-4">
            {filtered.map((g) => {
              const id = `cat-${g.category.slug}`;
              return (
                <button
                  key={id}
                  data-id={id}
                  onClick={() => scrollToSection(id, 200)}
                  className={`shrink-0 h-12 px-3 text-sm whitespace-nowrap border-b-[3px] transition-colors ${
                    active === id ? 'border-terracotta text-ink font-semibold' : 'border-transparent text-ink/70'
                  }`}
                >
                  {g.category.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
        {filtered.length === 0 && <p className="py-10 text-ink/70">No hay platos que coincidan con «{query}».</p>}
        {filtered.map(({ category, dishes }) => (
          <div key={category.id} id={`cat-${category.slug}`} className="pt-6">
            <h3 className="font-semibold text-xl text-ink">{category.name}</h3>
            {dishes.map((d) => (
              <Row key={d.id} dish={d} onClick={() => onDishClick(d)} />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
};

VariantC.label = 'Pedido rápido';
export default VariantC;
