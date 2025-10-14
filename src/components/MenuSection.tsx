import { useState } from 'react';
import { Button } from '@/components/ui/button';
import DishCard from './DishCard';
import DishModal from './DishModal';
import DailyMenuView from './DailyMenuView';
import { Dish } from '@/types/menu';
import { useMenuItems } from '@/hooks/useMenuItems';

const MenuSection = () => {
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [filter, setFilter] = useState<'all' | 'appetizer' | 'main' | 'dessert' | 'daily'>('all');
  const { dishes, loading } = useMenuItems();

  const filteredItems = filter === 'all' 
    ? dishes 
    : filter === 'daily'
      ? dishes.filter(item => item.daily_menu_type !== null && item.daily_menu_type !== undefined)
      : dishes.filter(item => item.category === filter);

  const filterButtons = [
    { key: 'all', label: 'Todos los Platos' },
    { key: 'daily', label: 'Menú Diario' },
    { key: 'appetizer', label: 'Entrantes' },
    { key: 'main', label: 'Principales' },
    { key: 'dessert', label: 'Postres' }
  ] as const;

  if (loading) {
    return (
      <section id="menu" className="py-24 bg-gradient-to-b from-background via-cream-light/30 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-xl text-muted-foreground">Cargando menú...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="menu" className="py-24 bg-gradient-to-b from-background via-candy-cream/30 to-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center space-y-6 mb-16 animate-fade-in">
          <h2 className="text-5xl md:text-6xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-toasted-brown via-warm-amber to-golden-mustard bg-clip-text text-transparent">
              Nuestro Menú
            </span>
          </h2>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto font-light leading-relaxed">
            Una selección cuidadosa de platos que combinan tradición y creatividad
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {filterButtons.map(({ key, label }) => (
            <Button
              key={key}
              variant={filter === key ? "default" : "outline"}
              onClick={() => setFilter(key)}
              className={filter === key 
                ? "bg-gradient-to-r from-toasted-brown to-warm-amber text-white shadow-premium rounded-full px-8 py-6 font-semibold" 
                : "border-2 border-toasted-brown text-toasted-brown hover:bg-toasted-brown hover:text-white rounded-full px-8 py-6 transition-all duration-300"
              }
            >
              {label}
            </Button>
          ))}
        </div>

        {/* Menu Grid o Daily Menu View */}
        {filter === 'daily' ? (
          <DailyMenuView 
            dishes={filteredItems}
            onDishClick={(dish) => setSelectedDish(dish)}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((dish) => (
              <DishCard
                key={dish.id}
                dish={dish}
                onClick={() => setSelectedDish(dish)}
              />
            ))}
          </div>
        )}

        {/* Dish Modal */}
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