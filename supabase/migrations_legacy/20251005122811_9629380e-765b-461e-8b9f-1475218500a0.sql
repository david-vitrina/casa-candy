-- Actualizar trigger para manejar tenants en nuevos usuarios

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_count INTEGER;
  default_tenant_id UUID;
BEGIN
  -- Obtener el tenant por defecto (David Burger)
  SELECT id INTO default_tenant_id 
  FROM public.tenants 
  WHERE slug = 'david-burger' 
  LIMIT 1;
  
  IF default_tenant_id IS NULL THEN
    RAISE EXCEPTION 'No se encontró el tenant por defecto';
  END IF;
  
  -- Contar usuarios existentes en este tenant
  SELECT COUNT(*) INTO user_count 
  FROM public.tenant_memberships 
  WHERE tenant_id = default_tenant_id;
  
  -- Solo el primer usuario del tenant será admin, los demás serán usuarios normales
  IF user_count = 0 THEN
    -- Crear perfil de admin
    INSERT INTO public.profiles (user_id, email, role, tenant_id)
    VALUES (NEW.id, NEW.email, 'admin', default_tenant_id);
    
    -- Crear membresía como admin
    INSERT INTO public.tenant_memberships (tenant_id, user_id, role)
    VALUES (default_tenant_id, NEW.id, 'admin');
  ELSE
    -- Crear perfil de usuario normal
    INSERT INTO public.profiles (user_id, email, role, tenant_id)
    VALUES (NEW.id, NEW.email, 'user', default_tenant_id);
    
    -- Crear membresía como usuario
    INSERT INTO public.tenant_memberships (tenant_id, user_id, role)
    VALUES (default_tenant_id, NEW.id, 'user');
  END IF;
  
  RETURN NEW;
END;
$$;