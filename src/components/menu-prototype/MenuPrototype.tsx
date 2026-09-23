// PROTOTIPO — tres variantes de la carta con cards por categorías, cambiables con ?variant=A|B|C.
// Solo se monta en desarrollo (ver MenuSection). Datos reales, solo lectura.
import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useMenuItems } from '@/hooks/useMenuItems';
import { useDailyMenuSettings } from '@/hooks/useDailyMenuSettings';
import { Category, Dish } from '@/types/menu';
import { CategoryGroup } from './shared';
import DishModal from '../DishModal';
import PrototypeSwitcher from '../PrototypeSwitcher';
import VariantA from './VariantA.prototype';
import VariantB from './VariantB.prototype';
import VariantC from './VariantC.prototype';

const VARIANTS = [
  { key: 'A', name: VariantA.label, Component: VariantA },
  { key: 'B', name: VariantB.label, Component: VariantB },
  { key: 'C', name: VariantC.label, Component: VariantC },
];

const MenuPrototype = ({ variant }: { variant: string }) => {
  const { dishes, loading } = useMenuItems();
  const { settings } = useDailyMenuSettings();
  const [categories, setCategories] = useState<Category[]>([]);
  const [dailyDishes, setDailyDishes] = useState<Dish[]>([]);
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);

  useEffect(() => {
    supabase
      .from('categories')
      .select('id, slug, name, position, visible')
      .eq('visible', true)
      .order('position')
      .then(({ data }) => setCategories(data ?? []));
    supabase
      .from('dishes')
      .select('*')
      .not('daily_menu_type', 'is', null)
      .order('name')
      .then(({ data }) => setDailyDishes((data ?? []) as Dish[]));
  }, []);

  const groups = useMemo(
    () =>
      categories
        .map((category) => ({
          category,
          dishes: dishes
            .filter((d) => d.category_id === category.id)
            .map((d) => ({ ...d, name: d.name.trim() })),
        }))
        .filter((g) => g.dishes.length > 0),
    [categories, dishes],
  );

  const daily = settings?.is_active
    ? {
        price: settings.price,
        primeros: dailyDishes.filter((d) => d.daily_menu_type === 'primero'),
        segundos: dailyDishes.filter((d) => d.daily_menu_type === 'segundo'),
      }
    : null;

  const current = VARIANTS.find((v) => v.key === variant) ?? VARIANTS[0];
  const Variant = current.Component;

  return (
    <>
      {loading || categories.length === 0 ? (
        <section id="menu" className="py-20 text-center text-ink/50">Cargando carta…</section>
      ) : (
        <Variant groups={groups} daily={daily} onDishClick={setSelectedDish} />
      )}
      <DishModal dish={selectedDish} isOpen={!!selectedDish} onClose={() => setSelectedDish(null)} />
      <PrototypeSwitcher variants={VARIANTS.map(({ key, name }) => ({ key, name }))} current={current.key} />
    </>
  );
};

export default MenuPrototype;
