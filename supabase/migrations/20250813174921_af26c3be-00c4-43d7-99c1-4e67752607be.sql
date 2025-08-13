-- Create storage bucket for dish images
INSERT INTO storage.buckets (id, name, public) VALUES ('dish-images', 'dish-images', true);

-- Create storage policies for dish images
CREATE POLICY "Dish images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'dish-images');

CREATE POLICY "Admins can upload dish images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'dish-images' AND auth.uid() IS NOT NULL AND public.is_admin(auth.uid()));

CREATE POLICY "Admins can update dish images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'dish-images' AND auth.uid() IS NOT NULL AND public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete dish images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'dish-images' AND auth.uid() IS NOT NULL AND public.is_admin(auth.uid()));