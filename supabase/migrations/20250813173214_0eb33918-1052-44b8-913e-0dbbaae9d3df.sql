-- CORRECCIÓN CRÍTICA: Eliminar función insegura que hace admin a todos
-- La función actual en handle_new_user hace que TODOS sean admin automáticamente

-- Primero, eliminar la función insegura existente
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Crear función segura que solo hace al primer usuario admin
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = 'public'  -- Fijar search_path para prevenir inyección
AS $$
DECLARE
  user_count INTEGER;
BEGIN
  -- Contar usuarios existentes
  SELECT COUNT(*) INTO user_count FROM public.profiles;
  
  -- Solo el primer usuario será admin, los demás serán usuarios normales
  IF user_count = 0 THEN
    INSERT INTO public.profiles (user_id, email, role)
    VALUES (NEW.id, NEW.email, 'admin');
  ELSE
    INSERT INTO public.profiles (user_id, email, role)
    VALUES (NEW.id, NEW.email, 'user');
  END IF;
  
  RETURN NEW;
END;
$$;

-- Corregir función is_admin para mayor seguridad con search_path fijo
DROP FUNCTION IF EXISTS public.is_admin(uuid);

CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = 'public'  -- Fijar search_path para prevenir inyección
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.user_id = is_admin.user_id 
    AND profiles.role = 'admin'
  );
$$;

-- Corregir función update_updated_at_column con search_path
DROP FUNCTION IF EXISTS public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'  -- Fijar search_path para prevenir inyección
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Recrear el trigger para handle_new_user
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();