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