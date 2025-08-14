-- Enable realtime for user_permissions table so changes are reflected immediately
ALTER TABLE public.user_permissions REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_permissions;