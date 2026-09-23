import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Sun } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { formatPrice } from '@/lib/menu';

export interface CategoryNavItem {
  id: string;
  label: string;
  count?: number;
  price?: number;
  highlight?: boolean;
}

interface CategoryNavProps {
  items: CategoryNavItem[];
  activeId: string | null;
  onSelect: (id: string) => void;
}

const CategoryNav = ({ items, activeId, onSelect }: CategoryNavProps) => {
  const [open, setOpen] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  // El chip activo se desplaza solo dentro de la barra.
  useEffect(() => {
    const chip = barRef.current?.querySelector<HTMLElement>(`[data-id="${activeId}"]`);
    chip?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
  }, [activeId]);

  const select = (id: string) => {
    setOpen(false);
    onSelect(id);
  };

  return (
    <div className="sticky top-16 sm:top-20 z-40 bg-paper/95 backdrop-blur-sm border-b border-line">
      <nav
        ref={barRef}
        aria-label="Categorías de la carta"
        className="container mx-auto px-4 sm:px-6 flex gap-2 overflow-x-auto py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item) => {
          const active = activeId === item.id;
          return (
            <button
              key={item.id}
              data-id={item.id}
              onClick={() => onSelect(item.id)}
              aria-current={active ? 'true' : undefined}
              className={`shrink-0 h-11 px-4 rounded-full text-sm whitespace-nowrap border transition-colors flex items-center gap-1.5 ${
                active ? 'bg-ink text-paper border-ink' : 'bg-white text-ink border-line'
              }`}
            >
              {item.highlight && <Sun className="w-4 h-4" aria-hidden />}
              {item.label}
            </button>
          );
        })}
        <button
          onClick={() => setOpen(true)}
          className="shrink-0 h-11 px-4 rounded-full text-sm border border-ink/40 bg-paper flex items-center gap-1"
        >
          Todas <ChevronDown className="w-4 h-4" aria-hidden />
        </button>
      </nav>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="bottom" className="bg-paper border-line rounded-t-2xl max-h-[80vh] overflow-auto">
          <SheetHeader>
            <SheetTitle className="font-serif text-2xl text-ink text-left">Categorías</SheetTitle>
          </SheetHeader>
          <div className="mt-2">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => select(item.id)}
                className={`w-full flex justify-between py-3 min-h-[48px] border-b border-line ${
                  item.highlight ? 'text-olive font-medium' : 'text-ink'
                }`}
              >
                <span>{item.label}</span>
                <span className="text-ink/70 tabular-nums">
                  {item.price !== undefined ? formatPrice(item.price) : item.count}
                </span>
              </button>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default CategoryNav;
