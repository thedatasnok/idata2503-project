CREATE OR REPLACE FUNCTION send_course_announcement_notification_trigger()
RETURNS TRIGGER 
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  PERFORM send_push_notification(
    JSON_BUILD_OBJECT('en', c.course_code || ': ' || NEW.title)::JSONB,
    JSON_BUILD_OBJECT('en', CASE 
      WHEN LENGTH(NEW.content) > 100 THEN LEFT(NEW.content, 100) || '...'
      ELSE NEW.content
    END)::JSONB,
    ARRAY_AGG(cm.fk_user_id)
  )
  FROM course_member cm
  INNER JOIN course c
    ON cm.fk_course_id = c.course_id
  WHERE 1=1
    AND (cm.course_member_id != NEW.fk_created_by_member_id)
    AND (cm.removed_at IS NULL)
    AND (cm.fk_course_id = NEW.fk_course_id)
    AND (cm.role = 'STUDENT')
  GROUP BY c.course_id;
  RETURN NULL;
END;
$$;

CREATE OR REPLACE FUNCTION send_direct_message_notification_trigger()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  PERFORM send_push_notification(
    JSON_BUILD_OBJECT('en', up.full_name)::JSONB,
    JSON_BUILD_OBJECT('en', CASE 
      WHEN LENGTH(NEW.content) > 100 THEN LEFT(NEW.content, 100) || '...'
      ELSE NEW.content
    END)::JSONB,
    ARRAY_AGG(NEW.fk_receiver_user_id)
  )
  FROM user_profile up
  WHERE NEW.fk_sender_user_id = up.fk_user_id
  GROUP BY up.fk_user_id;
  RETURN NULL;
END;
$$;
