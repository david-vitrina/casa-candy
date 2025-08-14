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