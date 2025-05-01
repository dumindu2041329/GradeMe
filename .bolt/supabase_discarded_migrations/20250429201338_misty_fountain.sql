/*
  # Create Initial Users

  1. Changes
    - Create admin and student users in auth.users table
    - Set user metadata including roles
    - Create user profiles with correct role assignments

  2. Security
    - Passwords are properly hashed using pgcrypto
    - Email confirmation is set
*/

-- Enable pgcrypto extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create admin user and get the ID
DO $$
DECLARE
  admin_id uuid;
  student_id uuid;
  admin_role_id uuid;
  student_role_id uuid;
BEGIN
  -- Get role IDs
  SELECT id INTO admin_role_id FROM roles WHERE name = 'admin';
  SELECT id INTO student_role_id FROM roles WHERE name = 'student';

  -- Create admin user
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'admin@example.com',
    crypt('admin123', gen_salt('bf')),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    jsonb_build_object(
      'role', 'admin',
      'full_name', 'Admin User'
    ),
    now(),
    now()
  )
  ON CONFLICT (email) DO NOTHING
  RETURNING id INTO admin_id;

  -- Create student user
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'student@example.com',
    crypt('student123', gen_salt('bf')),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    jsonb_build_object(
      'role', 'student',
      'full_name', 'Student User'
    ),
    now(),
    now()
  )
  ON CONFLICT (email) DO NOTHING
  RETURNING id INTO student_id;

  -- Create user profiles if users were created
  IF admin_id IS NOT NULL THEN
    INSERT INTO user_profiles (id, role_id, full_name)
    VALUES (admin_id, admin_role_id, 'Admin User')
    ON CONFLICT (id) DO UPDATE
    SET role_id = admin_role_id;
  END IF;

  IF student_id IS NOT NULL THEN
    INSERT INTO user_profiles (id, role_id, full_name)
    VALUES (student_id, student_role_id, 'Student User')
    ON CONFLICT (id) DO UPDATE
    SET role_id = student_role_id;
  END IF;
END $$;