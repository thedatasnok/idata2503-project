DROP VIEW IF EXISTS current_user_assignment_view;

CREATE VIEW current_user_assignment_view AS (
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
  latest_assignment_attempts AS (
    SELECT
      caa.fk_assignment_id,
      caa.evaluation,
      caa.evaluated_at,
      caa.submitted_at,
      JSON_BUILD_OBJECT(
        'userId', evaluator_up.fk_user_id,
        'fullName', evaluator_up.full_name,
        'avatarUrl', evaluator_up.avatar_url
      ) AS evaluator
    FROM course_assignment_attempt caa
    INNER JOIN course_member handed_in_by
      ON caa.fk_handed_in_by_member_id = handed_in_by.course_member_id
    LEFT JOIN course_member evaluator
      ON caa.fk_evaluated_by_member_id = evaluator.course_member_id
    LEFT JOIN user_profile evaluator_up
      ON evaluator.fk_user_id = evaluator_up.fk_user_id
    WHERE handed_in_by.fk_user_id = auth.uid()
    ORDER BY caa.created_at DESC
  )
  SELECT 
    ca.fk_course_id,
    c.course_code,
    ca.assignment_id,
    ca.name,
    ca.description,
    ca.due_at,
    JSON_BUILD_OBJECT(
      'userId', up.fk_user_id,
      'fullName', up.full_name,
      'avatarUrl', up.avatar_url
    ) AS created_by,
    ca.created_at,
    laa.submitted_at,
    laa.evaluated_at,
    laa.evaluation,
    laa.evaluator
  FROM course_assignment ca
  INNER JOIN current_user_membership cum
    ON ca.fk_course_id = cum.fk_course_id
  INNER JOIN course c
    ON ca.fk_course_id = c.course_id
  LEFT JOIN latest_assignment_attempts laa
    ON ca.assignment_id = laa.fk_assignment_id
  INNER JOIN course_member cm
    ON ca.fk_created_by_member_id = cm.course_member_id
  INNER JOIN user_profile up
    ON cm.fk_user_id = up.fk_user_id
);

DROP VIEW IF EXISTS course_announcement_view;

CREATE VIEW course_announcement_view AS (
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
  )
  SELECT
    ca.announcement_id,
    ca.fk_course_id,
    c.course_code,
    ca.title,
    ca.content,
    ca.created_at,
    cm.fk_user_id AS fk_created_by_user_id,
    cm.role AS created_by_role,
    up.full_name AS created_by_full_name,
    up.avatar_url AS created_by_avatar_url
  FROM course_announcement ca
  INNER JOIN current_user_membership cum
    ON ca.fk_course_id = cum.fk_course_id
  INNER JOIN course_member cm 
    ON ca.fk_created_by_member_id = cm.course_member_id
  INNER JOIN course c
    ON ca.fk_course_id = c.course_id
  INNER JOIN user_profile up 
    ON cm.fk_user_id = up.fk_user_id
  WHERE 1=1
    AND (ca.deleted_at IS NULL)
);
