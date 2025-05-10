/*
  # Create results table

  1. New Tables
    - `results`
      - `id` (uuid, primary key)
      - `studentId` (uuid, foreign key)
      - `examId` (uuid, foreign key)
      - `score` (integer)
      - `answers` (jsonb array)
      - `submittedAt` (timestamp)
      - `gradedAt` (timestamp)

  2. Security
    - Enable RLS on `results` table
    - Add policies for authenticated users
*/

CREATE TABLE IF NOT EXISTS results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  studentId uuid REFERENCES students(id) ON DELETE CASCADE,
  examId uuid REFERENCES exams(id) ON DELETE CASCADE,
  score integer NOT NULL CHECK (score >= 0),
  answers jsonb[] NOT NULL,
  submittedAt timestamptz DEFAULT now(),
  gradedAt timestamptz,
  UNIQUE(studentId, examId)
);

ALTER TABLE results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can read own results"
  ON results
  FOR SELECT
  TO authenticated
  USING (auth.uid() = studentId);

CREATE POLICY "Students can submit exam answers"
  ON results
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = studentId);

CREATE POLICY "Admins can manage results"
  ON results
  FOR ALL
  TO authenticated
  USING (auth.role() = 'admin')
  WITH CHECK (auth.role() = 'admin');