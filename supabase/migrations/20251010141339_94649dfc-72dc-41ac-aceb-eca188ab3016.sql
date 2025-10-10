-- Permitir a los administradores ver todos los perfiles
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
USING (public.is_admin(auth.uid()));

-- Permitir a los administradores eliminar perfiles (necesario para la funcionalidad de eliminar usuarios)
CREATE POLICY "Admins can delete profiles"
ON public.profiles
FOR DELETE
USING (public.is_admin(auth.uid()));