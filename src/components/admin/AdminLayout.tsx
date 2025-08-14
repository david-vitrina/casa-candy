import { useState } from 'react';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import DishManagement from './DishManagement';
import UserManagement from './UserManagement';

const AdminLayout = () => {
  const { signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('dishes');

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

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="dishes">Gestión de Platos</TabsTrigger>
            <TabsTrigger value="users">Gestión de Usuarios</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dishes">
            <DishManagement />
          </TabsContent>
          
          <TabsContent value="users">
            <UserManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminLayout;