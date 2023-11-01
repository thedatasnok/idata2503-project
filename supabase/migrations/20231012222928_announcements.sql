CREATE TABLE course_announcement (
  announcement_id UUID NOT NULL DEFAULT gen_random_uuid(),
  fk_course_id UUID NOT NULL,
  fk_created_by_member_id UUID NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  deleted_at TIMESTAMP WITH TIME ZONE,

  PRIMARY KEY (announcement_id),
  FOREIGN KEY (fk_course_id) REFERENCES course (course_id),
  FOREIGN KEY (fk_created_by_member_id) REFERENCES course_member (course_member_id)
);

-- NOT IN SUPABASE YET
CREATE VIEW announcement_view AS
SELECT
  ca.announcement_id,
  ca.fk_course_id,
  ca.title,
  ca.content,
  ca.created_at,
  ca.deleted_at,
  cm.fk_user_id AS fk_created_by_user_id,
  cm.role AS created_by_role,
  up.full_name AS created_by_full_name,
  up.avatar_url AS created_by_avatar_url
FROM course_announcement ca
LEFT JOIN course_member cm ON ca.fk_created_by_member_id = cm.course_member_id
LEFT JOIN user_profile up ON cm.fk_user_id = up.fk_user_id;