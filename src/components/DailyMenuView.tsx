import { Dish } from '@/types/menu';
import { Card, CardContent } from '@/components/ui/card';
import DishCard from './DishCard';
import DishModal from './DishModal';
import { useState } from 'react';
import { useDailyMenuSettings } from '@/hooks/useDailyMenuSettings';

interface DailyMenuViewProps {
  dishes: Dish[];
  onDishClick: (dish: Dish) => void;
}

const DailyMenuView = ({ dishes, onDishClick }: DailyMenuViewProps) => {
  const { settings, loading } = useDailyMenuSettings();

  const primeros = dishes.filter(dish => dish.daily_menu_type === 'primero');
  const segundos = dishes.filter(dish => dish.daily_menu_type === 'segundo');

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-muted-foreground">Cargando menú diario...</p>
      </div>
    );
  }

  if (!settings?.is_active) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-muted-foreground">El menú diario no está disponible en este momento.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      {/* Header con precio */}
      <Card className="bg-gradient-to-r from-toasted-brown/10 via-warm-amber/10 to-golden-mustard/10 border-2 border-toasted-brown/30">
        <CardContent className="p-8 text-center">
          <h3 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-toasted-brown via-warm-amber to-golden-mustard bg-clip-text text-transparent">
              MENÚ DIARIO
            </span>
          </h3>
          <p className="text-3xl font-bold text-toasted-brown">
            Precio: €{settings?.price.toFixed(2)}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Incluye bebida y postre o café
          </p>
        </CardContent>
      </Card>

      {/* Sección PRIMEROS */}
      <div className="space-y-6">
        <div className="text-center">
          <h4 className="text-3xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-toasted-brown to-warm-amber bg-clip-text text-transparent">
              PRIMEROS
            </span>
          </h4>
          <p className="text-muted-foreground mt-2">Elige uno de los siguientes platos</p>
        </div>
        
        {primeros.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {primeros.map((dish) => (
              <DishCard
                key={dish.id}
                dish={dish}
                onClick={() => onDishClick(dish)}
                hidePriceInDailyMenu={true}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">No hay primeros disponibles hoy</p>
        )}
      </div>

      {/* Sección SEGUNDOS */}
      <div className="space-y-6">
        <div className="text-center">
          <h4 className="text-3xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-toasted-brown to-warm-amber bg-clip-text text-transparent">
              SEGUNDOS
            </span>
          </h4>
          <p className="text-muted-foreground mt-2">Elige uno de los siguientes platos</p>
        </div>
        
        {segundos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {segundos.map((dish) => (
              <DishCard
                key={dish.id}
                dish={dish}
                onClick={() => onDishClick(dish)}
                hidePriceInDailyMenu={true}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">No hay segundos disponibles hoy</p>
        )}
      </div>
    </div>
  );
};

export default DailyMenuView;
