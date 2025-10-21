import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dish } from '@/types/menu';

interface DishCardProps {
  dish: Dish;
  onClick: () => void;
  hidePriceInDailyMenu?: boolean;
  isDailyMenuContext?: boolean;
}

const DishCard = ({ dish, onClick, hidePriceInDailyMenu = false, isDailyMenuContext = false }: DishCardProps) => {
  return (
    <Card 
      className="group cursor-pointer overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105"
      onClick={onClick}
    >
      <div className="relative overflow-hidden">
        <img 
          src={dish.image} 
          alt={dish.name}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
        />
        {!dish.available && !isDailyMenuContext && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="destructive" className="text-sm">
              No Disponible
            </Badge>
          </div>
        )}
        <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
          <div className="flex gap-2">
            <Badge 
              variant={dish.category === 'appetizer' ? 'secondary' : dish.category === 'main' ? 'default' : 'outline'}
              className="bg-white/90 text-xs"
            >
              {dish.category === 'appetizer' ? 'Entrante' : dish.category === 'main' ? 'Principal' : 'Postre'}
            </Badge>
            {dish.discount_percentage && dish.discount_percentage > 0 && (
              <Badge className="bg-green-600 text-white text-xs">
                -{dish.discount_percentage}%
              </Badge>
            )}
          </div>
          {dish.daily_menu_type && (
            <Badge className="bg-gradient-to-r from-golden-mustard to-warm-amber text-white text-xs shadow-lg">
              {dish.daily_menu_type === 'primero' ? 'Primero' : 'Segundo'}
            </Badge>
          )}
        </div>
      </div>
      
      <CardContent className="p-6">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <h3 className="text-xl font-semibold text-foreground group-hover:text-toasted-brown transition-colors">
              {dish.name}
            </h3>
            {!hidePriceInDailyMenu && (
              <div className="text-right">
                {dish.discount_percentage && dish.discount_percentage > 0 ? (
                  <div>
                    <span className="text-sm text-gray-500 line-through">
                      €{dish.price.toFixed(2)}
                    </span>
                    <br />
                    <span className="text-lg font-bold text-toasted-brown">
                      €{(dish.price * (1 - dish.discount_percentage / 100)).toFixed(2)}
                    </span>
                  </div>
                ) : (
                  <span className="text-lg font-bold text-toasted-brown">
                    €{dish.price.toFixed(2)}
                  </span>
                )}
              </div>
            )}
          </div>
          
          <p className="text-muted-foreground line-clamp-2">
            {dish.description}
          </p>
          
          <div className="pt-2">
            <span className="text-sm text-warm-amber font-medium">
              Ver detalles →
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DishCard;