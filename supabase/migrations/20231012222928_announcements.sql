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
