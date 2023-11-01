DROP VIEW user_schedule_view;

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
  ),
  all_events AS (
    SELECT 
      ce.course_event_id AS event_id,
      ce.fk_course_id,
      ce.name AS event_name,
      ce.mandatory,
      ce.event_type::TEXT,
      ce.starts_at,
      ce.ends_at,
      ce.fk_location_id
    FROM course_event ce
    UNION ALL
    SELECT 
      ca.assignment_id AS event_id,
      ca.fk_course_id,
      ca.name AS event_name,
      TRUE AS mandatory,
      'ASSIGNMENT' AS event_type,
      ca.due_at AS starts_at,
      ca.due_at AS ends_at,
      NULL AS fk_location_id
    FROM course_assignment ca
  )
  SELECT
    c.course_id,
    c.course_code,
    c.name AS course_name,
    ae.event_id,
    ae.event_name,
    ae.mandatory,
    ae.event_type,
    ae.starts_at,
    ae.ends_at,
    l.room_number,
    l.map_url,
    DATE_TRUNC('month', ae.starts_at)::DATE AS month
  FROM all_events ae
  LEFT JOIN location l
    ON ae.fk_location_id = l.location_id
  INNER JOIN current_user_membership
    ON ae.fk_course_id = current_user_membership.fk_course_id
  INNER JOIN course c
    ON ae.fk_course_id = c.course_id
);