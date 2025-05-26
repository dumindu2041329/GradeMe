/*
  # Add initial admin and student users

  1. Changes
    - Insert admin user with role 'admin'
    - Insert student user with role 'student'
    
  2. Notes
    - Uses ON CONFLICT (id) for proper conflict handling
    - Sets up initial users for testing
*/

-- Insert admin user
insert into auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  email_change_token_current,
  email_change_token_new,
  recovery_token
)
values (
  '00000000-0000-0000-0000-000000000000',
  '00000000-0000-0000-0000-000000000001',
  'authenticated',
  'authenticated',
  'admin@example.com',
  crypt('admin123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '',
  '',
  '',
  ''
) on conflict (id) do nothing;

-- Insert student user
insert into auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  email_change_token_current,
  email_change_token_new,
  recovery_token
)
values (
  '00000000-0000-0000-0000-000000000000',
  '00000000-0000-0000-0000-000000000002',
  'authenticated',
  'authenticated',
  'student@example.com',
  crypt('student123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '',
  '',
  '',
  ''
) on conflict (id) do nothing;

-- Insert profiles (trigger will handle this automatically, but we'll override the role for admin)
insert into public.profiles (id, email, role)
values 
  ('00000000-0000-0000-0000-000000000001', 'admin@example.com', 'admin')
on conflict (id) do update set role = 'admin';