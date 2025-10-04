
import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { usePermissions } from '@/hooks/usePermissions';
import DishForm from '@/components/DishForm';
import { Dish } from '@/types/menu';

const DishManagement = () => {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();
  const { tenantId } = useAuth();
  const { canEditDishes, canManageAvailability, canDeleteDishes, isAdmin } = usePermissions();

  useEffect(() => {
    if (tenantId) {
      fetchDishes();
    }
  }, [tenantId]);

  const fetchDishes = async () => {
    if (!tenantId) return;
    
    const { data, error } = await supabase
      .from('dishes')
      .select('*')
      .eq('tenant_id', tenantId)
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
    if (!canManageAvailability) {
      toast({
        title: "Sin permisos",
        description: "No tienes permisos para gestionar disponibilidad",
        variant: "destructive"
      });
      return;
    }

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
    if (!canDeleteDishes) {
      toast({
        title: "Sin permisos",
        description: "No tienes permisos para eliminar platos",
        variant: "destructive"
      });
      return;
    }

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

  // Mostrar información de permisos si no es admin
  const showPermissionInfo = !isAdmin;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Gestión de Platos</h2>
          {showPermissionInfo && (
            <div className="flex gap-2 mt-2">
              {canEditDishes && <Badge variant="secondary">Puede editar</Badge>}
              {canManageAvailability && <Badge variant="secondary">Puede gestionar disponibilidad</Badge>}
              {canDeleteDishes && <Badge variant="secondary">Puede eliminar</Badge>}
            </div>
          )}
        </div>
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

      {showPermissionInfo && (
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Tienes acceso limitado. Solo puedes realizar las acciones para las que tienes permisos específicos.
          </AlertDescription>
        </Alert>
      )}

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
              {!canEditDishes && !canDeleteDishes && !canManageAvailability && (
                <div className="mt-2 text-center">
                  <Badge variant="outline" className="text-xs">
                    Solo lectura
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DishManagement;
