CREATE OR REPLACE FUNCTION send_push_notification(headings JSONB, contents JSONB, user_ids UUID[])
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
)
SELECT INTO response_status status
FROM onesignal, http((
    'POST',
    'https://onesignal.com/api/v1/notifications',
    ARRAY[http_header('Authorization', 'Bearer ' || onesignal.token)],
    'application/json',
    JSON_BUILD_OBJECT(
      'app_id', onesignal.app_id,
      'contents', contents,
      'headings', headings,
      'target_channel', 'push',
      'include_aliases', JSONB_BUILD_OBJECT('external_id', user_ids)
    )
  )::http_request);

  RETURN response_status;
END;
$$;