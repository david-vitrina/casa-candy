import { useState } from 'react';
import { Button } from '@/components/ui/button';
import DishCard from './DishCard';
import DishModal from './DishModal';
import { menuItems } from '@/data/menu';
import { Dish } from '@/types/menu';

const MenuSection = () => {
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [filter, setFilter] = useState<'all' | 'appetizer' | 'main' | 'dessert'>('all');

  const filteredItems = filter === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === filter);

  const filterButtons = [
    { key: 'all', label: 'Todos los Platos' },
    { key: 'appetizer', label: 'Entrantes' },
    { key: 'main', label: 'Principales' },
    { key: 'dessert', label: 'Postres' }
  ] as const;

  return (
    <section id="menu" className="py-20 bg-gradient-to-b from-background to-warm-cream/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-4xl md:text-5xl font-bold">
            <span className="bg-gradient-to-r from-spanish-red to-spanish-orange bg-clip-text text-transparent">
              Nuestro Menú
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Descubre nuestros platos tradicionales españoles, preparados con ingredientes frescos y recetas auténticas
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {filterButtons.map(({ key, label }) => (
            <Button
              key={key}
              variant={filter === key ? "default" : "outline"}
              onClick={() => setFilter(key)}
              className={filter === key 
                ? "bg-gradient-to-r from-spanish-red to-spanish-orange text-white" 
                : "border-spanish-red text-spanish-red hover:bg-spanish-red hover:text-white"
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