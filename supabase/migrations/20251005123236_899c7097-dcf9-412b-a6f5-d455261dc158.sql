-- Actualizar políticas de storage para organización por tenant

-- Eliminar políticas antiguas de storage si existen
DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own documents" ON storage.objects;

-- Políticas para dish-images bucket organizadas por tenant
-- Las imágenes de platos son públicas para que todos puedan verlas
CREATE POLICY "Dish images are publicly viewable"
ON storage.objects
FOR SELECT
USING (bucket_id = 'dish-images');

-- Solo admins del tenant pueden subir imágenes en su carpeta
CREATE POLICY "Tenant admins can upload dish images"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'dish-images'
  AND (
    -- Verificar que el usuario es admin del tenant
    EXISTS (
      SELECT 1 FROM public.tenant_memberships tm
      WHERE tm.user_id = auth.uid()
      AND tm.role = 'admin'
      -- La carpeta debe coincidir con el tenant_id del usuario
      AND (storage.foldername(name))[1] = tm.tenant_id::text
    )
  )
);

-- Solo admins del tenant pueden actualizar sus imágenes
CREATE POLICY "Tenant admins can update dish images"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'dish-images'
  AND EXISTS (
    SELECT 1 FROM public.tenant_memberships tm
    WHERE tm.user_id = auth.uid()
    AND tm.role = 'admin'
    AND (storage.foldername(name))[1] = tm.tenant_id::text
  )
);

-- Solo admins del tenant pueden eliminar sus imágenes
CREATE POLICY "Tenant admins can delete dish images"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'dish-images'
  AND EXISTS (
    SELECT 1 FROM public.tenant_memberships tm
    WHERE tm.user_id = auth.uid()
    AND tm.role = 'admin'
    AND (storage.foldername(name))[1] = tm.tenant_id::text
  )
);