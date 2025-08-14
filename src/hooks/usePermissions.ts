import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export type Permission = 'edit_dishes' | 'manage_availability' | 'delete_dishes' | 'manage_users';

export const usePermissions = () => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    if (!user) {
      setPermissions([]);
      setLoading(false);
      return;
    }

    // Los admins tienen todos los permisos automáticamente
    if (isAdmin) {
      setPermissions(['edit_dishes', 'manage_availability', 'delete_dishes', 'manage_users']);
      setLoading(false);
      return;
    }

    fetchUserPermissions();
  }, [user, isAdmin]);

  const fetchUserPermissions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_permissions')
        .select('permission_type')
        .eq('user_id', user.id);

      if (error) throw error;

      const userPermissions = data?.map(p => p.permission_type as Permission) || [];
      setPermissions(userPermissions);
    } catch (error) {
      console.error('Error fetching permissions:', error);
      setPermissions([]);
    } finally {
      setLoading(false);
    }
  };

  const hasPermission = (permission: Permission): boolean => {
    return isAdmin || permissions.includes(permission);
  };

  const hasAnyPermission = (permissionList: Permission[]): boolean => {
    return isAdmin || permissionList.some(p => permissions.includes(p));
  };

  const canEditDishes = hasPermission('edit_dishes');
  const canManageAvailability = hasPermission('manage_availability');
  const canDeleteDishes = hasPermission('delete_dishes');
  const canManageUsers = hasPermission('manage_users');

  return {
    permissions,
    loading,
    hasPermission,
    hasAnyPermission,
    canEditDishes,
    canManageAvailability,
    canDeleteDishes,
    canManageUsers,
    isAdmin,
    refetch: fetchUserPermissions
  };
};