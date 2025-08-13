-- Create admin user profile (this will be used for the first user that signs up)
-- Since the handle_new_user trigger makes the first user admin automatically,
-- let's also create a function to manually promote users to admin

CREATE OR REPLACE FUNCTION public.promote_user_to_admin(user_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  UPDATE public.profiles 
  SET role = 'admin' 
  WHERE email = user_email;
END;
$$;

-- If there are existing users, promote the first one to admin
DO $$
DECLARE
  first_user_email text;
BEGIN
  SELECT email INTO first_user_email 
  FROM public.profiles 
  ORDER BY created_at ASC 
  LIMIT 1;
  
  IF first_user_email IS NOT NULL THEN
    UPDATE public.profiles 
    SET role = 'admin' 
    WHERE email = first_user_email;
  END IF;
END $$;