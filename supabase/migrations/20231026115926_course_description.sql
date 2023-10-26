CREATE VIEW current_user_course_description AS (
  WITH current_user_membership AS (
    SELECT 
      cm.fk_course_id,
      cm.fk_user_id,
      cm.course_member_id,
      cm.removed_at
    FROM course_member cm
    WHERE 1=1
      AND (cm.fk_user_id = auth.uid())
      AND (cm.removed_at IS NULL)
  ),
  course_staff AS (
    SELECT
      cm.fk_course_id,
      cm.fk_user_id,
      cm.role,
      cm.removed_at
    FROM course_member cm
    WHERE 1=1
      AND (cm.removed_at IS NULL)
      AND (cm.role != 'STUDENT')
  )
  SELECT
    c.course_id,
    c.course_code,
    c.name,
    c.description,
    (cum.fk_course_id IS NOT NULL AND cum.removed_at IS NULL) AS enrolled,
    c.starts_at,
    c.ends_at,
    COALESCE(JSON_AGG(JSON_BUILD_OBJECT(
      'user_id', u.id,
      'name', up.full_name,
      'email', u.email,
      'avatar_url', up.avatar_url,
      'role', cs.role
    )) FILTER (WHERE u.id IS NOT NULL), '[]') AS staff
  FROM course c
  LEFT JOIN course_staff cs
    ON c.course_id = cs.fk_course_id
  LEFT JOIN auth.users u
    ON cs.fk_user_id = u.id
  LEFT JOIN user_profile up
    ON cs.fk_user_id = up.fk_user_id
  LEFT JOIN current_user_membership cum
    ON c.course_id = cum.fk_course_id
  GROUP BY c.course_id, cum.fk_course_id, cum.removed_at
)