CREATE FUNCTION send_course_announcement_notification_trigger()
RETURNS TRIGGER 
LANGUAGE plpgsql
AS $$
BEGIN
  SELECT send_push_notification(
    JSON_BUILD_OBJECT('en', c.course_code || ': ' || NEW.title),
    JSON_BUILD_OBJECT('en', CASE 
      WHEN LENGTH(NEW.content) > 100 THEN LEFT(NEW.content, 100) || '...'
      ELSE NEW.content
    END),
    ARRAY_AGG(cm.fk_user_id)
  )
  FROM course_member cm
  INNER JOIN course c
    ON cm.fk_course_id = c.course_id
  WHERE 1=1
    AND (cm.course_member_id != NEW.fk_created_by_member_id)
    AND (cm.removed_at IS NULL)
    AND (cm.fk_course_id = NEW.fk_course_id)
    AND (cm.role = 'STUDENT');
END;
$$;

CREATE TRIGGER "course_announcement_notification_trigger"
AFTER INSERT ON course_announcement
FOR EACH ROW
EXECUTE PROCEDURE send_course_announcement_notification_trigger();

CREATE FUNCTION send_direct_message_notification_trigger()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  SELECT send_push_notification(
    JSON_BUILD_OBJECT('en', up.full_name),
    JSON_BUILD_OBJECT('en', CASE 
      WHEN LENGTH(NEW.content) > 100 THEN LEFT(NEW.content, 100) || '...'
      ELSE NEW.content
    END),
    ARRAY_AGG(dm.fk_receiver_user_id)
  )
  FROM user_profile up
  WHERE NEW.fk_sender_user_id = up.fk_user_id;
END;
$$;

CREATE TRIGGER "direct_message_notification_trigger"
AFTER INSERT ON direct_message
FOR EACH ROW
EXECUTE PROCEDURE send_direct_message_notification_trigger();
