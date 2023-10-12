CREATE TABLE user_profile (
  fk_user_id UUID,
  full_name TEXT NOT NULL,
  avatar_url TEXT NOT NULL,
  student_id TEXT,
  preferences JSON NOT NULL DEFAULT '{}'::json,
  notification_tokens JSON NOT NULL DEFAULT '{}'::json,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),

  PRIMARY KEY (fk_user_id),
  FOREIGN KEY (fk_user_id) REFERENCES auth.users (id) ON DELETE CASCADE
);

CREATE TABLE direct_message (
  direct_message_id UUID NOT NULL DEFAULT gen_random_uuid(),
  fk_receiver_user_id UUID NOT NULL,
  fk_sender_user_id UUID NOT NULL,
  content TEXT NOT NULL,
  attachments JSON NOT NULL DEFAULT '[]'::json,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),

  PRIMARY KEY (direct_message_id),
  FOREIGN KEY (fk_receiver_user_id) REFERENCES auth.users (id),
  FOREIGN KEY (fk_sender_user_id) REFERENCES auth.users (id)
);

CREATE TABLE course (
  course_id UUID NOT NULL DEFAULT gen_random_uuid(),
  course_code TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  starts_at TIMESTAMP WITH TIME ZONE NOT NULL,
  ends_at TIMESTAMP WITH TIME ZONE NOT NULL,

  PRIMARY KEY (course_id)
);

CREATE TYPE course_role AS ENUM ('STUDENT', 'ASSISTANT', 'LECTURER');

CREATE TABLE course_member (
  course_member_id UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
  fk_course_id UUID NOT NULL,
  fk_user_id UUID NOT NULL,
  role course_role NOT NULL,
  registered_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  removed_at TIMESTAMP WITH TIME ZONE,

  PRIMARY KEY (fk_course_id, fk_user_id),
  FOREIGN KEY (fk_course_id) REFERENCES course (course_id) ON DELETE CASCADE,
  FOREIGN KEY (fk_user_id) REFERENCES auth.users (id) ON DELETE CASCADE
);

CREATE TABLE course_group (
  course_group_id UUID NOT NULL DEFAULT gen_random_uuid(),
  fk_course_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),

  PRIMARY KEY (course_group_id),
  FOREIGN KEY (fk_course_id) REFERENCES course (course_id) ON DELETE CASCADE
);

CREATE TABLE course_member_group (
  fk_course_group_id UUID NOT NULL, 
  fk_course_member_course_id UUID NOT NULL,
  fk_course_member_id UUID NOT NULL,

  PRIMARY KEY (fk_course_group_id, fk_course_member_id),
  FOREIGN KEY (fk_course_group_id) REFERENCES course_group (course_group_id),
  FOREIGN KEY (fk_course_member_id) REFERENCES course_member (course_member_id)
);

CREATE TABLE course_board (
  course_board_id UUID NOT NULL DEFAULT gen_random_uuid(),
  fk_course_id UUID NOT NULL,
  fk_created_by_user_id UUID,
  fk_course_group_id UUID,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),

  PRIMARY KEY (course_board_id),
  FOREIGN KEY (fk_course_id) REFERENCES course (course_id) ON DELETE CASCADE,
  FOREIGN KEY (fk_created_by_user_id) REFERENCES auth.users (id) ON DELETE CASCADE,
  FOREIGN KEY (fk_course_group_id) REFERENCES course_group (course_group_id) ON DELETE CASCADE
);

CREATE TABLE course_board_message (
  course_board_message_id UUID NOT NULL DEFAULT gen_random_uuid(),
  fk_course_board_id UUID NOT NULL,
  fk_posted_by_user_id UUID NOT NULL,
  content TEXT NOT NULL,
  attachments JSON NOT NULL DEFAULT '[]'::json,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),

  PRIMARY KEY (course_board_message_id),
  FOREIGN KEY (fk_course_board_id) REFERENCES course_board (course_board_id) ON DELETE CASCADE,
  FOREIGN KEY (fk_posted_by_user_id) REFERENCES auth.users (id) ON DELETE CASCADE
);

CREATE TABLE location (
  location_id UUID NOT NULL DEFAULT gen_random_uuid(),
  building TEXT NOT NULL,
  room_number TEXT NOT NULL,
  map_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),

  PRIMARY KEY (location_id)
);

CREATE TYPE course_event_type AS ENUM ('EXAM', 'LECTURE', 'LAB');

CREATE TABLE course_event (
  course_event_id UUID NOT NULL DEFAULT gen_random_uuid(),
  fk_course_id UUID NOT NULL,
  fk_location_id UUID,
  name TEXT NOT NULL,
  event_type course_event_type NOT NULL,
  mandatory BOOLEAN NOT NULL,
  starts_at TIMESTAMP WITH TIME ZONE NOT NULL,
  ends_at TIMESTAMP WITH TIME ZONE NOT NULL,

  PRIMARY KEY (course_event_id),
  FOREIGN KEY (fk_course_id) REFERENCES course (course_id) ON DELETE CASCADE,
  FOREIGN KEY (fk_location_id) REFERENCES location (location_id)
);
