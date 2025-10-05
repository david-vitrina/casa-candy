import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Upload, Loader2, Palette } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useTenant } from '@/hooks/useTenant';
import { useAuth } from '@/hooks/useAuth';

const TenantSettings = () => {
  const { tenant, refetch } = useTenant();
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    domain: '',
    primary_color: '#8B4513',
    secondary_color: '#D4AF37',
    accent_color: '#FFD700',
    logo_url: ''
  });

  useEffect(() => {
    if (tenant) {
      setFormData({
        name: tenant.name,
        slug: tenant.slug,
        domain: tenant.domain || '',
        primary_color: tenant.primary_color,
        secondary_color: tenant.secondary_color,
        accent_color: tenant.accent_color,
        logo_url: tenant.logo_url || ''
      });
    }
  }, [tenant]);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !tenant) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${tenant.id}-logo.${fileExt}`;
      const filePath = `${tenant.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('dish-images')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('dish-images')
        .getPublicUrl(filePath);

      setFormData({ ...formData, logo_url: publicUrl });
      
      toast({
        title: "Logo subido",
        description: "El logo se ha cargado correctamente"
      });
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast({
        title: "Error",
        description: "No se pudo subir el logo",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenant) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('tenants')
        .update({
          name: formData.name,
          domain: formData.domain || null,
          primary_color: formData.primary_color,
          secondary_color: formData.secondary_color,
          accent_color: formData.accent_color,
          logo_url: formData.logo_url || null
        })
        .eq('id', tenant.id);

      if (error) throw error;

      toast({
        title: "Configuración actualizada",
        description: "Los cambios se aplicarán inmediatamente"
      });

      // Refetch tenant para aplicar cambios
      await refetch();
    } catch (error: any) {
      console.error('Error updating tenant:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo actualizar la configuración",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">
              Solo los administradores pueden acceder a la configuración del tenant.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Configuración del Restaurante
          </CardTitle>
          <CardDescription>
            Personaliza la apariencia y configuración de tu restaurante
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información básica */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Información Básica</h3>
              
              <div>
                <Label htmlFor="name">Nombre del Restaurante</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="slug">Slug (URL)</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  El slug no se puede modificar después de la creación
                </p>
              </div>

              <div>
                <Label htmlFor="domain">Dominio Personalizado (opcional)</Label>
                <Input
                  id="domain"
                  value={formData.domain}
                  onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                  placeholder="mirestaurante.com"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Configura tu propio dominio para acceder a tu restaurante
                </p>
              </div>
            </div>

            {/* Logo */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Logo</h3>
              
              {formData.logo_url && (
                <div className="flex items-center gap-4">
                  <img 
                    src={formData.logo_url} 
                    alt="Logo" 
                    className="w-20 h-20 object-contain rounded-lg border"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setFormData({ ...formData, logo_url: '' })}
                  >
                    Eliminar Logo
                  </Button>
                </div>
              )}

              <div>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                  id="logo-upload"
                  disabled={uploading}
                />
                <Label 
                  htmlFor="logo-upload"
                  className={`inline-flex items-center justify-center px-4 py-2 border border-dashed border-muted-foreground/25 rounded-lg cursor-pointer hover:bg-muted/50 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Subiendo...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Subir Logo
                    </>
                  )}
                </Label>
              </div>
            </div>

            {/* Colores */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Colores del Tema</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="primary_color">Color Primario</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      id="primary_color"
                      value={formData.primary_color}
                      onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                      className="w-20 h-10"
                    />
                    <Input
                      type="text"
                      value={formData.primary_color}
                      onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="secondary_color">Color Secundario</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      id="secondary_color"
                      value={formData.secondary_color}
                      onChange={(e) => setFormData({ ...formData, secondary_color: e.target.value })}
                      className="w-20 h-10"
                    />
                    <Input
                      type="text"
                      value={formData.secondary_color}
                      onChange={(e) => setFormData({ ...formData, secondary_color: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="accent_color">Color de Acento</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      id="accent_color"
                      value={formData.accent_color}
                      onChange={(e) => setFormData({ ...formData, accent_color: e.target.value })}
                      className="w-20 h-10"
                    />
                    <Input
                      type="text"
                      value={formData.accent_color}
                      onChange={(e) => setFormData({ ...formData, accent_color: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg border" style={{
                background: `linear-gradient(135deg, ${formData.primary_color}33, ${formData.secondary_color}33)`
              }}>
                <p className="text-sm font-medium mb-2">Vista Previa</p>
                <div className="flex gap-2">
                  <div 
                    className="w-16 h-16 rounded-lg shadow-sm"
                    style={{ backgroundColor: formData.primary_color }}
                  />
                  <div 
                    className="w-16 h-16 rounded-lg shadow-sm"
                    style={{ backgroundColor: formData.secondary_color }}
                  />
                  <div 
                    className="w-16 h-16 rounded-lg shadow-sm"
                    style={{ backgroundColor: formData.accent_color }}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={loading || uploading}
                className="bg-gradient-to-r from-spanish-red to-spanish-orange"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  'Guardar Cambios'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default TenantSettings;
