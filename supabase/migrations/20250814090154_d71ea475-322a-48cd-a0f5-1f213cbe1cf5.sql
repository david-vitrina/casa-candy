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

-- Función para degrader admin a usuario
CREATE OR REPLACE FUNCTION public.demote_admin_to_user(user_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  UPDATE public.profiles 
  SET role = 'user' 
  WHERE email = user_email AND role = 'admin';
  
  -- Eliminar todos los permisos específicos cuando se degrada
  DELETE FROM public.user_permissions 
  WHERE user_id = (SELECT user_id FROM public.profiles WHERE email = user_email);
END;
$function$

-- Función para verificar permisos
CREATE OR REPLACE FUNCTION public.has_permission(check_user_id uuid, permission text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  -- Los admins tienen todos los permisos automáticamente
  SELECT CASE 
    WHEN EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = check_user_id AND role = 'admin'
    ) THEN true
    ELSE EXISTS (
      SELECT 1 FROM public.user_permissions 
      WHERE user_id = check_user_id AND permission_type = permission
    )
  END;
$function$

-- Función para otorgar permisos
CREATE OR REPLACE FUNCTION public.grant_permission(target_user_email text, permission text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  target_user_id UUID;
BEGIN
  -- Obtener el user_id del email
  SELECT user_id INTO target_user_id 
  FROM public.profiles 
  WHERE email = target_user_email;
  
  IF target_user_id IS NULL THEN
    RAISE EXCEPTION 'Usuario no encontrado';
  END IF;
  
  -- Insertar el permiso (ON CONFLICT DO NOTHING evita duplicados)
  INSERT INTO public.user_permissions (user_id, permission_type, granted_by)
  VALUES (target_user_id, permission, auth.uid())
  ON CONFLICT (user_id, permission_type) DO NOTHING;
END;
$function$

-- Función para revocar permisos
CREATE OR REPLACE FUNCTION public.revoke_permission(target_user_email text, permission text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  target_user_id UUID;
BEGIN
  -- Obtener el user_id del email
  SELECT user_id INTO target_user_id 
  FROM public.profiles 
  WHERE email = target_user_email;
  
  IF target_user_id IS NULL THEN
    RAISE EXCEPTION 'Usuario no encontrado';
  END IF;
  
  -- Eliminar el permiso
  DELETE FROM public.user_permissions 
  WHERE user_id = target_user_id AND permission_type = permission;
END;
$function$

-- Políticas RLS para user_permissions
CREATE POLICY "Admins can view all permissions" 
ON public.user_permissions 
FOR SELECT 
USING (is_admin(auth.uid()));

CREATE POLICY "Admins can insert permissions" 
ON public.user_permissions 
FOR INSERT 
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can update permissions" 
ON public.user_permissions 
FOR UPDATE 
USING (is_admin(auth.uid()));

CREATE POLICY "Admins can delete permissions" 
ON public.user_permissions 
FOR DELETE 
USING (is_admin(auth.uid()));

-- Políticas RLS adicionales para profiles para que admins puedan ver todos los perfiles
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (is_admin(auth.uid()));

CREATE POLICY "Admins can update user roles" 
ON public.profiles 
FOR UPDATE 
USING (is_admin(auth.uid()));