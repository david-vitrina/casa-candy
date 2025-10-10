
import { useState, useEffect } from 'react';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { usePermissions } from '@/hooks/usePermissions';
import { RESTAURANT_CONFIG } from '@/config/restaurant';
import DishManagement from './DishManagement';
import UserManagement from './UserManagement';
import { HeroSettingsManager } from './HeroSettingsManager';

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

  // Contar tabs disponibles
  const availableTabs = [
    hasDishPermissions && 'dishes',
    hasUserPermissions && 'users',
    (isAdmin || canEditDishes) && 'hero'
  ].filter(Boolean);

  const tabCount = availableTabs.length;

  // Si no tiene ningún permiso, no debería llegar aquí, pero por seguridad
  if (tabCount === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-cream-light/30">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-toasted-brown to-golden-mustard bg-clip-text text-transparent">
              Panel de Administración
            </h1>
            <Button
              onClick={signOut}
              variant="outline"
              className="border-toasted-brown text-toasted-brown hover:bg-toasted-brown hover:text-white"
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
    <div className="min-h-screen bg-gradient-to-b from-background to-cream-light/30">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {RESTAURANT_CONFIG.name} - Panel de Administración
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
            className="border-toasted-brown text-toasted-brown hover:bg-toasted-brown hover:text-white"
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
              {(isAdmin || canEditDishes) && (
                <TabsTrigger value="hero">Hero</TabsTrigger>
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
            
            {(isAdmin || canEditDishes) && (
              <TabsContent value="hero">
                <HeroSettingsManager />
              </TabsContent>
            )}
          </Tabs>
        ) : (
          // Solo una pestaña disponible, mostrar directamente el contenido
          <div className="w-full">
            {hasDishPermissions && <DishManagement />}
            {hasUserPermissions && !hasDishPermissions && <UserManagement />}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLayout;
