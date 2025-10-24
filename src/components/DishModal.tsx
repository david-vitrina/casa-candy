import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Dish } from '@/types/menu';

interface DishModalProps {
  dish: Dish | null;
  isOpen: boolean;
  onClose: () => void;
}

const DishModal = ({ dish, isOpen, onClose }: DishModalProps) => {
  if (!dish) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-bold text-spanish-red">
            {dish.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 sm:space-y-6">
          {/* Image */}
          <div className="relative overflow-hidden rounded-lg">
            <img 
              src={dish.image} 
              alt={dish.name}
              className="w-full h-48 sm:h-64 object-cover"
            />
            {!dish.available && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Badge variant="destructive" className="text-lg py-2 px-4">
                  No Disponible Hoy
                </Badge>
              </div>
            )}
          </div>
          
          {/* Content */}
          <div className="space-y-4">
            {/* Category and Price */}
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Badge 
                  variant={dish.category === 'appetizer' ? 'secondary' : dish.category === 'main' ? 'default' : 'outline'}
                  className="text-sm"
                >
                  {dish.category === 'appetizer' ? 'Entrante' : dish.category === 'main' ? 'Plato Principal' : 'Postre'}
                </Badge>
                {dish.daily_menu_type && (
                  <Badge className="bg-gradient-to-r from-golden-mustard to-warm-amber text-white text-sm">
                    {dish.daily_menu_type === 'primero' ? 'Primero (Menú Diario)' : 'Segundo (Menú Diario)'}
                  </Badge>
                )}
              </div>
              <span className="text-xl sm:text-2xl font-bold text-spanish-red">
                €{dish.price.toFixed(2)}
              </span>
            </div>
            
            {/* Full Description */}
            <div>
              <h4 className="text-lg font-semibold mb-2">Descripción</h4>
              <p className="text-muted-foreground leading-relaxed">
                {dish.full_description}
              </p>
            </div>
            
            {/* Ingredients */}
            <div>
              <h4 className="text-base sm:text-lg font-semibold mb-3">Ingredientes</h4>
              {Array.isArray(dish.ingredients) && dish.ingredients.length > 0 ? (
                <ul className="space-y-2">
                  {dish.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-start text-sm sm:text-base text-muted-foreground">
                      <span className="mr-3 mt-1.5 h-2 w-2 rounded-full bg-spanish-gold flex-shrink-0" />
                      <span>{ingredient}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No hay ingredientes disponibles
                </p>
              )}
            </div>
            
            {/* Availability Status */}
            <div className="pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Estado de disponibilidad:
                </span>
                <Badge 
                  variant={dish.available ? 'default' : 'destructive'}
                  className={dish.available ? 'bg-green-500' : ''}
                >
                  {dish.available ? 'Disponible' : 'No Disponible'}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DishModal;