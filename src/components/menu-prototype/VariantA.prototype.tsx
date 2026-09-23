// PROTOTIPO — Variante A «Pizarra editorial»: carta tipográfica, índice de anclas, fotos solo en el modal.
// Ver docs/research/2026-09-23-cartas-digitales-cards.md §5, dirección A.
import { Camera, List } from 'lucide-react';
import { useState } from 'react';
import { VariantProps, finalPrice, formatPrice, hasPhoto } from './shared';
import { scrollToSection } from './useScrollSpy';
import { Dish } from '@/types/menu';

const PRICE = 'text-[hsl(14_62%_38%)]'; // terracota oscurecida: 4,5:1 sobre papel

const Row = ({ dish, onClick, hidePrice = false }: { dish: Dish; onClick: () => void; hidePrice?: boolean }) => (
  <button onClick={onClick} className="w-full text-left py-3 min-h-[44px] group">
    <div className="flex items-baseline gap-2">
      <h4 className="font-serif text-lg leading-snug text-ink group-hover:underline decoration-1 underline-offset-4">
        {dish.name}
        {hasPhoto(dish) && <Camera className="inline w-3.5 h-3.5 ml-1.5 -mt-1 text-olive" aria-label="Con foto" />}
      </h4>
      <span className="flex-1 border-b border-dotted border-ink/30 -translate-y-1 min-w-4" />
      {!hidePrice && <span className={`${PRICE} font-medium tabular-nums whitespace-nowrap`}>{formatPrice(finalPrice(dish))}</span>}
    </div>
    {dish.description.trim() && dish.description.trim() !== dish.name && (
      <p className="text-sm text-ink/75 mt-0.5 line-clamp-2 pr-12">{dish.description}</p>
    )}
  </button>
);

const VariantA = ({ groups, daily, onDishClick }: VariantProps) => {
  const [showIndex, setShowIndex] = useState(false);
  const go = (id: string) => {
    setShowIndex(false);
    scrollToSection(id, 100);
  };

  const index = (
    <nav aria-label="Índice de la carta" className="grid grid-cols-2 gap-x-6 sm:grid-cols-3">
      {daily && (
        <button onClick={() => go('cat-menu-del-dia')} className="text-left py-2.5 min-h-[44px] border-b border-line flex justify-between gap-2">
          <span className="text-olive font-medium">Menú del día</span>
          <span className="text-ink/60 tabular-nums">{formatPrice(daily.price)}</span>
        </button>
      )}
      {groups.map(({ category, dishes }) => (
        <button key={category.id} onClick={() => go(`cat-${category.slug}`)} className="text-left py-2.5 min-h-[44px] border-b border-line flex justify-between gap-2">
          <span className="text-ink">{category.name}</span>
          <span className="text-ink/60 tabular-nums">{dishes.length}</span>
        </button>
      ))}
    </nav>
  );

  return (
    <section id="menu" className="py-20 sm:py-28">
      <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
        <p className="uppercase tracking-[0.2em] text-xs font-medium text-olive mb-3">Nuestra propuesta</p>
        <h2 className="font-serif text-5xl sm:text-6xl text-ink mb-8">La carta</h2>

        <p className="uppercase tracking-[0.2em] text-xs font-semibold text-ink/70 mb-2">En esta carta</p>
        <div className="mb-16">{index}</div>

        {daily && (
          <div id="cat-menu-del-dia" className="mb-16 border-2 border-ink px-5 py-6 sm:px-8">
            <div className="flex items-baseline justify-between gap-4 mb-4">
              <h3 className="font-serif text-3xl text-ink">Menú del día</h3>
              <span className={`${PRICE} font-serif text-2xl tabular-nums`}>{formatPrice(daily.price)}</span>
            </div>
            <p className="text-sm text-ink/75 mb-4">Incluye bebida y postre o café</p>
            {(['primeros', 'segundos'] as const).map((k) => (
              <div key={k} className="mb-4 last:mb-0">
                <p className="uppercase tracking-[0.2em] text-xs font-semibold text-olive">{k === 'primeros' ? 'Primeros' : 'Segundos'}</p>
                {daily[k].length ? (
                  daily[k].map((d) => <Row key={d.id} dish={d} onClick={() => onDishClick(d)} hidePrice />)
                ) : (
                  <p className="text-sm text-ink/60 py-2">Pregunta al camarero</p>
                )}
              </div>
            ))}
          </div>
        )}

        {groups.map(({ category, dishes }) => (
          <div key={category.id} id={`cat-${category.slug}`} className="mb-14 scroll-mt-24">
            <div className="flex items-center gap-4 mb-2">
              <h3 className="font-serif text-3xl text-ink whitespace-nowrap">{category.name}</h3>
              <span className="flex-1 border-t border-ink/40" />
            </div>
            <div className="divide-y divide-line">
              {dishes.map((d) => (
                <Row key={d.id} dish={d} onClick={() => onDishClick(d)} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => setShowIndex(true)}
        className="fixed right-4 bottom-20 z-50 flex items-center gap-2 bg-ink text-paper rounded-full px-4 h-12 shadow-lg"
      >
        <List className="w-4 h-4" /> Índice
      </button>

      {showIndex && (
        <div className="fixed inset-0 z-[110] bg-ink/40 flex items-end sm:items-center justify-center" onClick={() => setShowIndex(false)}>
          <div className="bg-paper w-full sm:max-w-xl rounded-t-2xl sm:rounded-2xl p-5 max-h-[80vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <p className="font-serif text-2xl text-ink mb-3">Índice</p>
            {index}
          </div>
        </div>
      )}
    </section>
  );
};

VariantA.label = 'Pizarra editorial';
export default VariantA;
