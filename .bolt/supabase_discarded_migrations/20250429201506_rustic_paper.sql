/*
  # Create initial users and assign roles

  1. Changes
    - Create admin and student users in auth.users table
    - Set user metadata including roles
    - Update existing user profiles with correct role assignments

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

  -- Create admin user if not exists
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@example.com') THEN
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
    RETURNING id INTO admin_id;

    -- Create admin profile only if user was created
    IF admin_id IS NOT NULL THEN
      INSERT INTO user_profiles (id, role_id, full_name)
      VALUES (admin_id, admin_role_id, 'Admin User');
    END IF;
  END IF;

  -- Create student user if not exists
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'student@example.com') THEN
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
    RETURNING id INTO student_id;

    -- Create student profile only if user was created
    IF student_id IS NOT NULL THEN
      INSERT INTO user_profiles (id, role_id, full_name)
      VALUES (student_id, student_role_id, 'Student User');
    END IF;
  END IF;

  -- Update existing profiles with correct roles if needed
  UPDATE user_profiles up
  SET role_id = admin_role_id
  FROM auth.users u
  WHERE up.id = u.id AND u.email = 'admin@example.com';

  UPDATE user_profiles up
  SET role_id = student_role_id
  FROM auth.users u
  WHERE up.id = u.id AND u.email = 'student@example.com';
END $$;