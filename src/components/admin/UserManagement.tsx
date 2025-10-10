
import { useState, useEffect } from 'react';
import { Search, Shield, User, Trash2, Settings, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { usePermissions } from '@/hooks/usePermissions';
import UserCard from './UserCard';
import PermissionManager from './PermissionManager';
import CreateUserDialog from './CreateUserDialog';

interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  created_at: string;
  updated_at: string;
  permissions?: string[];
  isAdmin?: boolean;
}

const UserManagement = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [showPermissions, setShowPermissions] = useState(false);
  const { user: currentUser } = useAuth();
  const { isAdmin } = usePermissions();
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(user =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [users, searchTerm]);

  const fetchUsers = async () => {
    try {
      // Obtener todos los usuarios
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Obtener permisos y roles
      const { data: permissions, error: permissionsError } = await supabase
        .from('user_permissions')
        .select('user_id, permission_type');

      const { data: roles } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (permissionsError) throw permissionsError;

      // Combinar datos
      const usersWithPermissions = (profiles || []).map(profile => ({
        ...profile,
        permissions: permissions
          ?.filter(p => p.user_id === profile.user_id)
          ?.map(p => p.permission_type) || [],
        isAdmin: roles?.some(r => r.user_id === profile.user_id && r.role === 'admin') || false
      }));

      setUsers(usersWithPermissions);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los usuarios",
        variant: "destructive"
      });
    }
  };

  const promoteToAdmin = async (userId: string, userEmail: string) => {
    if (!isAdmin) {
      toast({
        title: "Sin permisos",
        description: "Solo los administradores pueden promover usuarios",
        variant: "destructive"
      });
      return;
    }

    if (!confirm(`¿Promover a ${userEmail} como administrador?`)) return;

    try {
      const { error } = await supabase.rpc('promote_user_to_admin', {
        target_user_id: userId
      });

      if (error) throw error;

      toast({
        title: "Usuario promovido",
        description: `${userEmail} ahora es administrador`
      });
      
      fetchUsers();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo promover al usuario",
        variant: "destructive"
      });
    }
  };

  const demoteFromAdmin = async (userId: string, userEmail: string) => {
    if (!isAdmin) {
      toast({
        title: "Sin permisos",
        description: "Solo los administradores pueden degradar usuarios",
        variant: "destructive"
      });
      return;
    }

    if (userEmail === currentUser?.email) {
      toast({
        title: "Error",
        description: "No puedes degradar tu propio rol",
        variant: "destructive"
      });
      return;
    }

    if (!confirm(`¿Degradar a ${userEmail} a usuario regular?`)) return;

    try {
      const { error } = await supabase.rpc('demote_admin_to_user', {
        target_user_id: userId
      });

      if (error) throw error;

      toast({
        title: "Usuario degradado",
        description: `${userEmail} ahora es usuario regular`
      });
      
      fetchUsers();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo degradar al usuario",
        variant: "destructive"
      });
    }
  };

  const deleteUser = async (user: UserProfile) => {
    if (!isAdmin) {
      toast({
        title: "Sin permisos",
        description: "Solo los administradores pueden eliminar usuarios",
        variant: "destructive"
      });
      return;
    }

    if (user.email === currentUser?.email) {
      toast({
        title: "Error",
        description: "No puedes eliminarte a ti mismo",
        variant: "destructive"
      });
      return;
    }

    if (!confirm(`¿Eliminar permanentemente a ${user.email}?`)) return;

    try {
      // Primero eliminar el perfil (esto eliminará automáticamente los permisos por CASCADE)
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('user_id', user.user_id);

      if (error) throw error;

      toast({
        title: "Usuario eliminado",
        description: `${user.email} ha sido eliminado del sistema`
      });
      
      fetchUsers();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar al usuario",
        variant: "destructive"
      });
    }
  };

  const handleManagePermissions = (user: UserProfile) => {
    if (!isAdmin) {
      toast({
        title: "Sin permisos",
        description: "Solo los administradores pueden gestionar permisos",
        variant: "destructive"
      });
      return;
    }

    setSelectedUser(user);
    setShowPermissions(true);
  };

  if (showPermissions && selectedUser) {
    return (
      <PermissionManager
        user={selectedUser}
        onBack={() => {
          setShowPermissions(false);
          setSelectedUser(null);
          fetchUsers();
        }}
      />
    );
  }

  const adminCount = users.filter(u => u.isAdmin).length;
  const regularCount = users.filter(u => !u.isAdmin).length;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Gestión de Usuarios</h2>
          <p className="text-muted-foreground">
            {adminCount} administradores, {regularCount} usuarios regulares
          </p>
        </div>
        {isAdmin && <CreateUserDialog onUserCreated={fetchUsers} />}
      </div>

      {!isAdmin && (
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Acceso limitado: Solo puedes ver los usuarios. Las funciones de gestión están restringidas a administradores.
          </AlertDescription>
        </Alert>
      )}

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Buscar usuarios por email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            currentUserEmail={currentUser?.email || ''}
            isCurrentUserAdmin={isAdmin}
            onPromoteToAdmin={promoteToAdmin}
            onDemoteFromAdmin={demoteFromAdmin}
            onDeleteUser={deleteUser}
            onManagePermissions={handleManagePermissions}
          />
        ))}
      </div>

      {filteredUsers.length === 0 && searchTerm && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No se encontraron usuarios que coincidan con "{searchTerm}"
          </p>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
