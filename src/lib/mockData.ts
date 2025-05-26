export interface MockUser {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'student';
}

export interface MockExam {
  _id: string;
  name: string;
  subject: string;
  date: string;
  duration: string;
  questions: Array<{
    id: number;
    text: string;
    type: 'mcq' | 'written';
    options?: string[];
    marks: number;
  }>;
  totalMarks: number;
}

export interface MockResult {
  _id: string;
  student: {
    name: string;
  };
  exam: {
    name: string;
  };
  score: number;
  submittedAt: string;
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

export const mockExams: MockExam[] = [
  {
    _id: '1',
    name: 'Mathematics Final',
    subject: 'Mathematics',
    date: '2024-03-20',
    duration: '3 hours',
    questions: [
      {
        id: 1,
        text: 'What is 2 + 2?',
        type: 'mcq',
        options: ['3', '4', '5', '6'],
        marks: 1
      }
    ],
    totalMarks: 100
  },
  {
    _id: '2',
    name: 'Physics Mid-term',
    subject: 'Physics',
    date: '2024-03-15',
    duration: '2 hours',
    questions: [
      {
        id: 1,
        text: 'Define Newton\'s First Law',
        type: 'written',
        marks: 5
      }
    ],
    totalMarks: 50
  }
];

export const mockResults: MockResult[] = [
  {
    _id: '1',
    student: {
      name: 'Student User'
    },
    exam: {
      name: 'Mathematics Final'
    },
    score: 85,
    submittedAt: '2024-03-20T10:30:00Z'
  },
  {
    _id: '2',
    student: {
      name: 'Student User'
    },
    exam: {
      name: 'Physics Mid-term'
    },
    score: 92,
    submittedAt: '2024-03-15T14:20:00Z'
  }
];