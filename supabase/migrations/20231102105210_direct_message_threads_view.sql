CREATE VIEW current_user_direct_messages_threads_view AS (
  SELECT 
    cudm.*, 
    up.full_name AS counterpart_full_name, 
    up.avatar_url AS counterpart_avatar_url
  FROM current_user_direct_messages_view cudm
  INNER JOIN user_profile up
    ON cudm.counterpart_user_id = up.fk_user_id
);
