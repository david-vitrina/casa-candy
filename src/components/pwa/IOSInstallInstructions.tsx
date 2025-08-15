import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Share, Plus, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface IOSInstallInstructionsProps {
  isOpen: boolean;
  onClose: () => void;
  isIPad?: boolean;
}

export const IOSInstallInstructions = ({ isOpen, onClose, isIPad = false }: IOSInstallInstructionsProps) => {
  const deviceName = isIPad ? 'iPad' : 'iPhone';
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">
              Instalar David Burger
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription className="text-sm text-muted-foreground">
            Instala la app en tu {deviceName} para acceso rápido y funcionalidad offline
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="text-sm space-y-3">
            <div className="flex items-start gap-3">
              <Badge variant="outline" className="mt-0.5 flex-shrink-0">
                1
              </Badge>
              <div>
                <p className="font-medium">Toca el botón de compartir</p>
                <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                  <Share className="h-4 w-4" />
                  <span>En la barra inferior de Safari</span>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Badge variant="outline" className="mt-0.5 flex-shrink-0">
                2
              </Badge>
              <div>
                <p className="font-medium">Selecciona "Añadir a inicio"</p>
                <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                  <Plus className="h-4 w-4" />
                  <span>Desplázate hacia abajo en el menú</span>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Badge variant="outline" className="mt-0.5 flex-shrink-0">
                3
              </Badge>
              <div>
                <p className="font-medium">Confirma la instalación</p>
                <p className="text-muted-foreground mt-1">
                  Toca "Añadir" en la esquina superior derecha
                </p>
              </div>
            </div>
          </div>

          <div className="bg-muted/50 rounded-lg p-3 mt-4">
            <p className="text-xs text-muted-foreground">
              💡 Una vez instalada, encontrarás David Burger en tu pantalla de inicio como cualquier otra app.
            </p>
          </div>
        </div>

        <div className="flex gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Entendido
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};