import bcrypt from 'bcryptjs';

export const users = [
  {
    id: '1',
    email: 'admin@example.com',
    password: await bcrypt.hash('admin123', 10),
    name: 'Admin User',
    role: 'admin',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    email: 'student@example.com',
    password: await bcrypt.hash('student123', 10),
    name: 'Student User',
    role: 'student',
    createdAt: new Date().toISOString()
  }
];

export const findUserByEmail = (email) => {
  return users.find(user => user.email === email);
};

export const findUserById = (id) => {
  return users.find(user => user.id === id);
};

export const createUser = async (userData) => {
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const newUser = {
    id: (users.length + 1).toString(),
    ...userData,
    password: hashedPassword,
    createdAt: new Date().toISOString()
  };
  users.push(newUser);
  return newUser;
};