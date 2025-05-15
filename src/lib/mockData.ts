export interface MockUser {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'student';
}

export const mockUsers: MockUser[] = [
  {
    id: '1',
    email: 'admin@example.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin'
  },
  {
    id: '2',
    email: 'student@example.com',
    password: 'student123',
    name: 'Student User',
    role: 'student'
  }
];

export interface MockExam {
  id: string;
  name: string;
  subject: string;
  date: string;
  duration: string;
  totalMarks: number;
  questions: MockQuestion[];
}

export interface MockQuestion {
  id: string;
  text: string;
  type: 'mcq' | 'written';
  options?: string[];
  marks: number;
}

export const mockExams: MockExam[] = [
  {
    id: '1',
    name: 'Mathematics Final',
    subject: 'Mathematics',
    date: '2024-03-25',
    duration: '3 hours',
    totalMarks: 100,
    questions: [
      {
        id: '1',
        text: 'What is 2 + 2?',
        type: 'mcq',
        options: ['3', '4', '5', '6'],
        marks: 1
      },
      {
        id: '2',
        text: 'Explain the Pythagorean theorem.',
        type: 'written',
        marks: 5
      }
    ]
  }
];

export interface MockResult {
  id: string;
  student: {
    id: string;
    name: string;
  };
  exam: {
    id: string;
    name: string;
  };
  score: number;
  totalMarks: number;
  submittedAt: string;
  rank: number;
  totalStudents: number;
}

export const mockResults: MockResult[] = [
  {
    id: '1',
    student: {
      id: '2',
      name: 'Student User'
    },
    exam: {
      id: '1',
      name: 'Mathematics Final'
    },
    score: 85,
    totalMarks: 100,
    submittedAt: '2024-03-20',
    rank: 3,
    totalStudents: 50
  }
];