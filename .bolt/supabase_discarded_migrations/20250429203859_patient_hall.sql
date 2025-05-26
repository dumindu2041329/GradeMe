/*
  # Add email and password columns to user_profiles

  1. Changes
    - Add email and password columns to user_profiles table
    - Add unique constraint on email
    - Insert admin and student users with their profiles

  2. Security
    - Password is stored securely using pgcrypto
    - Email must be unique
*/

-- Add new columns to user_profiles
ALTER TABLE user_profiles 
ADD COLUMN email text UNIQUE NOT NULL,
ADD COLUMN password text NOT NULL;

-- Update existing profiles with email and password
UPDATE user_profiles up
SET 
  email = u.email,
  password = crypt(
    CASE 
      WHEN u.email = 'admin@example.com' THEN 'admin123'
      WHEN u.email = 'student@example.com' THEN 'student123'
    END,
    gen_salt('bf')
  )
FROM auth.users u
WHERE up.id = u.id;

-- Insert admin user if not exists
DO $$
DECLARE
  admin_role_id uuid;
BEGIN
  -- Get admin role ID
  SELECT id INTO admin_role_id FROM roles WHERE name = 'admin';

  -- Insert admin user profile if not exists
  INSERT INTO user_profiles (id, role_id, full_name, email, password)
  SELECT 
    gen_random_uuid(),
    admin_role_id,
    'Admin User',
    'admin@example.com',
    crypt('admin123', gen_salt('bf'))
  WHERE NOT EXISTS (
    SELECT 1 FROM user_profiles WHERE email = 'admin@example.com'
  );
END $$;

-- Insert student user if not exists
DO $$
DECLARE
  student_role_id uuid;
BEGIN
  -- Get student role ID
  SELECT id INTO student_role_id FROM roles WHERE name = 'student';

  -- Insert student user profile if not exists
  INSERT INTO user_profiles (id, role_id, full_name, email, password)
  SELECT 
    gen_random_uuid(),
    student_role_id,
    'Student User',
    'student@example.com',
    crypt('student123', gen_salt('bf'))
  WHERE NOT EXISTS (
    SELECT 1 FROM user_profiles WHERE email = 'student@example.com'
  );
END $$;