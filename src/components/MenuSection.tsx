import { useState, useEffect } from 'react';
import DishCard from './DishCard';
import DishModal from './DishModal';
import DailyMenuView from './DailyMenuView';
import { Dish } from '@/types/menu';
import { useMenuItems } from '@/hooks/useMenuItems';
import { supabase } from '@/integrations/supabase/client';
import { useSearchParams } from 'react-router-dom';
import MenuPrototype from './menu-prototype/MenuPrototype';

type Filter = 'all' | 'appetizer' | 'main' | 'dessert' | 'daily';

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'Toda la carta' },
  { key: 'daily', label: 'Menú del día' },
  { key: 'appetizer', label: 'Entrantes' },
  { key: 'main', label: 'Principales' },
  { key: 'dessert', label: 'Postres' },
];

const CATEGORY_GROUP_LABEL: Record<'appetizer' | 'main' | 'dessert', string> = {
  appetizer: 'Entrantes',
  main: 'Principales',
  dessert: 'Postres',
};

// PROTOTIPO: en desarrollo, ?variant=A|B|C muestra las variantes de carta con cards.
const MenuSection = () => {
  const [searchParams] = useSearchParams();
  const variant = searchParams.get('variant');
  if (import.meta.env.DEV && variant) return <MenuPrototype variant={variant} />;
  return <MenuSectionActual />;
};

const MenuSectionActual = () => {
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [filter, setFilter] = useState<Filter>('all');
  const { dishes, loading } = useMenuItems();
  const [dailyMenuDishes, setDailyMenuDishes] = useState<Dish[]>([]);
  const [loadingDaily, setLoadingDaily] = useState(false);

  useEffect(() => {
    if (filter === 'daily') {
      fetchDailyMenuDishes();

      const channel = supabase
        .channel('daily-menu-changes')
        .on('postgres_changes',
          { event: '*', schema: 'public', table: 'dishes' },
          () => {
            fetchDailyMenuDishes();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [filter]);

  const fetchDailyMenuDishes = async () => {
    setLoadingDaily(true);
    try {
      const { data, error } = await supabase
        .from('dishes')
        .select('*')
        .not('daily_menu_type', 'is', null)
        .order('name');

      if (error) throw error;
      if (data) {
        setDailyMenuDishes(data as Dish[]);
      }
    } catch (error) {
      console.error('Error fetching daily menu dishes:', error);
    } finally {
      setLoadingDaily(false);
    }
  };

  if (loading || (filter === 'daily' && loadingDaily)) {
    return (
      <section id="menu" className="py-20 sm:py-28">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <p className="text-ink/50">Cargando carta…</p>
        </div>
      </section>
    );
  }

  return (
    <section id="menu" className="py-20 sm:py-28">
      <div className="container mx-auto px-4 sm:px-6">
        <p className="uppercase tracking-[0.2em] text-xs font-medium text-olive mb-3">Nuestra propuesta</p>
        <h2 className="font-serif text-4xl sm:text-5xl text-ink mb-10 sm:mb-12 text-balance">La carta</h2>

        <div className="flex flex-wrap gap-x-6 gap-y-2 sm:gap-x-8 mb-12 text-xs sm:text-sm uppercase tracking-[0.05em]">
          {FILTERS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className="pb-1 transition-opacity"
              style={{
                borderBottom: filter === key ? '2px solid hsl(var(--terracotta))' : '2px solid transparent',
                opacity: filter === key ? 1 : 0.55,
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {filter === 'daily' ? (
          <DailyMenuView
            dishes={dailyMenuDishes}
            onDishClick={(dish) => setSelectedDish(dish)}
          />
        ) : filter === 'all' ? (
          (['appetizer', 'main', 'dessert'] as const).map((cat) => {
            const items = dishes.filter((d) => d.category === cat);
            if (!items.length) return null;
            return (
              <div key={cat} className="mb-10">
                <p className="uppercase tracking-[0.2em] text-xs font-semibold text-olive mb-1">
                  {CATEGORY_GROUP_LABEL[cat]}
                </p>
                {items.map((dish) => (
                  <DishCard key={dish.id} dish={dish} onClick={() => setSelectedDish(dish)} />
                ))}
              </div>
            );
          })
        ) : (
          <div>
            {dishes
              .filter((d) => d.category === filter)
              .map((dish) => (
                <DishCard key={dish.id} dish={dish} onClick={() => setSelectedDish(dish)} />
              ))}
          </div>
        )}

        <DishModal
          dish={selectedDish}
          isOpen={!!selectedDish}
          onClose={() => setSelectedDish(null)}
        />
      </div>
    </section>
  );
};

export default MenuSection;
