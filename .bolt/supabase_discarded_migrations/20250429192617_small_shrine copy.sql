/*
  # Create initial users

  1. Creates admin and student users
  2. Updates their profiles with correct roles
*/

-- Create admin user
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_user_meta_data
) VALUES (
  gen_random_uuid(),
  'admin@example.com',
  crypt('admin123', gen_salt('bf')),
  now(),
  '{"role": "admin", "full_name": "Admin User"}'::jsonb
) ON CONFLICT (email) DO NOTHING;

-- Create student user
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_user_meta_data
) VALUES (
  gen_random_uuid(),
  'student@example.com',
  crypt('student123', gen_salt('bf')),
  now(),
  '{"role": "student", "full_name": "Student User"}'::jsonb
) ON CONFLICT (email) DO NOTHING;

-- Update admin profile with admin role
UPDATE user_profiles
SET role_id = (SELECT id FROM roles WHERE name = 'admin')
WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@example.com');