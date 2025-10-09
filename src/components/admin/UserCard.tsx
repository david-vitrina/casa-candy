
import { Shield, User, Trash2, Settings, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  created_at: string;
  updated_at: string;
  permissions?: string[];
  isAdmin?: boolean;
}

interface UserCardProps {
  user: UserProfile;
  currentUserEmail: string;
  isCurrentUserAdmin: boolean;
  onPromoteToAdmin: (userId: string, email: string) => void;
  onDemoteFromAdmin: (userId: string, email: string) => void;
  onDeleteUser: (user: UserProfile) => void;
  onManagePermissions: (user: UserProfile) => void;
}

const UserCard = ({
  user,
  currentUserEmail,
  isCurrentUserAdmin,
  onPromoteToAdmin,
  onDemoteFromAdmin,
  onDeleteUser,
  onManagePermissions
}: UserCardProps) => {
  const isCurrentUser = user.email === currentUserEmail;
  const isAdmin = user.isAdmin || false;

  const getPermissionLabel = (permission: string) => {
    const labels = {
      edit_dishes: 'Editar Platos',
      manage_availability: 'Gestionar Disponibilidad',
      delete_dishes: 'Eliminar Platos',
      manage_users: 'Gestionar Usuarios'
    };
    return labels[permission as keyof typeof labels] || permission;
  };

  return (
    <Card className={`relative ${isCurrentUser ? 'ring-2 ring-spanish-red' : ''}`}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            {isAdmin ? (
              <Shield className="w-5 h-5 text-spanish-red" />
            ) : (
              <User className="w-5 h-5 text-muted-foreground" />
            )}
            <CardTitle className="text-lg">{user.email}</CardTitle>
          </div>
          <Badge variant={isAdmin ? "destructive" : "secondary"}>
            {isAdmin ? 'Admin' : 'Usuario'}
          </Badge>
        </div>
        
        {isCurrentUser && (
          <Badge variant="outline" className="w-fit">
            Eres tú
          </Badge>
        )}

        {user.permissions && user.permissions.length > 0 && (
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Permisos:</p>
            <div className="flex flex-wrap gap-1">
              {user.permissions.map((permission) => (
                <Badge key={permission} variant="outline" className="text-xs">
                  {getPermissionLabel(permission)}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <p className="text-sm text-muted-foreground">
          Registrado: {new Date(user.created_at).toLocaleDateString()}
        </p>
      </CardHeader>

      <CardContent>
        {isCurrentUserAdmin ? (
          <div className="flex flex-wrap gap-2">
            {!isAdmin ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPromoteToAdmin(user.user_id, user.email)}
                className="flex-1"
              >
                <ChevronUp className="w-4 h-4 mr-1" />
                Promover
              </Button>
            ) : (
              !isCurrentUser && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDemoteFromAdmin(user.user_id, user.email)}
                  className="flex-1"
                >
                  <ChevronDown className="w-4 h-4 mr-1" />
                  Degradar
                </Button>
              )
            )}

            {!isAdmin && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onManagePermissions(user)}
              >
                <Settings className="w-4 h-4" />
              </Button>
            )}

            {!isCurrentUser && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDeleteUser(user)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        ) : (
          <div className="text-center">
            <Badge variant="outline" className="text-xs">
              Solo lectura
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserCard;
