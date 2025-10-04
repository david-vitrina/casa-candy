import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { menuItems } from '@/data/menu';
import { Dish } from '@/types/menu';
import { indexedDBService } from '@/services/indexedDB';
import { useAuth } from './useAuth';

export const useMenuItems = () => {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const { tenantId } = useAuth();

  useEffect(() => {
    if (tenantId) {
      fetchDishes();
    }
  }, [tenantId]);

  const fetchDishes = async () => {
    try {
      // First, load from IndexedDB for immediate display
      const cachedDishes = await indexedDBService.getDishes();
      if (cachedDishes.length > 0) {
        setDishes(cachedDishes.filter(dish => dish.available));
        setLoading(false);
      }

      // Then try to fetch from Supabase if online
      if (navigator.onLine && tenantId) {
        const { data, error } = await supabase
          .from('dishes')
          .select('*')
          .eq('tenant_id', tenantId)
          .eq('available', true)
          .order('name');

        if (!error && data && data.length > 0) {
          // Priorizar imágenes de Supabase sobre locales para permitir actualizaciones
          const dishesWithImages = data.map(dishFromDB => {
            // Buscar el plato correspondiente en menuItems local por nombre
            const localDish = menuItems.find(local => 
              local.name.toLowerCase() === dishFromDB.name.toLowerCase()
            );
            
            // Usar imagen de Supabase si existe y es una URL válida, sino usar local
            const hasSupabaseImage = dishFromDB.image && 
              (dishFromDB.image.startsWith('https://') || dishFromDB.image.startsWith('http://'));
            
            return {
              ...dishFromDB,
              image: hasSupabaseImage ? dishFromDB.image : (localDish?.image || dishFromDB.image)
            } as Dish;
          });
          
          // Update state and cache
          setDishes(dishesWithImages);
          await indexedDBService.saveDishes(dishesWithImages);
        } else if (cachedDishes.length === 0) {
          // Fallback to local data only if no cached data exists
          const localDishes = menuItems.filter(item => item.available);
          setDishes(localDishes);
          await indexedDBService.saveDishes(localDishes);
        }
      } else if (cachedDishes.length === 0) {
        // Offline and no cached data - use local fallback
        const localDishes = menuItems.filter(item => item.available);
        setDishes(localDishes);
        await indexedDBService.saveDishes(localDishes);
      }
    } catch (error) {
      console.error('Error fetching dishes:', error);
      // Fallback to cached data or local data
      const cachedDishes = await indexedDBService.getDishes();
      if (cachedDishes.length > 0) {
        setDishes(cachedDishes.filter(dish => dish.available));
      } else {
        const localDishes = menuItems.filter(item => item.available);
        setDishes(localDishes);
        await indexedDBService.saveDishes(localDishes);
      }
    } finally {
      setLoading(false);
    }
  };

  return { dishes, loading };
};