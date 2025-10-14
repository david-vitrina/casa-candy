import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DailyMenuSettings } from '@/types/menu';
import { useToast } from '@/hooks/use-toast';

export const useDailyMenuSettings = () => {
  const [settings, setSettings] = useState<DailyMenuSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('daily_menu_settings')
        .select('*')
        .single();

      if (error) throw error;
      setSettings(data);
    } catch (error) {
      console.error('Error fetching daily menu settings:', error);
      toast({
        title: "Error",
        description: "No se pudo cargar la configuración del menú diario.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updatePrice = async (newPrice: number) => {
    if (!settings) return;

    try {
      const { error } = await supabase
        .from('daily_menu_settings')
        .update({ 
          price: newPrice,
          updated_at: new Date().toISOString(),
          updated_by: (await supabase.auth.getUser()).data.user?.id
        })
        .eq('id', settings.id);

      if (error) throw error;

      toast({
        title: "Éxito",
        description: "Precio del menú diario actualizado correctamente.",
      });

      await fetchSettings();
    } catch (error) {
      console.error('Error updating price:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el precio.",
        variant: "destructive"
      });
    }
  };

  const toggleActive = async () => {
    if (!settings) return;

    try {
      const { error } = await supabase
        .from('daily_menu_settings')
        .update({ 
          is_active: !settings.is_active,
          updated_at: new Date().toISOString(),
          updated_by: (await supabase.auth.getUser()).data.user?.id
        })
        .eq('id', settings.id);

      if (error) throw error;

      toast({
        title: "Éxito",
        description: `Menú diario ${!settings.is_active ? 'activado' : 'desactivado'} correctamente.`,
      });

      await fetchSettings();
    } catch (error) {
      console.error('Error toggling active:', error);
      toast({
        title: "Error",
        description: "No se pudo cambiar el estado.",
        variant: "destructive"
      });
    }
  };

  return { 
    settings, 
    loading, 
    updatePrice, 
    toggleActive,
    refetch: fetchSettings 
  };
};
