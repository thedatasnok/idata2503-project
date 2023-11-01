CREATE TYPE assignment_type AS ENUM ('INDIVIDUAL', 'GROUP');

CREATE TABLE course_assignment (
  assignment_id UUID NOT NULL DEFAULT gen_random_uuid(),
  fk_course_id UUID NOT NULL,
  fk_created_by_member_id UUID NOT NULL,
  name TEXT NOT NULL,
  type assignment_type NOT NULL,
  description TEXT NOT NULL,
  allowed_attempts INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  due_at TIMESTAMP WITH TIME ZONE NOT NULL,

  PRIMARY KEY (assignment_id),
  FOREIGN KEY (fk_course_id) REFERENCES course (course_id),
  FOREIGN KEY (fk_created_by_member_id) REFERENCES course_member (course_member_id)
);

CREATE TABLE course_assignment_attempt (
  attempt_id UUID NOT NULL DEFAULT gen_random_uuid(),
  fk_assignment_id UUID NOT NULL,
  fk_handed_in_by_member_id UUID NOT NULL,
  fk_course_group_id UUID,
  fk_evaluated_by_member_id UUID,
  attachment_urls JSON,
  comment TEXT,
  evaluation JSON,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  submitted_at TIMESTAMP WITH TIME ZONE,
  evaluated_at TIMESTAMP WITH TIME ZONE,

  PRIMARY KEY (attempt_id),
  FOREIGN KEY (fk_assignment_id) REFERENCES course_assignment (assignment_id),
  FOREIGN KEY (fk_handed_in_by_member_id) REFERENCES course_member (course_member_id),
  FOREIGN KEY (fk_course_group_id) REFERENCES course_group (course_group_id),
  FOREIGN KEY (fk_evaluated_by_member_id) REFERENCES course_member (course_member_id)
);
