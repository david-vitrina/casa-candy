-- Función para otorgar permisos
CREATE OR REPLACE FUNCTION public.grant_permission(target_user_email text, permission text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
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
$$;

-- Función para revocar permisos
CREATE OR REPLACE FUNCTION public.revoke_permission(target_user_email text, permission text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
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
$$;