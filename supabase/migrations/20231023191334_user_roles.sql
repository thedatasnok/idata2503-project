CREATE TYPE user_role AS ENUM ('USER', 'ADMIN');

ALTER TABLE user_profile ADD COLUMN role user_role NOT NULL DEFAULT 'USER';
