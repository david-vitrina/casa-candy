-- Crear tabla de permisos granulares
CREATE TABLE public.user_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  permission_type TEXT NOT NULL CHECK (permission_type IN ('edit_dishes', 'manage_availability', 'delete_dishes', 'manage_users')),
  granted_by UUID REFERENCES public.profiles(user_id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, permission_type)
);

-- Habilitar RLS en la nueva tabla
ALTER TABLE public.user_permissions ENABLE ROW LEVEL SECURITY;