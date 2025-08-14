-- Fix RLS policies for user_permissions table to allow users to see their own permissions
-- Drop existing policies that are too restrictive
DROP POLICY IF EXISTS "Admins can view all permissions" ON public.user_permissions;

-- Add new policies to allow users to see their own permissions
CREATE POLICY "Users can view their own permissions" 
ON public.user_permissions 
FOR SELECT 
USING (auth.uid() = user_id);

-- Keep admin policies for management
CREATE POLICY "Admins can view all permissions" 
ON public.user_permissions 
FOR SELECT 
USING (is_admin(auth.uid()));

-- Also update the usePermissions hook to properly handle permission refetching
-- Let's also create a trigger to notify when permissions change so the UI can refresh