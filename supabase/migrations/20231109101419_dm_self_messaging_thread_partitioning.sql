DELETE FROM direct_message WHERE fk_receiver_user_id = fk_sender_user_id;
ALTER TABLE direct_message ADD CONSTRAINT disallow_self_messages CHECK (fk_receiver_user_id != fk_sender_user_id);

CREATE OR REPLACE VIEW current_user_direct_messages_view AS (
  WITH current_user_direct_messages AS (
    SELECT
      dm.direct_message_id,
      (CASE 
        WHEN dm.fk_receiver_user_id = auth.uid() THEN 'INGOING'
        ELSE 'OUTGOING'
      END) AS direction,
      (CASE
        WHEN dm.fk_receiver_user_id != auth.uid() THEN dm.fk_receiver_user_id
        ELSE dm.fk_sender_user_id
      END) AS counterpart_user_id,
      dm.fk_receiver_user_id,
      dm.fk_sender_user_id,
      dm.content,
      dm.created_at,
      ROW_NUMBER() OVER (PARTITION BY CASE
        WHEN dm.fk_receiver_user_id = auth.uid() THEN dm.fk_sender_user_id
        ELSE dm.fk_receiver_user_id
      END ORDER BY dm.created_at DESC) AS row_number
    FROM direct_message dm
    WHERE 1=1
      AND (auth.uid() IN (dm.fk_receiver_user_id, dm.fk_sender_user_id))
  )
  SELECT
    cudm.direct_message_id,
    cudm.direction,
    cudm.counterpart_user_id,
    cudm.content,
    cudm.created_at,
    cudm.row_number,
    sender_profile.fk_user_id AS sender_user_id,
    sender_profile.full_name AS sender_full_name,
    sender_profile.avatar_url AS sender_avatar_url
  FROM current_user_direct_messages cudm
  INNER JOIN user_profile sender_profile
    ON cudm.fk_sender_user_id = sender_profile.fk_user_id
);
