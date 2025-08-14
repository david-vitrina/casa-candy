import { useState, useEffect, useCallback } from 'react';
import { indexedDBService } from '@/services/indexedDB';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useOfflineSync = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const { toast } = useToast();

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      syncPendingChanges();
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: "Modo sin conexión",
        description: "Los cambios se sincronizarán cuando recuperes la conexión.",
        variant: "default"
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial sync if online
    if (navigator.onLine) {
      syncPendingChanges();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const syncPendingChanges = useCallback(async () => {
    if (!isOnline || isSyncing) return;

    setIsSyncing(true);
    setSyncStatus('syncing');

    try {
      const syncQueue = await indexedDBService.getSyncQueue();
      
      if (syncQueue.length === 0) {
        setSyncStatus('idle');
        return;
      }

      // Process sync queue
      for (const item of syncQueue) {
        try {
          switch (item.operation) {
            case 'INSERT':
              await supabase.from(item.table).insert(item.data);
              break;
            case 'UPDATE':
              await supabase.from(item.table).update(item.data).eq('id', item.data.id);
              break;
            case 'DELETE':
              await supabase.from(item.table).delete().eq('id', item.data.id);
              break;
          }
          
          // Remove successfully synced item
          await indexedDBService.removeFromSyncQueue(item.id);
        } catch (error) {
          console.error('Error syncing item:', error);
          // Keep failed items in queue for retry
        }
      }

      setSyncStatus('success');
      toast({
        title: "Sincronización completada",
        description: "Todos los cambios han sido sincronizados.",
        variant: "default"
      });

    } catch (error) {
      console.error('Sync error:', error);
      setSyncStatus('error');
      toast({
        title: "Error de sincronización",
        description: "Algunos cambios no pudieron sincronizarse. Se reintentará automáticamente.",
        variant: "destructive"
      });
    } finally {
      setIsSyncing(false);
      // Reset status after 3 seconds
      setTimeout(() => setSyncStatus('idle'), 3000);
    }
  }, [isOnline, isSyncing, toast]);

  const queueOperation = useCallback(async (
    operation: 'INSERT' | 'UPDATE' | 'DELETE',
    table: string,
    data: any
  ) => {
    await indexedDBService.addToSyncQueue(operation, table, data);
    
    if (isOnline) {
      // Try to sync immediately if online
      syncPendingChanges();
    } else {
      toast({
        title: "Cambio guardado localmente",
        description: "Se sincronizará cuando recuperes la conexión.",
        variant: "default"
      });
    }
  }, [isOnline, syncPendingChanges, toast]);

  return {
    isOnline,
    isSyncing,
    syncStatus,
    syncPendingChanges,
    queueOperation
  };
};
