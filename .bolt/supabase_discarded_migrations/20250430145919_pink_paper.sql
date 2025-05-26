/*
  # Add admin and student users

  1. Changes
    - Insert admin user into profiles table
    - Insert student user into profiles table
    - Set appropriate roles for each user
*/

-- Insert admin user
insert into auth.users (id, email)
values ('00000000-0000-0000-0000-000000000001', 'admin@example.com')
on conflict (email) do nothing;

insert into public.profiles (id, email, role)
values ('00000000-0000-0000-0000-000000000001', 'admin@example.com', 'admin')
on conflict (email) do nothing;

-- Insert student user
insert into auth.users (id, email)
values ('00000000-0000-0000-0000-000000000002', 'student@example.com')
on conflict (email) do nothing;

insert into public.profiles (id, email, role)
values ('00000000-0000-0000-0000-000000000002', 'student@example.com', 'student')
on conflict (email) do nothing;