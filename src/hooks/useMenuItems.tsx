import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { menuItems } from '@/data/menu';
import { Dish } from '@/types/menu';

export const useMenuItems = () => {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);

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

      if (!error && data && data.length > 0) {
        // Combinar datos de Supabase con imágenes locales
        const dishesWithLocalImages = data.map(dishFromDB => {
          // Buscar el plato correspondiente en menuItems local por nombre
          const localDish = menuItems.find(local => 
            local.name.toLowerCase() === dishFromDB.name.toLowerCase()
          );
          
          return {
            ...dishFromDB,
            // Usar imagen local si existe, sino usar la de la DB
            image: localDish ? localDish.image : dishFromDB.image
          } as Dish;
        });
        
        setDishes(dishesWithLocalImages);
      } else {
        // Fallback a datos locales si no hay datos en Supabase
        console.warn('No se pudieron cargar datos de Supabase, usando datos locales');
        setDishes(menuItems.filter(item => item.available));
      }
    } catch (error) {
      console.error('Error al cargar platos:', error);
      // Fallback a datos locales en caso de error
      setDishes(menuItems.filter(item => item.available));
    } finally {
      setLoading(false);
    }
  };

  return { dishes, loading };
};