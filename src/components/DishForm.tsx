import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Dish {
  id: string;
  name: string;
  description: string;
  full_description: string;
  ingredients: string[];
  price: number;
  image: string;
  category: 'appetizer' | 'main' | 'dessert';
  available: boolean;
  discount_percentage?: number;
}

interface DishFormProps {
  dish?: Dish | null;
  onSave: () => void;
  onCancel: () => void;
}

const DishForm = ({ dish, onSave, onCancel }: DishFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    full_description: '',
    ingredients: '',
    price: '',
    image: '',
    category: 'appetizer' as 'appetizer' | 'main' | 'dessert',
    available: true,
    discount_percentage: ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (dish) {
      setFormData({
        name: dish.name,
        description: dish.description,
        full_description: dish.full_description,
        ingredients: dish.ingredients.join(', '),
        price: dish.price.toString(),
        image: dish.image,
        category: dish.category,
        available: dish.available,
        discount_percentage: dish.discount_percentage?.toString() || ''
      });
    }
  }, [dish]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dishData = {
        name: formData.name,
        description: formData.description,
        full_description: formData.full_description,
        ingredients: formData.ingredients.split(',').map(i => i.trim()),
        price: parseFloat(formData.price),
        image: formData.image,
        category: formData.category,
        available: formData.available,
        discount_percentage: formData.discount_percentage ? parseFloat(formData.discount_percentage) : 0
      };

      let error;
      
      if (dish) {
        const { error: updateError } = await supabase
          .from('dishes')
          .update(dishData)
          .eq('id', dish.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from('dishes')
          .insert([dishData]);
        error = insertError;
      }

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: dish ? "Plato actualizado" : "Plato creado",
          description: `${formData.name} ha sido ${dish ? 'actualizado' : 'creado'} correctamente`
        });
        onSave();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Ha ocurrido un error inesperado",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-warm-cream/30 p-4">
      <div className="container mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl bg-gradient-to-r from-spanish-red to-spanish-orange bg-clip-text text-transparent">
              {dish ? 'Editar Plato' : 'Agregar Nuevo Plato'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name">Nombre del Plato</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Descripción Corta</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="full_description">Descripción Completa</Label>
                <Textarea
                  id="full_description"
                  value={formData.full_description}
                  onChange={(e) => setFormData({ ...formData, full_description: e.target.value })}
                  rows={4}
                  required
                />
              </div>

              <div>
                <Label htmlFor="ingredients">Ingredientes (separados por comas)</Label>
                <Textarea
                  id="ingredients"
                  value={formData.ingredients}
                  onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                  placeholder="Ingrediente 1, Ingrediente 2, Ingrediente 3..."
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="price">Precio (€)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="discount_percentage">Descuento (%)</Label>
                  <Input
                    id="discount_percentage"
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={formData.discount_percentage}
                    onChange={(e) => setFormData({ ...formData, discount_percentage: e.target.value })}
                    placeholder="0"
                  />
                </div>

                <div>
                  <Label htmlFor="category">Categoría</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value: 'appetizer' | 'main' | 'dessert') => 
                      setFormData({ ...formData, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="appetizer">Entrante</SelectItem>
                      <SelectItem value="main">Principal</SelectItem>
                      <SelectItem value="dessert">Postre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="image">URL de la Imagen</Label>
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="/src/assets/plato.jpg"
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="available"
                  checked={formData.available}
                  onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                />
                <Label htmlFor="available">Disponible</Label>
              </div>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-spanish-red to-spanish-orange"
                >
                  {loading ? 'Guardando...' : (dish ? 'Actualizar' : 'Crear')}
                </Button>
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DishForm;