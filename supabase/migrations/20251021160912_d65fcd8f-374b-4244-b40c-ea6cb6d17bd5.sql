-- Drop the old restrictive policy
DROP POLICY IF EXISTS "Public can view available dishes" ON public.dishes;

-- Create new policy that allows viewing dishes that are either available OR part of daily menu
CREATE POLICY "Public can view available or daily menu dishes" 
ON public.dishes 
FOR SELECT 
USING (available = true OR daily_menu_type IS NOT NULL);