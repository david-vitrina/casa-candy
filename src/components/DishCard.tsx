import { Dish } from '@/types/menu';

interface DishCardProps {
  dish: Dish;
  onClick: () => void;
  hidePriceInDailyMenu?: boolean;
  isDailyMenuContext?: boolean;
}

const DishCard = ({ dish, onClick, hidePriceInDailyMenu = false, isDailyMenuContext = false }: DishCardProps) => {
  const hasDiscount = dish.discount_percentage > 0;
  const finalPrice = hasDiscount ? dish.price * (1 - dish.discount_percentage / 100) : dish.price;

  return (
    <button
      onClick={onClick}
      className="w-full text-left group flex gap-4 items-start py-4 border-b border-line"
    >
      <div className="relative flex-shrink-0">
        <img
          src={dish.image}
          alt={dish.name}
          className="w-16 h-16 object-cover"
          style={{ borderRadius: '50% 45% 50% 50% / 50% 50% 45% 50%' }}
        />
        {!dish.available && !isDailyMenuContext && (
          <div
            className="absolute inset-0 bg-ink/60 flex items-center justify-center"
            style={{ borderRadius: '50% 45% 50% 50% / 50% 50% 45% 50%' }}
          >
            <span className="text-[8px] text-paper font-semibold uppercase tracking-wide text-center leading-tight px-1">
              No disp.
            </span>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <h3 className="font-serif text-lg text-ink group-hover:text-terracotta transition-colors">
            {dish.name}
          </h3>
          <span className="flex-1 border-b border-dotted border-line -translate-y-1" />
          {!hidePriceInDailyMenu && (
            hasDiscount ? (
              <span className="flex items-baseline gap-1.5 flex-shrink-0">
                <span className="text-xs text-ink/40 line-through">€{dish.price.toFixed(2)}</span>
                <span className="text-terracotta font-medium tabular-nums">€{finalPrice.toFixed(2)}</span>
              </span>
            ) : (
              <span className="text-terracotta font-medium tabular-nums flex-shrink-0">
                €{dish.price.toFixed(2)}
              </span>
            )
          )}
        </div>
        <p className="text-sm text-ink/60 mt-1 line-clamp-2">{dish.description}</p>
      </div>
    </button>
  );
};

export default DishCard;
