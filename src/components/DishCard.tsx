import { Dish } from '@/types/menu';
import { finalPrice, formatPrice, hasPhoto } from '@/lib/menu';

interface DishCardProps {
  dish: Dish;
  categoryName: string;
  onClick: () => void;
}

const DishCard = ({ dish, categoryName, onClick }: DishCardProps) => {
  const photo = hasPhoto(dish);
  const hasDiscount = !!dish.discount_percentage && dish.discount_percentage > 0;
  const description = dish.description.trim();

  return (
    <button
      onClick={onClick}
      className="text-left bg-white rounded-2xl border border-line overflow-hidden shadow-[0_1px_2px_hsl(var(--ink)/0.06)] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-deep transition-shadow flex flex-col"
    >
      {photo && <img src={dish.image} alt="" loading="lazy" className="w-full aspect-[5/3] object-cover" />}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-start gap-3">
          {!photo && (
            <span
              aria-hidden
              className="shrink-0 w-10 h-10 rounded-full bg-paper border border-line grid place-items-center font-serif text-lg text-terracotta"
            >
              {categoryName.charAt(0)}
            </span>
          )}
          <h4 className="font-serif text-xl leading-tight text-ink">{dish.name}</h4>
        </div>
        {description && description !== dish.name && (
          <p className="text-sm text-ink/75 line-clamp-2">{description}</p>
        )}
        <div className="mt-auto pt-1 flex justify-end items-baseline gap-2">
          {hasDiscount && (
            <span className="text-sm text-ink/70 line-through tabular-nums">{formatPrice(dish.price)}</span>
          )}
          <span className="text-terracotta-deep font-semibold text-lg tabular-nums">{formatPrice(finalPrice(dish))}</span>
        </div>
      </div>
    </button>
  );
};

export default DishCard;
