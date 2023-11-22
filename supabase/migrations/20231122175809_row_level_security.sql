ALTER TABLE user_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE direct_message ENABLE ROW LEVEL SECURITY;
ALTER TABLE course ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_member ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_group ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_member_group ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_board ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_board_message ENABLE ROW LEVEL SECURITY;
ALTER TABLE location ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_event ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_announcement ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_assignment ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_assignment_attempt ENABLE ROW LEVEL SECURITY;

CREATE FUNCTION has_user_role(_role user_role)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_profile up
    WHERE 1=1
      AND (auth.uid() = up.fk_user_id)
      AND (up.role = _role)
  );
END;
$$;

CREATE FUNCTION has_course_membership(_course_id UUID, _role course_role[])
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM course_member cm
    WHERE 1=1
      AND (auth.uid() = cm.fk_user_id)
      AND (cm.fk_course_id = _course_id)
      AND (_role IS NULL OR cm.role = ANY(_role))
  );
END;
$$;

-- user_profile

CREATE POLICY "Users can edit their own profiles"
ON user_profile FOR ALL
USING (auth.uid() = fk_user_id);

CREATE POLICY "Admins can edit user profiles"
ON user_profile FOR ALL
USING (has_user_role('ADMIN'));

-- direct_message

CREATE POLICY "Users can view their own direct messages"
ON direct_message FOR SELECT
USING (auth.uid() = fk_receiver_user_id OR auth.uid() = fk_sender_user_id);

CREATE POLICY "Users can send messages on their own behalf"
ON direct_message FOR INSERT
WITH CHECK (auth.uid() = fk_sender_user_id);

-- course

CREATE POLICY "Courses are visible to authenticated users"
ON course FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Courses can be managed by admin users"
ON course FOR ALL
USING (has_user_role('ADMIN'));

-- course_member

CREATE POLICY "Course members can be managed by admin users"
ON course_member FOR ALL
USING (has_user_role('ADMIN'));

CREATE POLICY "Course members can be managed by course lecturers"
ON course_member FOR ALL
USING (has_course_membership(fk_course_id, ARRAY['LECTURER']::course_role[]));

CREATE POLICY "Course members with the role 'LECTURER' is publicly visible" 
ON course_member FOR SELECT
USING (role = 'LECTURER');

CREATE POLICY "Course members are visible to other course members"
ON course_member FOR SELECT
USING (has_course_membership(fk_course_id, NULL::course_role[]));

CREATE POLICY "Users can manage their own course memberships"
ON course_member FOR ALL
USING (auth.uid() = fk_user_id);

-- course_group

CREATE POLICY "Course groups can be managed by admin users"
ON course_group FOR ALL
USING (has_user_role('ADMIN'));

CREATE POLICY "Course groups can be managed by course lecturers and assistants"
ON course_group FOR ALL
USING (has_course_membership(fk_course_id, ARRAY['LECTURER', 'ASSISTANT']::course_role[]));

-- course_member_group

CREATE POLICY "Course group members can be managed by admin users"
ON course_member_group FOR ALL
USING (has_user_role('ADMIN'));

CREATE POLICY "Course group members can be managed by course lecturers and assistants"
ON course_member_group FOR ALL
USING (
  EXISTS (
    SELECT has_course_membership(fk_course_id, ARRAY['LECTURER', 'ASSISTANT']::course_role[])
    FROM course_group cg
    WHERE 1=1
      AND (cg.course_group_id = fk_course_group_id)
  )
);

-- course_board

CREATE POLICY "Course boards can be managed by admin users"
ON course_board FOR ALL
USING (has_user_role('ADMIN'));

CREATE POLICY "Course boards can be managed by course lecturers and assistants"
ON course_board FOR ALL
USING (has_course_membership(fk_course_id, ARRAY['LECTURER', 'ASSISTANT']::course_role[]));

CREATE POLICY "Course boards can be viewed by course members"
ON course_board FOR SELECT
USING (has_course_membership(fk_course_id, NULL::course_role[]));

-- course_board_message

CREATE POLICY "Course board messages can be managed by admin users"
ON course_board_message FOR ALL
USING (has_user_role('ADMIN'));

CREATE POLICY "Course board messages can be viewed by course members"
ON course_board_message FOR SELECT
USING (EXISTS (
  SELECT 1 
  FROM course_board cb
  INNER JOIN course_member cm
    ON cb.fk_course_id = cm.fk_course_id
  WHERE 1=1
    AND (cb.course_board_id = fk_course_board_id)
    AND (auth.uid() = cm.fk_user_id)
    AND (cm.removed_at IS NULL)
));

CREATE POLICY "Course board messages can be posted by course members on their own behalf"
ON course_board_message FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 
  FROM course_board cb
  INNER JOIN course_member cm
    ON cb.fk_course_id = cm.fk_course_id
  WHERE 1=1
    AND (cb.course_board_id = fk_course_board_id)
    AND (auth.uid() = fk_posted_by_user_id)
    AND (auth.uid() = cm.fk_user_id)
    AND (cm.removed_at IS NULL)
));

-- location

CREATE POLICY "Locations can be managed by admin users"
ON location FOR ALL
USING (has_user_role('ADMIN'));

GRANT SELECT ON location TO authenticated;

-- course_event

CREATE POLICY "Course events can be managed by admin users"
ON course_event FOR ALL
USING (has_user_role('ADMIN'));

CREATE POLICY "Course events can be managed by course lecturers and assistants"
ON course_event FOR ALL
USING (has_course_membership(fk_course_id, ARRAY['LECTURER', 'ASSISTANT']::course_role[]));

CREATE POLICY "Course events can be viewed by course members"
ON course_event FOR SELECT
USING (has_course_membership(fk_course_id, NULL::course_role[]));

-- course_announcement

CREATE POLICY "Course announcements can be managed by admin users"
ON course_announcement FOR ALL
USING (has_user_role('ADMIN'));

CREATE POLICY "Course announcements can be managed by course lecturers and assistants"
ON course_announcement FOR ALL
USING (has_course_membership(fk_course_id, ARRAY['LECTURER', 'ASSISTANT']::course_role[]));

CREATE POLICY "Course announcements can be viewed by course members"
ON course_announcement FOR SELECT
USING (has_course_membership(fk_course_id, NULL::course_role[]));

-- course_assignment

CREATE POLICY "Course assignments can be managed by admin users"
ON course_assignment FOR ALL
USING (has_user_role('ADMIN'));

CREATE POLICY "Course assignments can be managed by course lecturers and assistants"
ON course_assignment FOR ALL
USING (has_course_membership(fk_course_id, ARRAY['LECTURER', 'ASSISTANT']::course_role[]));

CREATE POLICY "Course assignments can be viewed by course members"
ON course_assignment FOR SELECT
USING (has_course_membership(fk_course_id, NULL::course_role[]));

-- course_assignment_attempt

CREATE POLICY "Course assignment attempts can be managed by admin users"
ON course_assignment_attempt FOR ALL
USING (has_user_role('ADMIN'));

CREATE POLICY "Course assignment attempts can be managed by course lecturers and assistants"
ON course_assignment_attempt FOR ALL
USING (EXISTS (
  SELECT has_course_membership(fk_course_id, ARRAY['LECTURER', 'ASSISTANT']::course_role[]) 
  FROM course_assignment ca
  WHERE 1=1
    AND (ca.assignment_id = fk_assignment_id)
));

CREATE POLICY "Course assignment attempts can be submitted by course members"
ON course_assignment_attempt FOR INSERT
WITH CHECK (EXISTS (
  SELECT has_course_membership(ca.fk_course_id, NULL::course_role[])
  FROM course_assignment ca
  INNER JOIN course_member cm
    ON ca.fk_course_id = cm.fk_course_id
  WHERE 1=1
    AND (fk_assignment_id = ca.assignment_id)
    AND (fk_handed_in_by_member_id = cm.course_member_id)
    AND (auth.uid() = cm.fk_user_id)
    AND (cm.removed_at IS NULL)
));
