
import { useState, useEffect } from 'react';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { usePermissions } from '@/hooks/usePermissions';
import DishManagement from './DishManagement';
import UserManagement from './UserManagement';
import TenantSettings from './TenantSettings';
import SuperAdmin from './SuperAdmin';

const AdminLayout = () => {
  const { signOut } = useAuth();
  const { isAdmin, canEditDishes, canManageAvailability, canDeleteDishes, canManageUsers } = usePermissions();
  const [activeTab, setActiveTab] = useState('');

  // Determinar qué pestañas están disponibles y cuál debería ser la activa por defecto
  useEffect(() => {
    const hasDishPermissions = canEditDishes || canManageAvailability || canDeleteDishes;
    
    if (hasDishPermissions && !activeTab) {
      setActiveTab('dishes');
    } else if (canManageUsers && !activeTab && !hasDishPermissions) {
      setActiveTab('users');
    } else if (isAdmin && !activeTab && !hasDishPermissions && !canManageUsers) {
      setActiveTab('settings');
    }
  }, [canEditDishes, canManageAvailability, canDeleteDishes, canManageUsers, isAdmin, activeTab]);

  const hasDishPermissions = canEditDishes || canManageAvailability || canDeleteDishes;
  const hasUserPermissions = canManageUsers;
  const hasSettingsAccess = isAdmin;
  const hasSuperAdminAccess = isAdmin; // En el futuro podría ser un rol específico

  // Contar tabs disponibles
  const availableTabs = [
    hasDishPermissions && 'dishes',
    hasUserPermissions && 'users',
    hasSettingsAccess && 'settings',
    hasSuperAdminAccess && 'super-admin'
  ].filter(Boolean);

  const tabCount = availableTabs.length;

  // Si no tiene ningún permiso, no debería llegar aquí, pero por seguridad
  if (tabCount === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-warm-cream/30">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-spanish-red to-spanish-orange bg-clip-text text-transparent">
              Panel de Administración
            </h1>
            <Button
              onClick={signOut}
              variant="outline"
              className="border-spanish-red text-spanish-red hover:bg-spanish-red hover:text-white"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
          <p className="text-muted-foreground">No tienes permisos para acceder a ninguna funcionalidad.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-warm-cream/30">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-spanish-red to-spanish-orange bg-clip-text text-transparent">
              Panel de Administración
            </h1>
            {!isAdmin && (
              <p className="text-sm text-muted-foreground mt-1">
                Acceso con permisos específicos
              </p>
            )}
          </div>
          <Button
            onClick={signOut}
            variant="outline"
            className="border-spanish-red text-spanish-red hover:bg-spanish-red hover:text-white"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>

        {/* Mostrar tabs si hay más de una pestaña disponible */}
        {tabCount > 1 ? (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className={`grid w-full grid-cols-${Math.min(tabCount, 4)} mb-8`}>
              {hasDishPermissions && (
                <TabsTrigger value="dishes">Platos</TabsTrigger>
              )}
              {hasUserPermissions && (
                <TabsTrigger value="users">Usuarios</TabsTrigger>
              )}
              {hasSettingsAccess && (
                <TabsTrigger value="settings">Configuración</TabsTrigger>
              )}
              {hasSuperAdminAccess && (
                <TabsTrigger value="super-admin">Super Admin</TabsTrigger>
              )}
            </TabsList>
            
            {hasDishPermissions && (
              <TabsContent value="dishes">
                <DishManagement />
              </TabsContent>
            )}
            
            {hasUserPermissions && (
              <TabsContent value="users">
                <UserManagement />
              </TabsContent>
            )}

            {hasSettingsAccess && (
              <TabsContent value="settings">
                <TenantSettings />
              </TabsContent>
            )}

            {hasSuperAdminAccess && (
              <TabsContent value="super-admin">
                <SuperAdmin />
              </TabsContent>
            )}
          </Tabs>
        ) : (
          // Solo una pestaña disponible, mostrar directamente el contenido
          <div className="w-full">
            {hasDishPermissions && <DishManagement />}
            {hasUserPermissions && !hasDishPermissions && <UserManagement />}
            {hasSettingsAccess && !hasDishPermissions && !hasUserPermissions && <TenantSettings />}
            {hasSuperAdminAccess && !hasDishPermissions && !hasUserPermissions && !hasSettingsAccess && <SuperAdmin />}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLayout;
