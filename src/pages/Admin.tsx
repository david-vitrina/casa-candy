import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import DishForm from '@/components/DishForm';

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
}

const Admin = () => {
  const { user, isAdmin, loading } = useAuth();
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isAdmin) {
      fetchDishes();
    }
  }, [isAdmin]);

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

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-lg">No tienes permisos de administrador</p>
          </CardContent>
        </Card>
      </div>
    );
  }

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

  const getCategoryLabel = (category: string) => {
    const labels = {
      appetizer: 'Entrante',
      main: 'Principal',
      dessert: 'Postre'
    };
    return labels[category as keyof typeof labels] || category;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-warm-cream/30">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-spanish-red to-spanish-orange bg-clip-text text-transparent">
            Administrador de Menú
          </h1>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-spanish-red to-spanish-orange"
          >
            <Plus className="w-4 h-4 mr-2" />
            Agregar Plato
          </Button>
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
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedDish(dish);
                        setShowForm(true);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteDish(dish)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <Button
                    variant={dish.available ? "default" : "secondary"}
                    size="sm"
                    onClick={() => toggleAvailability(dish)}
                  >
                    {dish.available ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Admin;