import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface HeroBackgroundSettings {
  image_url: string;
  overlay_opacity: number;
  gradient_enabled: boolean;
}

const defaultSettings: HeroBackgroundSettings = {
  image_url: '',
  overlay_opacity: 0.3,
  gradient_enabled: true,
};

export const useHeroSettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: settings = defaultSettings, isLoading } = useQuery({
    queryKey: ['site-settings', 'hero_background'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'hero_background')
        .maybeSingle();

      if (error) throw error;
      if (!data) return defaultSettings;
      
      return data.value as unknown as HeroBackgroundSettings;
    },
  });

  const updateSettings = useMutation({
    mutationFn: async (newSettings: HeroBackgroundSettings) => {
      const { error } = await supabase
        .from('site_settings')
        .update({ value: newSettings as any })
        .eq('key', 'hero_background');

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site-settings', 'hero_background'] });
      toast({
        title: 'Configuración actualizada',
        description: 'El fondo del hero se ha actualizado correctamente',
      });
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `No se pudo actualizar: ${error.message}`,
      });
    },
  });

  return {
    settings,
    isLoading,
    updateSettings: updateSettings.mutate,
  };
};
