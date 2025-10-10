-- Crear tabla para configuración del sitio
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para site_settings
CREATE POLICY "Public can view site settings"
  ON public.site_settings
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can update site settings"
  ON public.site_settings
  FOR UPDATE
  USING (is_admin(auth.uid()));

CREATE POLICY "Admins can insert site settings"
  ON public.site_settings
  FOR INSERT
  WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Users with edit_dishes permission can update settings"
  ON public.site_settings
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_permissions
      WHERE user_id = auth.uid()
      AND permission_type = 'edit_dishes'
    )
  );

-- Insertar configuración inicial del hero
INSERT INTO public.site_settings (key, value)
VALUES (
  'hero_background',
  jsonb_build_object(
    'image_url', '/placeholder.svg',
    'overlay_opacity', 0.3,
    'gradient_enabled', true
  )
)
ON CONFLICT (key) DO NOTHING;

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_site_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar updated_at
CREATE TRIGGER update_site_settings_timestamp
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_site_settings_updated_at();