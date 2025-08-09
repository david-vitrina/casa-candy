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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-spanish-red">
            {dish.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Image */}
          <div className="relative overflow-hidden rounded-lg">
            <img 
              src={dish.image} 
              alt={dish.name}
              className="w-full h-64 object-cover"
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
              <Badge 
                variant={dish.category === 'appetizer' ? 'secondary' : dish.category === 'main' ? 'default' : 'outline'}
                className="text-sm"
              >
                {dish.category === 'appetizer' ? 'Entrante' : dish.category === 'main' ? 'Plato Principal' : 'Postre'}
              </Badge>
              <span className="text-2xl font-bold text-spanish-red">
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
              <h4 className="text-lg font-semibold mb-3">Ingredientes</h4>
              <div className="flex flex-wrap gap-2">
                {dish.ingredients.map((ingredient, index) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className="text-xs bg-warm-cream/50 border-spanish-gold/30"
                  >
                    {ingredient}
                  </Badge>
                ))}
              </div>
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