import { Dish } from '@/types/menu';
import { formatPrice } from '@/lib/menu';

interface DailyMenuViewProps {
  id: string;
  price: number;
  dishes: Dish[];
  onDishClick: (dish: Dish) => void;
}

const COURSES = [
  { type: 'primero', label: 'Primeros' },
  { type: 'segundo', label: 'Segundos' },
] as const;

const DailyMenuView = ({ id, price, dishes, onDishClick }: DailyMenuViewProps) => (
  <div id={id} className="mb-12 rounded-2xl bg-olive text-paper p-6 sm:p-8">
    <div className="flex items-baseline justify-between gap-4">
      <h3 className="font-serif text-3xl">Menú del día</h3>
      <span className="font-serif text-3xl tabular-nums">{formatPrice(price)}</span>
    </div>
    <p className="text-paper/85 text-sm mb-5">Incluye bebida y postre o café</p>

    <div className="grid sm:grid-cols-2 gap-4">
      {COURSES.map(({ type, label }) => {
        const items = dishes.filter((dish) => dish.daily_menu_type === type);
        return (
          <div key={type} className="bg-paper/10 rounded-xl p-4">
            <p className="uppercase tracking-[0.15em] text-xs font-semibold mb-2">{label}</p>
            {items.length > 0 ? (
              items.map((dish) => (
                <button
                  key={dish.id}
                  onClick={() => onDishClick(dish)}
                  className="block w-full text-left py-1.5 min-h-[44px] font-serif text-lg hover:underline underline-offset-4"
                >
                  {dish.name.trim()}
                </button>
              ))
            ) : (
              <p className="text-sm text-paper/85 py-1.5">Pregunta al camarero</p>
            )}
          </div>
        );
      })}
    </div>
  </div>
);

export default DailyMenuView;
