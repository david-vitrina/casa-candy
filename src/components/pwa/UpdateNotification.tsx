import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, X } from 'lucide-react';

export const UpdateNotification = () => {
  const [showUpdate, setShowUpdate] = useState(false);
  
  useEffect(() => {
    // Listen for service worker updates
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        setShowUpdate(true);
      });
    }
  }, []);

  const handleUpdate = () => {
    window.location.reload();
  };

  const handleDismiss = () => {
    setShowUpdate(false);
  };

  if (!showUpdate) {
    return null;
  }

  return (
    <Card className="fixed top-4 left-4 right-4 z-50 mx-auto max-w-sm shadow-lg border-primary/20 bg-background/95 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-primary" />
            <CardTitle className="text-sm">Actualización disponible</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription className="text-xs">
          Nueva versión de la app disponible con mejoras y correcciones
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0 flex gap-2">
        <Button 
          onClick={handleUpdate}
          size="sm"
          className="flex-1"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Actualizar
        </Button>
        <Button 
          onClick={handleDismiss}
          variant="outline"
          size="sm"
        >
          Después
        </Button>
      </CardContent>
    </Card>
  );
};