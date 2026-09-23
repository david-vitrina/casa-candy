-- Función para degradar admin a usuario
CREATE OR REPLACE FUNCTION public.demote_admin_to_user(user_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  UPDATE public.profiles 
  SET role = 'user' 
  WHERE email = user_email AND role = 'admin';
  
  -- Eliminar todos los permisos específicos cuando se degrada
  DELETE FROM public.user_permissions 
  WHERE user_id = (SELECT user_id FROM public.profiles WHERE email = user_email);
END;
$$;

-- Función para verificar permisos
CREATE OR REPLACE FUNCTION public.has_permission(check_user_id uuid, permission text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
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
$$;