import { Dish } from '@/types/menu';
import DishCard from './DishCard';
import { useDailyMenuSettings } from '@/hooks/useDailyMenuSettings';

interface DailyMenuViewProps {
  dishes: Dish[];
  onDishClick: (dish: Dish) => void;
}

const DailyMenuView = ({ dishes, onDishClick }: DailyMenuViewProps) => {
  const { settings, loading } = useDailyMenuSettings();

  const primeros = dishes.filter((dish) => dish.daily_menu_type === 'primero');
  const segundos = dishes.filter((dish) => dish.daily_menu_type === 'segundo');

  if (loading) {
    return <p className="text-ink/50 py-8">Cargando menú del día…</p>;
  }

  if (!settings?.is_active) {
    return <p className="text-ink/50 py-8">El menú del día no está disponible en este momento.</p>;
  }

  return (
    <div>
      <p className="font-serif text-2xl sm:text-3xl text-terracotta mb-1">
        €{settings?.price.toFixed(2)}
      </p>
      <p className="text-sm text-ink/50 mb-10">Incluye bebida y postre o café</p>

      <div className="grid sm:grid-cols-2 gap-x-12">
        <div className="mb-10 sm:mb-0">
          <p className="uppercase tracking-[0.2em] text-xs font-semibold text-olive mb-1">Primeros</p>
          {primeros.length > 0 ? (
            primeros.map((dish) => (
              <DishCard
                key={dish.id}
                dish={dish}
                onClick={() => onDishClick(dish)}
                hidePriceInDailyMenu
                isDailyMenuContext
              />
            ))
          ) : (
            <p className="text-sm text-ink/50 py-4">No hay primeros disponibles hoy</p>
          )}
        </div>

        <div>
          <p className="uppercase tracking-[0.2em] text-xs font-semibold text-olive mb-1">Segundos</p>
          {segundos.length > 0 ? (
            segundos.map((dish) => (
              <DishCard
                key={dish.id}
                dish={dish}
                onClick={() => onDishClick(dish)}
                hidePriceInDailyMenu
                isDailyMenuContext
              />
            ))
          ) : (
            <p className="text-sm text-ink/50 py-4">No hay segundos disponibles hoy</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DailyMenuView;
