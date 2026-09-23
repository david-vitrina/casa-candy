import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Category } from '@/types/menu';

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('id, slug, name, position, visible')
        .eq('visible', true)
        .order('position');

      if (error) console.error('Error fetching categories:', error);
      setCategories(data ?? []);
      setLoading(false);
    };

    fetchCategories();
  }, []);

  return { categories, loading };
};
