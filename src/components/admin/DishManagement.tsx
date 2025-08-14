import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { usePermissions } from '@/hooks/usePermissions';
import DishForm from '@/components/DishForm';
import { Dish } from '@/types/menu';

const DishManagement = () => {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();
  const { canEditDishes, canManageAvailability, canDeleteDishes, isAdmin } = usePermissions();

  useEffect(() => {
    fetchDishes();
  }, []);

  const fetchDishes = async () => {
    const { data, error } = await supabase
      .from('dishes')
      .select('*')
      .order('name');
    
    if (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los platos",
        variant: "destructive"
      });
    } else {
      setDishes(data as Dish[] || []);
    }
  };

  const toggleAvailability = async (dish: Dish) => {
    const { error } = await supabase
      .from('dishes')
      .update({ available: !dish.available })
      .eq('id', dish.id);

    if (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar la disponibilidad",
        variant: "destructive"
      });
    } else {
      setDishes(dishes.map(d => 
        d.id === dish.id ? { ...d, available: !d.available } : d
      ));
      toast({
        title: "Actualizado",
        description: `${dish.name} ${!dish.available ? 'disponible' : 'no disponible'}`
      });
    }
  };

  const deleteDish = async (dish: Dish) => {
    if (!confirm(`¿Estás seguro de eliminar ${dish.name}?`)) return;

    const { error } = await supabase
      .from('dishes')
      .delete()
      .eq('id', dish.id);

    if (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el plato",
        variant: "destructive"
      });
    } else {
      setDishes(dishes.filter(d => d.id !== dish.id));
      toast({
        title: "Eliminado",
        description: `${dish.name} ha sido eliminado`
      });
    }
  };

  const handleDishSaved = () => {
    setShowForm(false);
    setSelectedDish(null);
    fetchDishes();
  };

  const getCategoryLabel = (category: string) => {
    const labels = {
      appetizer: 'Entrante',
      main: 'Principal',
      dessert: 'Postre'
    };
    return labels[category as keyof typeof labels] || category;
  };

  if (showForm) {
    return (
      <DishForm
        dish={selectedDish}
        onSave={handleDishSaved}
        onCancel={() => {
          setShowForm(false);
          setSelectedDish(null);
        }}
      />
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Gestión de Platos</h2>
        {isAdmin && (
          <Button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-spanish-red to-spanish-orange"
          >
            <Plus className="w-4 h-4 mr-2" />
            Agregar Plato
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dishes.map((dish) => (
          <Card key={dish.id} className="relative">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{dish.name}</CardTitle>
                <Badge variant={dish.available ? "default" : "secondary"}>
                  {getCategoryLabel(dish.category)}
                </Badge>
              </div>
              <p className="text-muted-foreground">{dish.description}</p>
              <p className="text-lg font-bold text-spanish-red">€{dish.price}</p>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  {canEditDishes && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedDish(dish);
                        setShowForm(true);
                      }}
                      title="Editar plato"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  )}
                  {canDeleteDishes && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteDish(dish)}
                      title="Eliminar plato"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                {canManageAvailability && (
                  <Button
                    variant={dish.available ? "default" : "secondary"}
                    size="sm"
                    onClick={() => toggleAvailability(dish)}
                    title={dish.available ? "Desactivar plato" : "Activar plato"}
                  >
                    {dish.available ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DishManagement;