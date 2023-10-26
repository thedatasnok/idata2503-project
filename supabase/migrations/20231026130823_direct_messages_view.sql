CREATE VIEW current_user_direct_messages_view AS (
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
        WHEN dm.fk_receiver_user_id = auth.uid() THEN dm.fk_receiver_user_id
        ELSE dm.fk_sender_user_id
      END ORDER BY dm.created_at DESC) AS row_number
    FROM direct_message dm
    WHERE 1=1
      AND (auth.uid() IN (dm.fk_receiver_user_id, dm.fk_sender_user_id))
  )
  SELECT
    cudm.*,
    counterpart.fk_user_id AS counterpart_user_id,
    counterpart.full_name AS counterpart_full_name,
    counterpart.avatar_url AS counterpart_avatar_url,
    current_user_profile.fk_user_id AS current_user_id,
    current_user_profile.full_name AS current_user_full_name,
    current_user_profile.avatar_url AS current_user_avatar_url
  FROM current_user_direct_messages cudm
  INNER JOIN user_profile counterpart
    ON cudm.counterpart_user_id = counterpart.fk_user_id
  INNER JOIN user_profile current_user_profile
    ON auth.uid() = current_user_profile.fk_user_id
);
