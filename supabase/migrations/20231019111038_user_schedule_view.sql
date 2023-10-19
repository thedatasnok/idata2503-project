CREATE VIEW user_schedule_view AS (
  WITH current_user_membership AS (
    SELECT 
      cm.fk_course_id,
      cm.course_member_id,
      cm.removed_at
    FROM course_member cm
    WHERE 1=1
      AND (cm.fk_user_id = auth.uid())
      AND (cm.removed_at IS NULL)
  )
  SELECT
    c.course_id,
    c.course_code,
    c.name AS course_name,
    ce.course_event_id,
    ce.name AS event_name,
    ce.mandatory,
    ce.event_type,
    ce.starts_at,
    ce.ends_at,
    l.room_number,
    l.map_url,
    DATE_TRUNC('month', ce.starts_at)::DATE AS month
  FROM course_event ce
  LEFT JOIN location l
    ON ce.fk_location_id = l.location_id
  INNER JOIN current_user_membership
    ON ce.fk_course_id = current_user_membership.fk_course_id
  INNER JOIN course c
    ON ce.fk_course_id = c.course_id
);