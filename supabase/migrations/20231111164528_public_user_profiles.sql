CREATE VIEW public_user_profile_view AS (
  WITH current_user_membership AS (
    SELECT
      cm.fk_course_id,
      cm.fk_user_id,
      cm.role
    FROM course_member cm
    WHERE cm.fk_user_id = auth.uid() AND cm.removed_at IS NULL
  ),
  other_user_common_membership AS (
    SELECT 
      cm.fk_user_id,
      cm.role,
      ROW_NUMBER() OVER (PARTITION BY cm.fk_user_id) AS row_number
    FROM current_user_membership cum
    INNER JOIN course_member cm
      ON cum.fk_course_id = cm.fk_course_id
    WHERE cm.removed_at IS NULL
  )
  SELECT
    up.fk_user_id AS user_id,
    u.email,
    up.full_name,
    up.avatar_url,
    oucm.role IS NOT NULL AS common_course
  FROM user_profile up
  INNER JOIN auth.users u
    ON up.fk_user_id = u.id
  LEFT JOIN other_user_common_membership oucm
    ON up.fk_user_id = oucm.fk_user_id
    AND oucm.row_number = 1
);