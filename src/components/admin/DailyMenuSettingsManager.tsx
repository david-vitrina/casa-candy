import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useDailyMenuSettings } from '@/hooks/useDailyMenuSettings';
import { useMenuItems } from '@/hooks/useMenuItems';
import { AlertCircle, DollarSign, TrendingUp } from 'lucide-react';

const DailyMenuSettingsManager = () => {
  const { settings, loading, updatePrice, toggleActive } = useDailyMenuSettings();
  const { dishes } = useMenuItems();
  const [priceInput, setPriceInput] = useState('');

  if (loading) {
    return <div className="text-center py-8">Cargando...</div>;
  }

  if (!settings) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          No se pudo cargar la configuración del menú diario.
        </AlertDescription>
      </Alert>
    );
  }

  const primeros = dishes.filter(d => d.daily_menu_type === 'primero' && d.available);
  const segundos = dishes.filter(d => d.daily_menu_type === 'segundo' && d.available);

  const handleUpdatePrice = () => {
    const newPrice = parseFloat(priceInput);
    if (isNaN(newPrice) || newPrice <= 0) {
      return;
    }
    updatePrice(newPrice);
    setPriceInput('');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Configuración del Menú Diario
          </CardTitle>
          <CardDescription>
            Gestiona el precio y disponibilidad del menú diario
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Estado activo/inactivo */}
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="space-y-0.5">
              <Label htmlFor="active-switch" className="text-base">
                Menú diario activo
              </Label>
              <p className="text-sm text-muted-foreground">
                {settings.is_active ? 'Visible para los clientes' : 'Oculto para los clientes'}
              </p>
            </div>
            <Switch
              id="active-switch"
              checked={settings.is_active}
              onCheckedChange={toggleActive}
            />
          </div>

          {/* Precio actual */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border-2 border-toasted-brown/20 rounded-lg bg-gradient-to-r from-toasted-brown/5 to-warm-amber/5">
              <div>
                <Label className="text-sm text-muted-foreground">Precio actual</Label>
                <p className="text-3xl font-bold text-toasted-brown">
                  €{settings.price.toFixed(2)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-toasted-brown/50" />
            </div>

            {/* Actualizar precio */}
            <div className="space-y-2">
              <Label htmlFor="price-input">Nuevo precio</Label>
              <div className="flex gap-2">
                <Input
                  id="price-input"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="12.00"
                  value={priceInput}
                  onChange={(e) => setPriceInput(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  onClick={handleUpdatePrice}
                  disabled={!priceInput || parseFloat(priceInput) <= 0}
                  className="bg-gradient-to-r from-toasted-brown to-warm-amber text-white"
                >
                  Actualizar
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas de platos */}
      <Card>
        <CardHeader>
          <CardTitle>Platos del Menú Diario</CardTitle>
          <CardDescription>
            Estado actual de los platos disponibles
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card className={primeros.length > 5 ? 'border-destructive' : ''}>
              <CardContent className="p-6 text-center">
                <p className="text-sm text-muted-foreground mb-2">Primeros</p>
                <p className="text-4xl font-bold">
                  <span className={primeros.length > 5 ? 'text-destructive' : 'text-toasted-brown'}>
                    {primeros.length}
                  </span>
                  <span className="text-muted-foreground text-2xl">/5</span>
                </p>
              </CardContent>
            </Card>

            <Card className={segundos.length > 5 ? 'border-destructive' : ''}>
              <CardContent className="p-6 text-center">
                <p className="text-sm text-muted-foreground mb-2">Segundos</p>
                <p className="text-4xl font-bold">
                  <span className={segundos.length > 5 ? 'text-destructive' : 'text-toasted-brown'}>
                    {segundos.length}
                  </span>
                  <span className="text-muted-foreground text-2xl">/5</span>
                </p>
              </CardContent>
            </Card>
          </div>

          {(primeros.length > 5 || segundos.length > 5) && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Se recomienda tener máximo 5 platos por categoría. 
                Actualmente hay {primeros.length > 5 ? `${primeros.length} primeros` : ''} 
                {primeros.length > 5 && segundos.length > 5 ? ' y ' : ''}
                {segundos.length > 5 ? `${segundos.length} segundos` : ''}.
              </AlertDescription>
            </Alert>
          )}

          {primeros.length === 0 && segundos.length === 0 && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No hay platos asignados al menú diario. Ve a la gestión de platos para asignarlos.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DailyMenuSettingsManager;
