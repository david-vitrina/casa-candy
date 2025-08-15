import { useOfflineSync } from '@/hooks/useOfflineSync';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export const OfflineIndicator = () => {
  const { isOnline, isSyncing, syncStatus } = useOfflineSync();

  if (isOnline && syncStatus === 'idle') {
    return null;
  }

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 md:top-4 md:right-4 md:left-auto md:transform-none md:translate-x-0">
      <Badge
        variant={isOnline ? "default" : "secondary"}
        className={cn(
          "flex items-center gap-2 transition-all duration-300 px-3 py-2 text-sm md:text-xs md:px-2 md:py-1",
          !isOnline && "bg-muted text-muted-foreground",
          isSyncing && "bg-primary/10 text-primary",
          syncStatus === 'error' && "bg-destructive/10 text-destructive"
        )}
      >
        {isSyncing ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : isOnline ? (
          <Wifi className="h-3 w-3" />
        ) : (
          <WifiOff className="h-3 w-3" />
        )}
        
        <span className="text-xs">
          {isSyncing ? 'Sincronizando...' : 
           !isOnline ? 'Sin conexión' :
           syncStatus === 'success' ? 'Sincronizado' :
           syncStatus === 'error' ? 'Error de sync' : 'Online'}
        </span>
      </Badge>
    </div>
  );
};