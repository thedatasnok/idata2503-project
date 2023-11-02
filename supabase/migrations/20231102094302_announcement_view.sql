CREATE VIEW course_announcement_view AS (
  SELECT
    ca.announcement_id,
    ca.fk_course_id,
    ca.title,
    ca.content,
    ca.created_at,
    cm.fk_user_id AS fk_created_by_user_id,
    cm.role AS created_by_role,
    up.full_name AS created_by_full_name,
    up.avatar_url AS created_by_avatar_url
  FROM course_announcement ca
  INNER JOIN course_member cm 
    ON ca.fk_created_by_member_id = cm.course_member_id
  INNER JOIN user_profile up 
    ON cm.fk_user_id = up.fk_user_id
  WHERE 1=1
    AND (ca.deleted_at IS NULL)
);
