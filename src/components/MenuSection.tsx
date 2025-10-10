import { useState } from 'react';
import { Button } from '@/components/ui/button';
import DishCard from './DishCard';
import DishModal from './DishModal';
import { Dish } from '@/types/menu';
import { useMenuItems } from '@/hooks/useMenuItems';

const MenuSection = () => {
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [filter, setFilter] = useState<'all' | 'appetizer' | 'main' | 'dessert'>('all');
  const { dishes, loading } = useMenuItems();

  const filteredItems = filter === 'all' 
    ? dishes 
    : dishes.filter(item => item.category === filter);

  const filterButtons = [
    { key: 'all', label: 'Todos los Platos' },
    { key: 'appetizer', label: 'Entrantes' },
    { key: 'main', label: 'Principales' },
    { key: 'dessert', label: 'Postres' }
  ] as const;

  if (loading) {
    return (
      <section id="menu" className="py-20 bg-gradient-to-b from-background to-warm-cream/30">
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
            <span className="bg-gradient-to-r from-candy-coral via-candy-peach to-candy-gold bg-clip-text text-transparent">
              Nuestro Menú
            </span>
          </h2>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto font-light leading-relaxed">
            Explora nuestras creaciones únicas, donde cada burger cuenta una historia deliciosa
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
                ? "bg-gradient-to-r from-candy-coral to-candy-peach text-white shadow-candy rounded-full px-8 py-6 font-semibold" 
                : "border-2 border-candy-coral text-candy-coral hover:bg-candy-coral hover:text-white rounded-full px-8 py-6 transition-all duration-300"
              }
            >
              {label}
            </Button>
          ))}
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((dish) => (
            <DishCard
              key={dish.id}
              dish={dish}
              onClick={() => setSelectedDish(dish)}
            />
          ))}
        </div>

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