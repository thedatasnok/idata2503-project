CREATE VIEW course_member_view AS (
  SELECT 
    cm.fk_course_id AS course_id,
    cm.fk_user_id AS user_id,
    cm.course_member_id AS member_id,
    up.full_name,
    up.avatar_url,
    cm.role,
    ARRAY_LENGTH(ENUM_RANGE(NULL, cm.role), 1) AS role_ordinal
  FROM course_member cm
  INNER JOIN user_profile up
    ON cm.fk_user_id = up.fk_user_id
);
