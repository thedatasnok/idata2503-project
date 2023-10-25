ALTER TABLE user_profile DROP COLUMN student_id;

CREATE FUNCTION new_user_profile_trigger() 
RETURNS TRIGGER 
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO user_profile (fk_user_id, full_name, avatar_url)
  VALUES (NEW.id, '', '')
  ON CONFLICT (fk_user_id) DO NOTHING;
  RETURN NEW;
END;
$$;


CREATE TRIGGER "user_profile_trigger" 
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE PROCEDURE new_user_profile_trigger(); 

CREATE VIEW user_profile_view AS (
  SELECT
    up.full_name,
    u.email,
    up.avatar_url,
    up.preferences,
    up.role
  FROM auth.users u
  LEFT JOIN user_profile up
    ON u.id = up.fk_user_id
  WHERE 1=1
    AND (u.id = auth.uid())
);
