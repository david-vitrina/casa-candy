-- Create RLS policy to allow users with manage_availability permission to update dish availability
CREATE POLICY "Users with manage_availability can update dish availability" 
ON public.dishes 
FOR UPDATE 
USING (
  -- Allow if user is admin OR has manage_availability permission
  is_admin(auth.uid()) OR 
  has_permission(auth.uid(), 'manage_availability')
) 
WITH CHECK (
  -- Allow if user is admin OR has manage_availability permission
  is_admin(auth.uid()) OR 
  has_permission(auth.uid(), 'manage_availability')
);

-- Create RLS policy to allow users with edit_dishes permission to update dish details
CREATE POLICY "Users with edit_dishes can update dish details" 
ON public.dishes 
FOR UPDATE 
USING (
  -- Allow if user is admin OR has edit_dishes permission
  is_admin(auth.uid()) OR 
  has_permission(auth.uid(), 'edit_dishes')
) 
WITH CHECK (
  -- Allow if user is admin OR has edit_dishes permission
  is_admin(auth.uid()) OR 
  has_permission(auth.uid(), 'edit_dishes')
);

-- Create RLS policy to allow users with edit_dishes permission to insert dishes
CREATE POLICY "Users with edit_dishes can insert dishes" 
ON public.dishes 
FOR INSERT 
WITH CHECK (
  -- Allow if user is admin OR has edit_dishes permission
  is_admin(auth.uid()) OR 
  has_permission(auth.uid(), 'edit_dishes')
);

-- Create RLS policy to allow users with delete_dishes permission to delete dishes
CREATE POLICY "Users with delete_dishes can delete dishes" 
ON public.dishes 
FOR DELETE 
USING (
  -- Allow if user is admin OR has delete_dishes permission
  is_admin(auth.uid()) OR 
  has_permission(auth.uid(), 'delete_dishes')
);