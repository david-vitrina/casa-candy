import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface HeroSettings {
  image_url: string;
  overlay_opacity: number;
  gradient_enabled: boolean;
}

export const useHeroSettings = () => {
  const [settings, setSettings] = useState<HeroSettings>({
    image_url: '',
    overlay_opacity: 0.3,
    gradient_enabled: true
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHeroSettings();
    
    // Suscribirse a cambios en tiempo real
    const channel = supabase
      .channel('hero-settings-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'site_settings',
          filter: 'key=eq.hero_background'
        },
        () => {
          fetchHeroSettings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchHeroSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'hero_background')
        .single();

      if (error) throw error;
      
      if (data?.value && typeof data.value === 'object') {
        const value = data.value as Record<string, unknown>;
        setSettings({
          image_url: (value.image_url as string) || '',
          overlay_opacity: (value.overlay_opacity as number) || 0.3,
          gradient_enabled: (value.gradient_enabled as boolean) ?? true
        });
      }
    } catch (error) {
      console.error('Error fetching hero settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateHeroSettings = async (newSettings: Partial<HeroSettings>) => {
    try {
      const updatedSettings = { ...settings, ...newSettings };
      
      const { error } = await supabase
        .from('site_settings')
        .update({ value: updatedSettings })
        .eq('key', 'hero_background');

      if (error) throw error;
      
      setSettings(updatedSettings);
      return { success: true };
    } catch (error) {
      console.error('Error updating hero settings:', error);
      return { success: false, error };
    }
  };

  return {
    settings,
    loading,
    updateHeroSettings
  };
};
