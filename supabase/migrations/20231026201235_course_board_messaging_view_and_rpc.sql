CREATE OR REPLACE FUNCTION current_user_post_course_board_message(board_id UUID, content TEXT, attachments JSON)
RETURNS course_board_message
LANGUAGE plpgsql
AS $$
DECLARE
  v_new_message course_board_message;
BEGIN
  WITH current_user_membership AS (
    SELECT
      cm.fk_user_id,
      cm.fk_course_id
    FROM course_member cm
    WHERE 1=1
      AND (cm.fk_user_id = auth.uid())
      AND (cm.removed_at IS NULL)
  )
  INSERT INTO course_board_message (fk_course_board_id, fk_posted_by_user_id, content, attachments)
  SELECT
    cb.course_board_id,
    cum.fk_user_id,
    content,
    attachments
  FROM course_board cb
  INNER JOIN current_user_membership cum
    ON cb.fk_course_id = cum.fk_course_id
  WHERE 1=1
    AND (cb.course_board_id = board_id)
  RETURNING * INTO v_new_message;

  RETURN v_new_message;
END;
$$;

CREATE VIEW course_board_message_view AS (
  SELECT 
    cbm.course_board_message_id,
    cbm.fk_course_board_id,
    cbm.content,
    cbm.created_at,
    sender.fk_user_id AS sender_user_id,
    sender.full_name AS sender_full_name,
    sender.avatar_url AS sender_avatar_url
  FROM course_board_message cbm
  INNER JOIN user_profile sender
    ON cbm.fk_posted_by_user_id = sender.fk_user_id
);
