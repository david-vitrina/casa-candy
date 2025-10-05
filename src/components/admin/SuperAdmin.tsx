import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Settings, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface Tenant {
  id: string;
  name: string;
  slug: string;
  domain: string | null;
  status: 'active' | 'inactive' | 'suspended';
  created_at: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
}

const SuperAdmin = () => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { isAdmin } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    domain: '',
    primary_color: '#8B4513',
    secondary_color: '#D4AF37',
    accent_color: '#FFD700'
  });

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    try {
      const { data, error } = await supabase
        .from('tenants')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTenants(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los tenants",
        variant: "destructive"
      });
    }
  };

  const createTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validar que el slug sea único
      const { data: existing } = await supabase
        .from('tenants')
        .select('id')
        .eq('slug', formData.slug)
        .maybeSingle();

      if (existing) {
        toast({
          title: "Error",
          description: "Ya existe un tenant con ese slug",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      const { data: newTenant, error } = await supabase
        .from('tenants')
        .insert([{
          name: formData.name,
          slug: formData.slug,
          domain: formData.domain || null,
          primary_color: formData.primary_color,
          secondary_color: formData.secondary_color,
          accent_color: formData.accent_color,
          status: 'active',
          settings: {
            theme: 'custom',
            features: {
              pwa: true,
              offline: true
            }
          }
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Tenant creado",
        description: `${formData.name} ha sido creado correctamente`
      });

      setShowDialog(false);
      setFormData({
        name: '',
        slug: '',
        domain: '',
        primary_color: '#8B4513',
        secondary_color: '#D4AF37',
        accent_color: '#FFD700'
      });
      fetchTenants();
    } catch (error: any) {
      console.error('Error creating tenant:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo crear el tenant",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateTenantStatus = async (tenantId: string, status: 'active' | 'inactive' | 'suspended') => {
    try {
      const { error } = await supabase
        .from('tenants')
        .update({ status })
        .eq('id', tenantId);

      if (error) throw error;

      setTenants(tenants.map(t => 
        t.id === tenantId ? { ...t, status } : t
      ));

      toast({
        title: "Estado actualizado",
        description: `El tenant ahora está ${status}`
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado",
        variant: "destructive"
      });
    }
  };

  const deleteTenant = async (tenant: Tenant) => {
    if (tenant.slug === 'david-burger') {
      toast({
        title: "Error",
        description: "No se puede eliminar el tenant principal",
        variant: "destructive"
      });
      return;
    }

    if (!confirm(`¿Estás seguro de eliminar "${tenant.name}"? Esta acción no se puede deshacer.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('tenants')
        .delete()
        .eq('id', tenant.id);

      if (error) throw error;

      setTenants(tenants.filter(t => t.id !== tenant.id));
      toast({
        title: "Tenant eliminado",
        description: `${tenant.name} ha sido eliminado`
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo eliminar el tenant",
        variant: "destructive"
      });
    }
  };

  if (!isAdmin) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">
              Solo los super administradores pueden acceder a este panel.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Building2 className="w-6 h-6" />
            Gestión de Tenants
          </h2>
          <p className="text-muted-foreground mt-1">
            Administra todos los restaurantes de la plataforma
          </p>
        </div>
        <Button
          onClick={() => setShowDialog(true)}
          className="bg-gradient-to-r from-spanish-red to-spanish-orange"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Tenant
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tenants.map((tenant) => (
          <Card key={tenant.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{tenant.name}</CardTitle>
                  <CardDescription className="mt-1">
                    /{tenant.slug}
                  </CardDescription>
                </div>
                <Badge variant={
                  tenant.status === 'active' ? 'default' : 
                  tenant.status === 'inactive' ? 'secondary' : 
                  'destructive'
                }>
                  {tenant.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {tenant.domain && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Dominio: </span>
                    <span className="font-medium">{tenant.domain}</span>
                  </div>
                )}
                
                <div className="flex gap-2">
                  <div 
                    className="w-6 h-6 rounded border"
                    style={{ backgroundColor: tenant.primary_color }}
                    title="Color primario"
                  />
                  <div 
                    className="w-6 h-6 rounded border"
                    style={{ backgroundColor: tenant.secondary_color }}
                    title="Color secundario"
                  />
                  <div 
                    className="w-6 h-6 rounded border"
                    style={{ backgroundColor: tenant.accent_color }}
                    title="Color de acento"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  {tenant.status === 'active' ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateTenantStatus(tenant.id, 'inactive')}
                    >
                      Desactivar
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateTenantStatus(tenant.id, 'active')}
                    >
                      Activar
                    </Button>
                  )}
                  
                  {tenant.slug !== 'david-burger' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteTenant(tenant)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Crear Nuevo Tenant</DialogTitle>
          </DialogHeader>
          <form onSubmit={createTenant} className="space-y-4">
            <div>
              <Label htmlFor="tenant-name">Nombre del Restaurante</Label>
              <Input
                id="tenant-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Mi Restaurante"
                required
              />
            </div>

            <div>
              <Label htmlFor="tenant-slug">Slug (URL)</Label>
              <Input
                id="tenant-slug"
                value={formData.slug}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-')
                })}
                placeholder="mi-restaurante"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                Solo letras minúsculas, números y guiones
              </p>
            </div>

            <div>
              <Label htmlFor="tenant-domain">Dominio (opcional)</Label>
              <Input
                id="tenant-domain"
                value={formData.domain}
                onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                placeholder="mirestaurante.com"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="tenant-primary">Color Primario</Label>
                <Input
                  type="color"
                  id="tenant-primary"
                  value={formData.primary_color}
                  onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                  className="h-10"
                />
              </div>
              <div>
                <Label htmlFor="tenant-secondary">Color Secundario</Label>
                <Input
                  type="color"
                  id="tenant-secondary"
                  value={formData.secondary_color}
                  onChange={(e) => setFormData({ ...formData, secondary_color: e.target.value })}
                  className="h-10"
                />
              </div>
              <div>
                <Label htmlFor="tenant-accent">Color de Acento</Label>
                <Input
                  type="color"
                  id="tenant-accent"
                  value={formData.accent_color}
                  onChange={(e) => setFormData({ ...formData, accent_color: e.target.value })}
                  className="h-10"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-spanish-red to-spanish-orange"
              >
                Crear Tenant
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowDialog(false)}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SuperAdmin;
