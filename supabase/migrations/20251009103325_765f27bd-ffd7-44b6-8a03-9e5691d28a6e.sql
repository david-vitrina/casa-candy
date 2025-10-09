-- =====================================================
-- CASA CANDY - BASE DE DATOS SIMPLIFICADA (SIN MULTI-TENANCY)
-- =====================================================

-- 1. CREAR ENUMS
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
CREATE TYPE public.permission_type AS ENUM ('edit_dishes', 'manage_availability', 'delete_dishes', 'manage_users');
CREATE TYPE public.dish_category AS ENUM ('appetizer', 'main', 'dessert');

-- 2. TABLA PROFILES (sin tenant_id)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS para profiles
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id);

-- 3. TABLA USER_ROLES (para verificar admins de forma segura)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Función SECURITY DEFINER para verificar roles
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
    AND role = 'admin'
  );
$$;

-- RLS para user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
ON public.user_roles FOR SELECT
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage roles"
ON public.user_roles FOR ALL
USING (public.is_admin(auth.uid()));

-- 4. TABLA USER_PERMISSIONS (permisos granulares)
CREATE TABLE public.user_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  permission_type public.permission_type NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, permission_type)
);

ALTER TABLE public.user_permissions ENABLE ROW LEVEL SECURITY;

-- RLS para user_permissions
CREATE POLICY "Users can view their own permissions"
ON public.user_permissions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all permissions"
ON public.user_permissions FOR SELECT
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage permissions"
ON public.user_permissions FOR ALL
USING (public.is_admin(auth.uid()));

-- 5. TABLA DISHES (sin tenant_id)
CREATE TABLE public.dishes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  full_description TEXT,
  ingredients TEXT[],
  price NUMERIC(10,2) NOT NULL,
  image TEXT,
  category public.dish_category NOT NULL,
  available BOOLEAN NOT NULL DEFAULT true,
  discount_percentage INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.dishes ENABLE ROW LEVEL SECURITY;

-- RLS para dishes
CREATE POLICY "Public can view available dishes"
ON public.dishes FOR SELECT
USING (available = true);

CREATE POLICY "Authenticated users can view all dishes"
ON public.dishes FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins can insert dishes"
ON public.dishes FOR INSERT
TO authenticated
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Users with edit_dishes permission can insert dishes"
ON public.dishes FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_permissions
    WHERE user_id = auth.uid()
    AND permission_type = 'edit_dishes'
  )
);

CREATE POLICY "Admins can update dishes"
ON public.dishes FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Users with edit_dishes permission can update dishes"
ON public.dishes FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_permissions
    WHERE user_id = auth.uid()
    AND permission_type = 'edit_dishes'
  )
);

CREATE POLICY "Admins can delete dishes"
ON public.dishes FOR DELETE
TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Users with delete_dishes permission can delete dishes"
ON public.dishes FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_permissions
    WHERE user_id = auth.uid()
    AND permission_type = 'delete_dishes'
  )
);

-- 6. CREAR STORAGE BUCKET
INSERT INTO storage.buckets (id, name, public)
VALUES ('dish-images', 'dish-images', true)
ON CONFLICT (id) DO NOTHING;

-- RLS para storage
CREATE POLICY "Public can view dish images"
ON storage.objects FOR SELECT
USING (bucket_id = 'dish-images');

CREATE POLICY "Authenticated users can upload dish images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'dish-images');

CREATE POLICY "Authenticated users can update dish images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'dish-images');

CREATE POLICY "Authenticated users can delete dish images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'dish-images');

-- 7. TRIGGER PARA AUTO-CREAR PERFIL
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Crear perfil
  INSERT INTO public.profiles (user_id, email)
  VALUES (NEW.id, NEW.email);
  
  -- Asignar rol 'user' por defecto
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 8. FUNCIONES RPC PARA GESTIÓN DE PERMISOS
CREATE OR REPLACE FUNCTION public.grant_permission(target_user_id UUID, perm public.permission_type)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Only admins can grant permissions';
  END IF;
  
  INSERT INTO public.user_permissions (user_id, permission_type)
  VALUES (target_user_id, perm)
  ON CONFLICT (user_id, permission_type) DO NOTHING;
END;
$$;

CREATE OR REPLACE FUNCTION public.revoke_permission(target_user_id UUID, perm public.permission_type)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Only admins can revoke permissions';
  END IF;
  
  DELETE FROM public.user_permissions
  WHERE user_id = target_user_id
  AND permission_type = perm;
END;
$$;

CREATE OR REPLACE FUNCTION public.promote_user_to_admin(target_user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Only admins can promote users';
  END IF;
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (target_user_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;
END;
$$;

CREATE OR REPLACE FUNCTION public.demote_admin_to_user(target_user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Only admins can demote users';
  END IF;
  
  DELETE FROM public.user_roles
  WHERE user_id = target_user_id
  AND role = 'admin';
END;
$$;

-- 9. INSERTAR PLATOS DE CASA CANDY
INSERT INTO public.dishes (name, description, full_description, ingredients, price, category, available) VALUES
-- PESCADOS Y FRITURAS
('Pincho de Bacalao', 'Posta de lomo de bacalao rebozada al punto de sal.', 'Delicioso pincho de bacalao fresco, rebozado en tempura casera y frito a la perfección.', ARRAY['Bacalao', 'Harina', 'Huevo', 'Sal'], 5.00, 'appetizer', true),
('Anillas de Calamar', 'Anillas de calamar XXL seleccionadas y rebozadas.', 'Anillas de calamar de tamaño XXL, seleccionadas cuidadosamente, rebozadas con nuestro toque especial.', ARRAY['Calamar', 'Harina', 'Especias'], 10.50, 'appetizer', true),
('Rejos', 'Pata del calamar rebozada.', 'Los rejos son la parte más carnosa del calamar, rebozados y fritos para obtener una textura crujiente.', ARRAY['Calamar', 'Harina de rebozar'], 9.50, 'appetizer', true),
('Mejillón Tigre', 'Mejillón con un toque de bechamel.', 'Mejillones grandes gratinados con una deliciosa bechamel casera, pan rallado y perejil.', ARRAY['Mejillones', 'Bechamel', 'Pan rallado', 'Perejil'], 8.50, 'appetizer', true),
('Sepia a la Plancha', 'Sepia troceada a la plancha con salsa de ajo, perejil y aceite de oliva.', 'Sepia fresca cortada en trozos, cocinada a la plancha con salsa tradicional de ajo y perejil.', ARRAY['Sepia', 'Ajo', 'Perejil', 'Aceite de oliva'], 11.50, 'appetizer', true),
('Fritura de Pescado', 'Variedad de fritos: adobo, gamba rebozada, anillas, rejos, merluza.', 'Surtido de pescado frito perfecto para compartir.', ARRAY['Pescado variado', 'Gambas', 'Calamar', 'Merluza'], 18.00, 'appetizer', true),
('Trucha a la Navarra', 'Trucha asalmonada (200g) frita con jamón ibérico y ensalada.', 'Trucha asalmonada de 200g frita, acompañada de jamón ibérico y ensalada fresca.', ARRAY['Trucha asalmonada', 'Jamón ibérico', 'Lechuga', 'Tomate'], 12.00, 'appetizer', true),
('Pata de Pulpo a la Parrilla', 'Pata de pulpo (350g) a la parrilla con pimentón de la vera y patatas.', 'Pata de pulpo cocida y pasada por la parrilla, espolvoreada con pimentón de la vera.', ARRAY['Pulpo', 'Pimentón de la vera', 'Patatas'], 18.50, 'appetizer', true),

-- HAMBURGUESAS
('Hamburguesa Simple', 'Solo carne, queso y jamón york.', 'Hamburguesa clásica con carne de ternera 100%, queso fundido y jamón york.', ARRAY['Carne de ternera', 'Queso', 'Jamón york', 'Pan'], 5.50, 'main', true),
('Hamburguesa Completa', 'Carne mixta, queso, jamón york, lechuga, tomate, cebolla, pepinillo y huevo frito.', 'Nuestra hamburguesa más completa con todos los ingredientes.', ARRAY['Carne mixta', 'Queso', 'Jamón york', 'Lechuga', 'Tomate', 'Cebolla', 'Pepinillo', 'Huevo'], 10.00, 'main', true),
('Hamburguesa de Buey', '200g de carne de Buey con los ingredientes de la completa.', 'Hamburguesa premium de 200g de carne de buey.', ARRAY['Carne de buey', 'Queso', 'Jamón york', 'Lechuga', 'Tomate', 'Cebolla', 'Pepinillo', 'Huevo'], 10.00, 'main', true),
('Hamburguesa Crispy de Pollo', 'Pollo crujiente con queso, lechuga, tomate y huevo frito.', 'Filete de pollo empanado crujiente con todos los complementos.', ARRAY['Pollo empanado', 'Queso', 'Lechuga', 'Tomate', 'Huevo'], 8.50, 'main', true),

-- BOCADILLOS Y SÁNDWICHES
('Bocadillo de Jamón Serrano', 'Jamón Serrano.', 'Bocadillo con jamón serrano de primera calidad.', ARRAY['Jamón serrano', 'Pan'], 5.00, 'main', true),
('Bocadillo de Lomo o Bacon', 'Lomo o bacon con queso, pimientos o tomate.', 'Bocadillo de lomo ibérico o bacon con complementos a elegir.', ARRAY['Lomo o bacon', 'Queso', 'Pimientos', 'Tomate'], 5.50, 'main', true),
('Bocadillo de Panceta a la Plancha', 'Panceta a la plancha.', 'Panceta ibérica cocinada a la plancha, crujiente y jugosa.', ARRAY['Panceta', 'Pan'], 5.50, 'main', true),
('Bocadillo de Tortilla de Patatas', 'Tortilla de patatas.', 'Bocadillo con nuestra tortilla de patatas casera.', ARRAY['Tortilla de patatas', 'Pan'], 5.50, 'main', true),
('Bocadillo de Calamares', 'Calamares.', 'Bocadillo de calamares rebozados y fritos.', ARRAY['Calamares', 'Pan'], 5.50, 'main', true),
('Pepito de Ternera', 'Ternera a la plancha con pimiento frito.', 'Tiras de ternera salteadas a la plancha con pimientos fritos.', ARRAY['Ternera', 'Pimientos', 'Pan'], 5.50, 'main', true),
('Serranito Casa Candy', 'Jamón Serrano a la plancha con pimiento frito y lomo de cerdo.', 'Nuestro bocadillo estrella con jamón serrano, pimiento y lomo.', ARRAY['Jamón serrano', 'Pimiento', 'Lomo de cerdo'], 6.00, 'main', true),
('Sándwich Mixto', 'Doble loncha de jamón york con queso.', 'Sándwich tostado con jamón york y queso fundido.', ARRAY['Jamón york', 'Queso', 'Pan de molde'], 3.50, 'main', true),
('Sándwich Vegetal', 'Jamón york, queso, lechuga, cebolla, espárragos, tomate, atún y pepinillo.', 'Sándwich completo con todos los ingredientes.', ARRAY['Jamón york', 'Queso', 'Lechuga', 'Cebolla', 'Espárragos', 'Tomate', 'Atún', 'Pepinillo'], 10.00, 'main', true),

-- PLATOS COMBINADOS
('Plato 1. Lomo de Cerdo', 'Cinta de lomo a la plancha con patatas fritas y dos huevos.', 'Cinta de lomo de cerdo a la plancha con patatas y huevos.', ARRAY['Lomo de cerdo', 'Patatas', 'Huevos'], 9.50, 'main', true),
('Plato 2. Combinado de Bacalao', '2 postas de bacalao rebozado con ensalada mezclum.', 'Dos generosas postas de bacalao rebozado con ensalada.', ARRAY['Bacalao', 'Ensalada mezclum'], 11.00, 'main', true),
('Plato 3. Combinado de Ternera', 'Filete de ternera a la plancha, pimiento frito y patatas.', 'Filete de ternera tierna a la plancha con guarnición.', ARRAY['Ternera', 'Pimientos', 'Patatas'], 9.50, 'main', true),
('Plato 4. Combinado de Pechuga', 'Dos filetes de pechuga de pollo, dos huevos fritos y patatas fritas.', 'Pechuga de pollo jugosa con huevos y patatas.', ARRAY['Pechuga de pollo', 'Huevos', 'Patatas'], 9.50, 'main', true),
('Plato 5. Combinado de Merluza', 'Filete de merluza rebozado, ensalada mezclum y patatas fritas.', 'Filete de merluza fresca rebozada con ensalada y patatas.', ARRAY['Merluza', 'Ensalada mezclum', 'Patatas'], 9.50, 'main', true),
('Plato 6. Combinado de Panceta', 'Panceta de cerdo a la plancha con patatas fritas y huevos.', 'Panceta de cerdo ibérico a la plancha.', ARRAY['Panceta', 'Patatas', 'Huevos'], 9.50, 'main', true),

-- FUENTES DE PATATA
('Fuente de Patatas con Salsas', 'Patatas con ketchup, mahonesa, alioli casera, brava, rosa y barbacoa.', 'Fuente generosa de patatas fritas con 6 salsas.', ARRAY['Patatas', 'Salsas variadas'], 8.00, 'appetizer', true),
('Fuente de Patatas con Panceta', 'Patatas servidas en combinación con panceta.', 'Fuente de patatas fritas con panceta ibérica crujiente.', ARRAY['Patatas', 'Panceta'], 10.00, 'appetizer', true),
('Fuente de Patatas con Salchichas', 'Fuente de patatas con salsas y minisalchichas.', 'Fuente de patatas fritas con minisalchichas y salsas.', ARRAY['Patatas', 'Salchichas', 'Salsas'], 10.00, 'appetizer', true),

-- OFERTAS ESPECIALES
('Litro + Ración a elegir', 'Litro (cerveza/tinto) + ración (rejos, patatas alioli, nachos, alitas, etc.).', 'Oferta especial con bebida y ración a elegir.', ARRAY['Cerveza o tinto (1L)', 'Ración variada'], 9.50, 'main', true),
('Cubos de Cerveza + Ración', '5 Tercios Heineken + ración (patatas candy o magro con tomate).', 'Cubo con 5 tercios de Heineken + ración.', ARRAY['5 Heineken', 'Patatas o magro'], 14.00, 'main', true),

-- POSTRES
('Crepe Casero', 'Crepe casero.', 'Crepe casero elaborado al momento con ingredientes dulces.', ARRAY['Harina', 'Huevos', 'Leche', 'Azúcar'], 5.50, 'dessert', true),
('Gofre Casero', 'Preparado con masa casera.', 'Gofre belga preparado con nuestra masa casera.', ARRAY['Harina', 'Huevos', 'Leche', 'Mantequilla'], 6.50, 'dessert', true),
('Tartas Artesanas', 'A consultar disponibilidad con el camarero.', 'Variedad de tartas artesanas elaboradas en casa.', ARRAY['Ingredientes variables'], 4.90, 'dessert', true),
('Crep o Tortita', 'Crep o tortita.', 'Crep estilo francés o tortitas americanas al momento.', ARRAY['Harina', 'Huevos', 'Leche'], 5.50, 'dessert', true),
('Sapillo o Torrijas con Nata', 'Sapillo o torrijas con nata.', 'Sapillo dulce o torrijas tradicionales con nata montada.', ARRAY['Pan', 'Leche', 'Huevo', 'Azúcar', 'Nata'], 4.00, 'dessert', true),

-- OTROS
('Servicio Pan', 'Servicio de pan.', 'Pan fresco recién horneado.', ARRAY['Pan'], 0.60, 'appetizer', true);