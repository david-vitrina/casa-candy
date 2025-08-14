import { useState, useEffect } from 'react';
import { ArrowLeft, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  role: string;
  created_at: string;
  permissions?: string[];
}

interface PermissionManagerProps {
  user: UserProfile;
  onBack: () => void;
}

const PermissionManager = ({ user, onBack }: PermissionManagerProps) => {
  const [permissions, setPermissions] = useState<{ [key: string]: boolean }>({});
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const availablePermissions = [
    { key: 'edit_dishes', label: 'Editar Platos', description: 'Permite editar información de platos existentes' },
    { key: 'manage_availability', label: 'Gestionar Disponibilidad', description: 'Permite activar/desactivar platos' },
    { key: 'delete_dishes', label: 'Eliminar Platos', description: 'Permite eliminar platos del menú' },
    { key: 'manage_users', label: 'Gestionar Usuarios', description: 'Permite gestionar otros usuarios (solo admins)' }
  ];

  useEffect(() => {
    // Inicializar permisos actuales
    const currentPermissions: { [key: string]: boolean } = {};
    availablePermissions.forEach(perm => {
      currentPermissions[perm.key] = user.permissions?.includes(perm.key) || false;
    });
    setPermissions(currentPermissions);
  }, [user]);

  const togglePermission = async (permissionKey: string, granted: boolean) => {
    setLoading(true);
    
    try {
      if (granted) {
        const { error } = await supabase.rpc('grant_permission', {
          target_user_email: user.email,
          permission: permissionKey
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.rpc('revoke_permission', {
          target_user_email: user.email,
          permission: permissionKey
        });
        if (error) throw error;
      }

      setPermissions(prev => ({
        ...prev,
        [permissionKey]: granted
      }));

      toast({
        title: granted ? "Permiso otorgado" : "Permiso revocado",
        description: `${availablePermissions.find(p => p.key === permissionKey)?.label} ${granted ? 'otorgado a' : 'revocado de'} ${user.email}`
      });

    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el permiso",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const activePermissionsCount = Object.values(permissions).filter(Boolean).length;

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver
        </Button>
        <div>
          <h2 className="text-2xl font-bold">Gestión de Permisos</h2>
          <p className="text-muted-foreground">
            Configurando permisos para {user.email}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Permisos Disponibles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {availablePermissions.map((permission) => (
                <div key={permission.key} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium">{permission.label}</h3>
                      {permissions[permission.key] && (
                        <Badge variant="default" className="text-xs">
                          <Check className="w-3 h-3 mr-1" />
                          Activo
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {permission.description}
                    </p>
                  </div>
                  <Switch
                    checked={permissions[permission.key] || false}
                    onCheckedChange={(checked) => togglePermission(permission.key, checked)}
                    disabled={loading}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Resumen de Usuario</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-medium">{user.email}</p>
                <Badge variant={user.role === 'admin' ? "destructive" : "secondary"}>
                  {user.role === 'admin' ? 'Administrador' : 'Usuario'}
                </Badge>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Permisos Activos
                </p>
                <div className="text-2xl font-bold text-spanish-red">
                  {activePermissionsCount}
                </div>
                <p className="text-xs text-muted-foreground">
                  de {availablePermissions.length} disponibles
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Registrado
                </p>
                <p className="text-sm">
                  {new Date(user.created_at).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>

              {user.role === 'admin' && (
                <div className="p-3 bg-spanish-red/10 rounded-lg">
                  <p className="text-sm text-spanish-red font-medium">
                    Los administradores tienen todos los permisos automáticamente
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PermissionManager;