CREATE OR REPLACE FUNCTION new_user_profile_trigger() 
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_profile (fk_user_id, full_name, avatar_url)
  VALUES (NEW.id, '', '')
  ON CONFLICT (fk_user_id) DO NOTHING;
  RETURN NEW;
END;
$$;