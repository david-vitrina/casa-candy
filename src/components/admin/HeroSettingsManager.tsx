import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Upload, Loader2 } from 'lucide-react';
import { useHeroSettings } from '@/hooks/useHeroSettings';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import imageCompression from 'browser-image-compression';

export const HeroSettingsManager = () => {
  const { settings, isLoading, updateSettings } = useHeroSettings();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);

      // Comprimir imagen
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };

      const compressedFile = await imageCompression(file, options);
      const fileExt = file.name.split('.').pop();
      const fileName = `hero-${Date.now()}.${fileExt}`;
      const filePath = `hero-backgrounds/${fileName}`;

      // Subir a Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('dish-images')
        .upload(filePath, compressedFile);

      if (uploadError) throw uploadError;

      // Obtener URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('dish-images')
        .getPublicUrl(filePath);

      // Actualizar configuración
      updateSettings({
        image_url: publicUrl,
        overlay_opacity: settings.overlay_opacity,
        gradient_enabled: settings.gradient_enabled,
      });

      toast({
        title: 'Imagen actualizada',
        description: 'La imagen de fondo del hero se ha actualizado correctamente.',
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Error',
        description: 'No se pudo subir la imagen. Inténtalo de nuevo.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleOpacityChange = (value: number[]) => {
    updateSettings({
      image_url: settings.image_url,
      overlay_opacity: value[0],
      gradient_enabled: settings.gradient_enabled,
    });
  };

  const handleGradientToggle = (checked: boolean) => {
    updateSettings({
      image_url: settings.image_url,
      overlay_opacity: settings.overlay_opacity,
      gradient_enabled: checked,
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Configuración del Hero
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Preview */}
        <div className="space-y-2">
          <Label>Vista Previa</Label>
          <div className="relative h-48 rounded-lg overflow-hidden border border-border">
            {settings.image_url ? (
              <img 
                src={settings.image_url} 
                alt="Hero background" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
                Sin imagen
              </div>
            )}
            <div 
              className="absolute inset-0 bg-gradient-to-br from-cream-light via-background to-golden-mustard/10"
              style={{ 
                opacity: settings.gradient_enabled ? settings.overlay_opacity : 0 
              }}
            />
          </div>
        </div>

        {/* Upload Image */}
        <div className="space-y-2">
          <Label htmlFor="hero-image">Imagen de Fondo</Label>
          <div className="flex items-center gap-2">
            <Input
              id="hero-image"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
              className="flex-1"
            />
            {uploading && <Loader2 className="h-5 w-5 animate-spin" />}
          </div>
          <p className="text-xs text-muted-foreground">
            Recomendado: 1920x1080px, formato JPG o PNG
          </p>
        </div>

        {/* Gradient Toggle */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="gradient-enabled">Gradiente Superpuesto</Label>
            <p className="text-xs text-muted-foreground">
              Activa un gradiente decorativo sobre la imagen
            </p>
          </div>
          <Switch
            id="gradient-enabled"
            checked={settings.gradient_enabled}
            onCheckedChange={handleGradientToggle}
          />
        </div>

        {/* Opacity Slider */}
        {settings.gradient_enabled && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Opacidad del Gradiente</Label>
              <span className="text-sm text-muted-foreground">
                {Math.round(settings.overlay_opacity * 100)}%
              </span>
            </div>
            <Slider
              value={[settings.overlay_opacity]}
              onValueChange={handleOpacityChange}
              min={0}
              max={1}
              step={0.05}
              className="w-full"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
