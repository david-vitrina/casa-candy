import { useEffect, useMemo, useState } from 'react';
import DishCard from './DishCard';
import DishModal from './DishModal';
import DailyMenuView from './DailyMenuView';
import CategoryNav, { CategoryNavItem } from './CategoryNav';
import { Category, Dish } from '@/types/menu';
import { useMenuItems } from '@/hooks/useMenuItems';
import { useCategories } from '@/hooks/useCategories';
import { useDailyMenuSettings } from '@/hooks/useDailyMenuSettings';
import { scrollToSection, useScrollSpy } from '@/hooks/useScrollSpy';
import { supabase } from '@/integrations/supabase/client';

const DAILY_ID = 'cat-menu-del-dia';
// Cabecera fija (64/80 px) + barra de categorías (~60 px).
const SPY_OFFSET = 180;
const SCROLL_OFFSET = 150;

// Platos sin category_id (p. ej. creados con el panel antiguo): se muestran al final, nunca se ocultan.
const UNCATEGORIZED: Category = { id: 'sin-categoria', slug: 'mas-platos', name: 'Más platos', position: Infinity, visible: true };

const MenuSection = () => {
  const { dishes, loading } = useMenuItems();
  const { categories, loading: loadingCategories } = useCategories();
  const { settings } = useDailyMenuSettings();
  const [dailyDishes, setDailyDishes] = useState<Dish[]>([]);
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);

  useEffect(() => {
    const fetchDailyMenuDishes = async () => {
      const { data, error } = await supabase
        .from('dishes')
        .select('*')
        .not('daily_menu_type', 'is', null)
        .order('name');

      if (error) {
        console.error('Error fetching daily menu dishes:', error);
        return;
      }
      setDailyDishes(data as Dish[]);
    };

    fetchDailyMenuDishes();
  }, []);

  const groups = useMemo(() => {
    const known = new Set(categories.map((c) => c.id));
    return [...categories, UNCATEGORIZED]
      .map((category) => ({
        category,
        dishes: dishes
          .filter((d) =>
            category === UNCATEGORIZED ? !d.category_id || !known.has(d.category_id) : d.category_id === category.id,
          )
          .map((d) => ({ ...d, name: d.name.trim() })),
      }))
      .filter((g) => g.dishes.length > 0);
  }, [categories, dishes]);

  const showDaily = !!settings?.is_active;

  const navItems: CategoryNavItem[] = useMemo(
    () => [
      ...(showDaily && settings ? [{ id: DAILY_ID, label: 'Menú del día', price: settings.price, highlight: true }] : []),
      ...groups.map((g) => ({ id: `cat-${g.category.slug}`, label: g.category.name, count: g.dishes.length })),
    ],
    [groups, showDaily, settings],
  );

  const sectionIds = useMemo(() => navItems.map((item) => item.id), [navItems]);
  const activeId = useScrollSpy(sectionIds, SPY_OFFSET);

  const categoryName = (dish: Dish) =>
    categories.find((c) => c.id === dish.category_id)?.name ?? UNCATEGORIZED.name;

  if (loading || loadingCategories) {
    return (
      <section id="menu" className="py-20 sm:py-28">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <p className="text-ink/70">Cargando carta…</p>
        </div>
      </section>
    );
  }

  return (
    <section id="menu" className="py-20 sm:py-28">
      <div className="container mx-auto px-4 sm:px-6">
        <p className="uppercase tracking-[0.2em] text-xs font-medium text-olive mb-3">Nuestra propuesta</p>
        <h2 className="font-serif text-4xl sm:text-5xl text-ink mb-6 text-balance">La carta</h2>
      </div>

      <CategoryNav items={navItems} activeId={activeId} onSelect={(id) => scrollToSection(id, SCROLL_OFFSET)} />

      <div className="container mx-auto px-4 sm:px-6 pt-8">
        {showDaily && settings && (
          <DailyMenuView id={DAILY_ID} price={settings.price} dishes={dailyDishes} onDishClick={setSelectedDish} />
        )}

        {groups.map(({ category, dishes: items }) => (
          <div key={category.id} id={`cat-${category.slug}`} className="mb-12">
            <h3 className="font-serif text-3xl text-ink mb-1">{category.name}</h3>
            <p className="text-sm text-ink/70 mb-4">
              {items.length} {items.length === 1 ? 'plato' : 'platos'}
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((dish) => (
                <DishCard key={dish.id} dish={dish} categoryName={category.name} onClick={() => setSelectedDish(dish)} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <DishModal
        dish={selectedDish}
        categoryName={selectedDish ? categoryName(selectedDish) : ''}
        isOpen={!!selectedDish}
        onClose={() => setSelectedDish(null)}
      />
    </section>
  );
};

export default MenuSection;
