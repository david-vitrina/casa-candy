
import { Navigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { usePermissions } from '@/hooks/usePermissions';
import AdminLayout from '@/components/admin/AdminLayout';

const Admin = () => {
  const { user, isAdmin, loading } = useAuth();
  const { permissions, loading: permissionsLoading, hasAnyPermission } = usePermissions();

  if (loading || permissionsLoading) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Verificar si el usuario tiene al menos un permiso o es admin
  const hasAccess = isAdmin || hasAnyPermission(['edit_dishes', 'manage_availability', 'delete_dishes', 'manage_users']);

  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-lg mb-4">No tienes permisos para acceder al panel de administración</p>
            <p className="text-sm text-muted-foreground">
              Contacta con un administrador para obtener los permisos necesarios.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <AdminLayout />;
};

export default Admin;
