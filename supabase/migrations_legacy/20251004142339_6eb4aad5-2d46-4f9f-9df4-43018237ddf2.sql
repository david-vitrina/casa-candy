-- Fase 1: Infraestructura Base Multitenant

-- 1. Crear tipo enum para estado de tenant
CREATE TYPE tenant_status AS ENUM ('active', 'inactive', 'suspended');

-- 2. Crear tabla de tenants
CREATE TABLE public.tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  domain TEXT UNIQUE,
  logo_url TEXT,
  primary_color TEXT DEFAULT '#8B4513',
  secondary_color TEXT DEFAULT '#D4AF37',
  accent_color TEXT DEFAULT '#FFD700',
  status tenant_status DEFAULT 'active',
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. Habilitar RLS en tenants
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;

-- 4. Agregar tenant_id a tablas existentes (nullable por ahora)
ALTER TABLE public.dishes 
ADD COLUMN tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;

ALTER TABLE public.profiles 
ADD COLUMN tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;

ALTER TABLE public.user_permissions 
ADD COLUMN tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;

-- 5. Crear tabla de membresías de tenant
CREATE TABLE public.tenant_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(tenant_id, user_id)
);

-- 6. Habilitar RLS en tenant_memberships
ALTER TABLE public.tenant_memberships ENABLE ROW LEVEL SECURITY;

-- 7. Crear el tenant principal "David Burger"
INSERT INTO public.tenants (id, name, slug, primary_color, secondary_color, accent_color, settings)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'David Burger',
  'david-burger',
  '#8B4513',
  '#D4AF37', 
  '#FFD700',
  '{"theme": "spanish", "features": {"pwa": true, "offline": true}}'::jsonb
);

-- 8. Migrar datos existentes al tenant de David Burger
UPDATE public.dishes 
SET tenant_id = '00000000-0000-0000-0000-000000000001'
WHERE tenant_id IS NULL;

UPDATE public.profiles 
SET tenant_id = '00000000-0000-0000-0000-000000000001'
WHERE tenant_id IS NULL;

UPDATE public.user_permissions 
SET tenant_id = '00000000-0000-0000-0000-000000000001'
WHERE tenant_id IS NULL;

-- 9. Migrar usuarios existentes a tenant_memberships
INSERT INTO public.tenant_memberships (tenant_id, user_id, role)
SELECT 
  '00000000-0000-0000-0000-000000000001',
  user_id,
  role
FROM public.profiles
WHERE tenant_id = '00000000-0000-0000-0000-000000000001'
ON CONFLICT (tenant_id, user_id) DO NOTHING;

-- 10. Crear función para obtener tenant_id del usuario actual
CREATE OR REPLACE FUNCTION public.get_user_tenant_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT tenant_id 
  FROM public.tenant_memberships 
  WHERE user_id = auth.uid() 
  LIMIT 1;
$$;

-- 11. Crear función para verificar si usuario pertenece a tenant
CREATE OR REPLACE FUNCTION public.user_belongs_to_tenant(check_tenant_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.tenant_memberships 
    WHERE user_id = auth.uid() 
    AND tenant_id = check_tenant_id
  );
$$;

-- 12. Crear índices para mejor rendimiento
CREATE INDEX idx_dishes_tenant_id ON public.dishes(tenant_id);
CREATE INDEX idx_profiles_tenant_id ON public.profiles(tenant_id);
CREATE INDEX idx_user_permissions_tenant_id ON public.user_permissions(tenant_id);
CREATE INDEX idx_tenant_memberships_user_id ON public.tenant_memberships(user_id);
CREATE INDEX idx_tenant_memberships_tenant_id ON public.tenant_memberships(tenant_id);

-- 13. Trigger para actualizar updated_at en tenants
CREATE TRIGGER update_tenants_updated_at
BEFORE UPDATE ON public.tenants
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- 14. Políticas RLS básicas para tenants (solo lectura por ahora)
CREATE POLICY "Users can view their tenant"
ON public.tenants
FOR SELECT
USING (id IN (
  SELECT tenant_id FROM public.tenant_memberships WHERE user_id = auth.uid()
));

-- 15. Políticas RLS para tenant_memberships
CREATE POLICY "Users can view their own memberships"
ON public.tenant_memberships
FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Admins can manage memberships"
ON public.tenant_memberships
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.tenant_memberships tm
    WHERE tm.user_id = auth.uid() 
    AND tm.tenant_id = tenant_memberships.tenant_id
    AND tm.role = 'admin'
  )
);