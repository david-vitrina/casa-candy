-- Crear enum para tipos de menú diario
CREATE TYPE public.daily_menu_type AS ENUM ('primero', 'segundo');

-- Agregar nueva columna daily_menu_type a dishes
ALTER TABLE public.dishes 
ADD COLUMN daily_menu_type public.daily_menu_type;

-- Migrar datos existentes: platos con is_daily_menu = true se marcan como 'primero' por defecto
UPDATE public.dishes 
SET daily_menu_type = 'primero' 
WHERE is_daily_menu = true;

-- Eliminar la columna antigua is_daily_menu
ALTER TABLE public.dishes 
DROP COLUMN is_daily_menu;

-- Crear tabla para configuración del menú diario
CREATE TABLE public.daily_menu_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  price NUMERIC NOT NULL DEFAULT 12.00,
  is_active BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS en daily_menu_settings
ALTER TABLE public.daily_menu_settings ENABLE ROW LEVEL SECURITY;

-- RLS: Todos pueden ver la configuración del menú diario
CREATE POLICY "Anyone can view daily menu settings"
ON public.daily_menu_settings
FOR SELECT
USING (true);

-- RLS: Solo admins pueden actualizar la configuración
CREATE POLICY "Admins can update daily menu settings"
ON public.daily_menu_settings
FOR UPDATE
USING (public.is_admin(auth.uid()));

-- RLS: Solo admins pueden insertar configuración
CREATE POLICY "Admins can insert daily menu settings"
ON public.daily_menu_settings
FOR INSERT
WITH CHECK (public.is_admin(auth.uid()));

-- RLS: Solo admins pueden eliminar configuración
CREATE POLICY "Admins can delete daily menu settings"
ON public.daily_menu_settings
FOR DELETE
USING (public.is_admin(auth.uid()));

-- Crear trigger para actualizar updated_at automáticamente
CREATE TRIGGER update_daily_menu_settings_updated_at
BEFORE UPDATE ON public.daily_menu_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_site_settings_updated_at();

-- Insertar configuración inicial
INSERT INTO public.daily_menu_settings (price, is_active)
VALUES (12.00, true);