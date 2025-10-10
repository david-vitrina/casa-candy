import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { menuItems } from '@/data/menu';
import { Dish } from '@/types/menu';
import { useToast } from '@/hooks/use-toast';

export const useMenuItems = () => {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchDishes();
  }, []);

  const fetchDishes = async () => {
    try {
      const { data, error } = await supabase
        .from('dishes')
        .select('*')
        .eq('available', true)
        .order('name');

      if (error) throw error;

      if (data && data.length > 0) {
        const dishesWithImages = data.map(dishFromDB => {
          const localDish = menuItems.find(local => 
            local.name.toLowerCase() === dishFromDB.name.toLowerCase()
          );
          
          const hasSupabaseImage = dishFromDB.image && 
            (dishFromDB.image.startsWith('https://') || dishFromDB.image.startsWith('http://'));
          
          return {
            ...dishFromDB,
            image: hasSupabaseImage ? dishFromDB.image : (localDish?.image || dishFromDB.image)
          } as Dish;
        });
        
        setDishes(dishesWithImages);
      } else {
        // Fallback a datos locales
        setDishes(menuItems.filter(item => item.available));
      }
    } catch (error) {
      console.error('Error fetching dishes:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los platos. Mostrando menú local.",
        variant: "destructive"
      });
      setDishes(menuItems.filter(item => item.available));
    } finally {
      setLoading(false);
    }
  };

  return { dishes, loading, refetch: fetchDishes };
};