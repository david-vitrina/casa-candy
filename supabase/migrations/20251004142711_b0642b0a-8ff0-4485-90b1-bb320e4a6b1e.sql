-- Fase 2: Actualización completa de políticas RLS para aislamiento por tenant

-- 1. Actualizar función is_admin para incluir tenant
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.tenant_memberships
    WHERE tenant_memberships.user_id = is_admin.user_id 
    AND tenant_memberships.role = 'admin'
  );
$$;

-- 2. Crear función para verificar si es admin del tenant específico
CREATE OR REPLACE FUNCTION public.is_tenant_admin(check_tenant_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.tenant_memberships
    WHERE user_id = auth.uid()
    AND tenant_id = check_tenant_id
    AND role = 'admin'
  );
$$;

-- 3. Actualizar función has_permission para incluir tenant
CREATE OR REPLACE FUNCTION public.has_permission(check_user_id uuid, permission text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT CASE 
    WHEN EXISTS (
      SELECT 1 FROM public.tenant_memberships 
      WHERE user_id = check_user_id AND role = 'admin'
    ) THEN true
    ELSE EXISTS (
      SELECT 1 FROM public.user_permissions 
      WHERE user_id = check_user_id 
      AND permission_type = permission
      AND tenant_id = public.get_user_tenant_id()
    )
  END;
$$;

-- ===== POLÍTICAS RLS PARA DISHES =====

-- Eliminar políticas antiguas
DROP POLICY IF EXISTS "Dishes are viewable by everyone" ON public.dishes;
DROP POLICY IF EXISTS "Admins can insert dishes" ON public.dishes;
DROP POLICY IF EXISTS "Admins can update dishes" ON public.dishes;
DROP POLICY IF EXISTS "Admins can delete dishes" ON public.dishes;
DROP POLICY IF EXISTS "Users with edit_dishes can insert dishes" ON public.dishes;
DROP POLICY IF EXISTS "Users with edit_dishes can update dish details" ON public.dishes;
DROP POLICY IF EXISTS "Users with manage_availability can update dish availability" ON public.dishes;
DROP POLICY IF EXISTS "Users with delete_dishes can delete dishes" ON public.dishes;

-- Nuevas políticas con aislamiento por tenant
CREATE POLICY "Dishes are viewable by tenant"
ON public.dishes
FOR SELECT
USING (
  tenant_id IN (
    SELECT tenant_id FROM public.tenant_memberships WHERE user_id = auth.uid()
  )
  OR tenant_id IS NULL -- Temporal para compatibilidad
);

CREATE POLICY "Tenant admins can insert dishes"
ON public.dishes
FOR INSERT
WITH CHECK (
  public.is_tenant_admin(tenant_id)
  OR public.has_permission(auth.uid(), 'edit_dishes')
);

CREATE POLICY "Tenant admins can update dishes"
ON public.dishes
FOR UPDATE
USING (
  public.is_tenant_admin(tenant_id)
  OR public.has_permission(auth.uid(), 'edit_dishes')
  OR public.has_permission(auth.uid(), 'manage_availability')
);

CREATE POLICY "Tenant admins can delete dishes"
ON public.dishes
FOR DELETE
USING (
  public.is_tenant_admin(tenant_id)
  OR public.has_permission(auth.uid(), 'delete_dishes')
);

-- ===== POLÍTICAS RLS PARA PROFILES =====

-- Eliminar políticas antiguas
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update user roles" ON public.profiles;

-- Nuevas políticas con aislamiento por tenant
CREATE POLICY "Users can view profiles in their tenant"
ON public.profiles
FOR SELECT
USING (
  tenant_id IN (
    SELECT tenant_id FROM public.tenant_memberships WHERE user_id = auth.uid()
  )
  AND (
    user_id = auth.uid() 
    OR public.is_tenant_admin(tenant_id)
  )
);

CREATE POLICY "Users can insert their own profile"
ON public.profiles
FOR INSERT
WITH CHECK (
  auth.uid() = user_id
  AND tenant_id = public.get_user_tenant_id()
);

CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
USING (
  auth.uid() = user_id
  AND tenant_id = public.get_user_tenant_id()
);

CREATE POLICY "Tenant admins can update profiles"
ON public.profiles
FOR UPDATE
USING (
  public.is_tenant_admin(tenant_id)
);

-- ===== POLÍTICAS RLS PARA USER_PERMISSIONS =====

-- Eliminar políticas antiguas
DROP POLICY IF EXISTS "Users can view their own permissions" ON public.user_permissions;
DROP POLICY IF EXISTS "Admins can view all permissions" ON public.user_permissions;
DROP POLICY IF EXISTS "Admins can insert permissions" ON public.user_permissions;
DROP POLICY IF EXISTS "Admins can update permissions" ON public.user_permissions;
DROP POLICY IF EXISTS "Admins can delete permissions" ON public.user_permissions;

-- Nuevas políticas con aislamiento por tenant
CREATE POLICY "Users can view their own permissions in tenant"
ON public.user_permissions
FOR SELECT
USING (
  auth.uid() = user_id
  AND tenant_id = public.get_user_tenant_id()
);

CREATE POLICY "Tenant admins can view all permissions"
ON public.user_permissions
FOR SELECT
USING (
  public.is_tenant_admin(tenant_id)
);

CREATE POLICY "Tenant admins can insert permissions"
ON public.user_permissions
FOR INSERT
WITH CHECK (
  public.is_tenant_admin(tenant_id)
);

CREATE POLICY "Tenant admins can update permissions"
ON public.user_permissions
FOR UPDATE
USING (
  public.is_tenant_admin(tenant_id)
);

CREATE POLICY "Tenant admins can delete permissions"
ON public.user_permissions
FOR DELETE
USING (
  public.is_tenant_admin(tenant_id)
);

-- ===== POLÍTICAS RLS PARA TENANTS =====

-- Actualizar política de tenants
DROP POLICY IF EXISTS "Users can view their tenant" ON public.tenants;

CREATE POLICY "Users can view their tenant"
ON public.tenants
FOR SELECT
USING (
  id IN (
    SELECT tenant_id FROM public.tenant_memberships WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Tenant admins can update their tenant"
ON public.tenants
FOR UPDATE
USING (
  public.is_tenant_admin(id)
);

-- ===== POLÍTICAS RLS PARA TENANT_MEMBERSHIPS =====

DROP POLICY IF EXISTS "Users can view their own memberships" ON public.tenant_memberships;
DROP POLICY IF EXISTS "Admins can manage memberships" ON public.tenant_memberships;

CREATE POLICY "Users can view memberships in their tenant"
ON public.tenant_memberships
FOR SELECT
USING (
  user_id = auth.uid()
  OR public.is_tenant_admin(tenant_id)
);

CREATE POLICY "Tenant admins can insert memberships"
ON public.tenant_memberships
FOR INSERT
WITH CHECK (
  public.is_tenant_admin(tenant_id)
);

CREATE POLICY "Tenant admins can update memberships"
ON public.tenant_memberships
FOR UPDATE
USING (
  public.is_tenant_admin(tenant_id)
);

CREATE POLICY "Tenant admins can delete memberships"
ON public.tenant_memberships
FOR DELETE
USING (
  public.is_tenant_admin(tenant_id)
);

-- 4. Actualizar funciones RPC para incluir tenant
CREATE OR REPLACE FUNCTION public.grant_permission(target_user_email text, permission text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target_user_id UUID;
  current_tenant_id UUID;
BEGIN
  -- Obtener el tenant del usuario actual
  SELECT tenant_id INTO current_tenant_id
  FROM public.tenant_memberships
  WHERE user_id = auth.uid()
  LIMIT 1;

  IF current_tenant_id IS NULL THEN
    RAISE EXCEPTION 'Usuario no pertenece a ningún tenant';
  END IF;

  -- Obtener el user_id del email en el mismo tenant
  SELECT p.user_id INTO target_user_id 
  FROM public.profiles p
  WHERE p.email = target_user_email
  AND p.tenant_id = current_tenant_id;
  
  IF target_user_id IS NULL THEN
    RAISE EXCEPTION 'Usuario no encontrado en este tenant';
  END IF;
  
  -- Insertar el permiso
  INSERT INTO public.user_permissions (user_id, permission_type, granted_by, tenant_id)
  VALUES (target_user_id, permission, auth.uid(), current_tenant_id)
  ON CONFLICT (user_id, permission_type) DO NOTHING;
END;
$$;

CREATE OR REPLACE FUNCTION public.revoke_permission(target_user_email text, permission text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target_user_id UUID;
  current_tenant_id UUID;
BEGIN
  -- Obtener el tenant del usuario actual
  SELECT tenant_id INTO current_tenant_id
  FROM public.tenant_memberships
  WHERE user_id = auth.uid()
  LIMIT 1;

  IF current_tenant_id IS NULL THEN
    RAISE EXCEPTION 'Usuario no pertenece a ningún tenant';
  END IF;

  -- Obtener el user_id del email en el mismo tenant
  SELECT p.user_id INTO target_user_id 
  FROM public.profiles p
  WHERE p.email = target_user_email
  AND p.tenant_id = current_tenant_id;
  
  IF target_user_id IS NULL THEN
    RAISE EXCEPTION 'Usuario no encontrado en este tenant';
  END IF;
  
  -- Eliminar el permiso
  DELETE FROM public.user_permissions 
  WHERE user_id = target_user_id 
  AND permission_type = permission
  AND tenant_id = current_tenant_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.promote_user_to_admin(user_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_tenant_id UUID;
BEGIN
  -- Obtener el tenant del usuario actual
  SELECT tenant_id INTO current_tenant_id
  FROM public.tenant_memberships
  WHERE user_id = auth.uid()
  LIMIT 1;

  IF current_tenant_id IS NULL THEN
    RAISE EXCEPTION 'Usuario no pertenece a ningún tenant';
  END IF;

  -- Actualizar el rol en tenant_memberships
  UPDATE public.tenant_memberships 
  SET role = 'admin'
  WHERE user_id = (
    SELECT user_id FROM public.profiles 
    WHERE email = user_email AND tenant_id = current_tenant_id
  )
  AND tenant_id = current_tenant_id;

  -- También actualizar en profiles para compatibilidad
  UPDATE public.profiles 
  SET role = 'admin' 
  WHERE email = user_email
  AND tenant_id = current_tenant_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.demote_admin_to_user(user_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_tenant_id UUID;
BEGIN
  -- Obtener el tenant del usuario actual
  SELECT tenant_id INTO current_tenant_id
  FROM public.tenant_memberships
  WHERE user_id = auth.uid()
  LIMIT 1;

  IF current_tenant_id IS NULL THEN
    RAISE EXCEPTION 'Usuario no pertenece a ningún tenant';
  END IF;

  -- Actualizar el rol en tenant_memberships
  UPDATE public.tenant_memberships 
  SET role = 'user'
  WHERE user_id = (
    SELECT user_id FROM public.profiles 
    WHERE email = user_email AND tenant_id = current_tenant_id
  )
  AND tenant_id = current_tenant_id;

  -- También actualizar en profiles
  UPDATE public.profiles 
  SET role = 'user' 
  WHERE email = user_email 
  AND role = 'admin'
  AND tenant_id = current_tenant_id;
  
  -- Eliminar todos los permisos específicos cuando se degrada
  DELETE FROM public.user_permissions 
  WHERE user_id = (
    SELECT user_id FROM public.profiles 
    WHERE email = user_email AND tenant_id = current_tenant_id
  )
  AND tenant_id = current_tenant_id;
END;
$$;

-- 5. Hacer tenant_id NOT NULL (ahora que todos los datos están migrados)
ALTER TABLE public.dishes ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE public.profiles ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE public.user_permissions ALTER COLUMN tenant_id SET NOT NULL;