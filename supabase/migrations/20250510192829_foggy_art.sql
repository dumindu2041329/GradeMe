/*
  # Create exams table

  1. New Tables
    - `exams`
      - `id` (uuid, primary key)
      - `name` (text)
      - `subject` (text)
      - `date` (timestamp)
      - `duration` (text)
      - `totalMarks` (integer)
      - `questions` (jsonb array)
      - `createdAt` (timestamp)
      - `updatedAt` (timestamp)

  2. Security
    - Enable RLS on `exams` table
    - Add policies for authenticated users
*/

CREATE TABLE IF NOT EXISTS exams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  subject text NOT NULL,
  date timestamptz NOT NULL,
  duration text NOT NULL,
  totalMarks integer NOT NULL CHECK (totalMarks >= 0),
  questions jsonb[] NOT NULL,
  createdAt timestamptz DEFAULT now(),
  updatedAt timestamptz DEFAULT now()
);

ALTER TABLE exams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can read available exams"
  ON exams
  FOR SELECT
  TO authenticated
  USING (date >= CURRENT_DATE);

CREATE POLICY "Admins can manage exams"
  ON exams
  FOR ALL
  TO authenticated
  USING (auth.role() = 'admin')
  WITH CHECK (auth.role() = 'admin');