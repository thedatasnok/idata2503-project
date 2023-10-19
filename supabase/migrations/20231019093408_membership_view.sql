CREATE VIEW course_membership_view AS (
  WITH current_user_membership AS (
    SELECT 
      cm.fk_course_id,
      cm.course_member_id,
      cm.removed_at
    FROM course_member cm
    WHERE cm.fk_user_id = auth.uid()
  )
  SELECT
    c.course_id,
    c.course_code,
    c.name,
    c.starts_at,
    c.ends_at,
    c.course_code || ' ' || c.name AS searchable_name,
    (CASE
      WHEN NOW() BETWEEN c.starts_at AND c.ends_at THEN TRUE
      ELSE FALSE
    END) AS active,
    (CASE
      WHEN cm.course_member_id IS NOT NULL AND cm.removed_at IS NULL THEN TRUE
      ELSE FALSE
    END) AS enrolled
  FROM course c
  LEFT JOIN current_user_membership cm
    ON c.course_id = cm.fk_course_id
);