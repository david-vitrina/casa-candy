import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Dish } from '@/types/menu';

interface DishModalProps {
  dish: Dish | null;
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORY_LABEL: Record<Dish['category'], string> = {
  appetizer: 'Entrante',
  main: 'Plato Principal',
  dessert: 'Postre',
};

const DishModal = ({ dish, isOpen, onClose }: DishModalProps) => {
  if (!dish) return null;

  const hasDiscount = dish.discount_percentage > 0;
  const finalPrice = hasDiscount ? dish.price * (1 - dish.discount_percentage / 100) : dish.price;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-2xl bg-paper border-line p-0 sm:p-0">
        <div className="relative overflow-hidden rounded-t-lg h-48 sm:h-64">
          <img
            src={dish.image}
            alt={dish.name}
            className="w-full h-full object-cover"
          />
          {!dish.available && (
            <div className="absolute inset-0 bg-ink/60 flex items-center justify-center">
              <span className="text-paper text-sm font-semibold uppercase tracking-wide px-4 py-2 border border-paper">
                No Disponible Hoy
              </span>
            </div>
          )}
        </div>

        <div className="p-6 sm:p-8 space-y-4">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl sm:text-3xl text-ink text-left">
              {dish.name}
            </DialogTitle>
          </DialogHeader>

          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex gap-2 items-center flex-wrap">
              <span className="uppercase tracking-[0.15em] text-xs font-semibold text-olive">
                {CATEGORY_LABEL[dish.category]}
              </span>
              {dish.daily_menu_type && (
                <span className="uppercase tracking-[0.1em] text-xs font-semibold text-terracotta border border-terracotta/40 px-2 py-0.5">
                  {dish.daily_menu_type === 'primero' ? 'Primero · Menú del día' : 'Segundo · Menú del día'}
                </span>
              )}
            </div>
            {hasDiscount ? (
              <span className="flex items-baseline gap-2">
                <span className="text-sm text-ink/40 line-through">€{dish.price.toFixed(2)}</span>
                <span className="text-xl sm:text-2xl font-serif text-terracotta">€{finalPrice.toFixed(2)}</span>
              </span>
            ) : (
              <span className="text-xl sm:text-2xl font-serif text-terracotta">€{dish.price.toFixed(2)}</span>
            )}
          </div>

          <p className="text-ink/70 leading-relaxed">{dish.full_description}</p>

          <div>
            <h4 className="uppercase tracking-[0.15em] text-xs font-semibold text-olive mb-3">Ingredientes</h4>
            {Array.isArray(dish.ingredients) && dish.ingredients.length > 0 ? (
              <ul className="space-y-1.5">
                {dish.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-start text-sm text-ink/70">
                    <span className="mr-3 mt-1.5 h-1.5 w-1.5 rounded-full bg-terracotta flex-shrink-0" />
                    <span>{ingredient}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-ink/50">No hay ingredientes disponibles</p>
            )}
          </div>

          <div className="pt-4 border-t border-line flex items-center justify-between">
            <span className="text-sm text-ink/50">Estado de disponibilidad</span>
            <span className={`text-xs uppercase tracking-wide font-semibold ${dish.available ? 'text-olive' : 'text-terracotta'}`}>
              {dish.available ? 'Disponible' : 'No disponible'}
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DishModal;
