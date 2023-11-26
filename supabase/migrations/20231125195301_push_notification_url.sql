DROP FUNCTION IF EXISTS send_push_notification(headings JSONB, contents JSONB, user_ids UUID[]);

CREATE OR REPLACE FUNCTION send_push_notification(headings JSONB, contents JSONB, user_ids UUID[], app_url TEXT)
RETURNS INT
LANGUAGE plpgsql
AS $$
DECLARE
  response_status INT;
BEGIN
WITH onesignal AS (
  SELECT 
    1 AS grouper,
    MAX(CASE
      WHEN ds.name ILIKE '%_token' THEN ds.decrypted_secret
      ELSE NULL
    END) AS token,
    MAX(CASE
      WHEN ds.name ILIKE '%_app_id' THEN ds.decrypted_secret
      ELSE NULL
    END) AS app_id
  FROM vault.decrypted_secrets ds
  WHERE 1=1
    AND (ds.name ILIKE 'onesignal%')
  GROUP BY grouper
),
users_to_notify AS (
  SELECT ARRAY_AGG(up.fk_user_id) AS ids
  FROM user_profile up
  WHERE 1=1
    AND (up.preferences->>'notifications' = 'true')
    AND (up.fk_user_id = ANY(user_ids))
)
SELECT INTO response_status status
FROM onesignal, users_to_notify, http((
    'POST',
    'https://onesignal.com/api/v1/notifications',
    ARRAY[http_header('Authorization', 'Bearer ' || onesignal.token)],
    'application/json',
    JSON_BUILD_OBJECT(
      'app_id', onesignal.app_id,
      'contents', contents,
      'headings', headings,
      'target_channel', 'push',
      'app_url', app_url,
      'include_aliases', JSONB_BUILD_OBJECT('external_id', users_to_notify.ids)
    )
  )::http_request);

  RETURN response_status;
END;
$$;

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
    ARRAY_AGG(cm.fk_user_id),
    'whiteboardapp://courses/' || c.course_id || '/announcements/' || NEW.announcement_id;
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
    ARRAY_AGG(NEW.fk_receiver_user_id),
    'whiteboardapp://messages/' || up.fk_user_id;
  )
  FROM user_profile up
  WHERE NEW.fk_sender_user_id = up.fk_user_id
  GROUP BY up.fk_user_id;
  RETURN NULL;
END;
$$;
