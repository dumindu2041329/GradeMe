import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const seedUsers = async () => {
  try {
    // Clear existing users
    await User.deleteMany({});
    console.log('Cleared existing users');

    // Create admin user
    const adminSalt = await bcrypt.genSalt(10);
    const adminHashedPassword = await bcrypt.hash('admin123', adminSalt);
    
    await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      password: adminHashedPassword,
      role: 'admin',
      isActive: true
    });
    console.log('Admin user created');

    // Create student user
    const studentSalt = await bcrypt.genSalt(10);
    const studentHashedPassword = await bcrypt.hash('student123', studentSalt);
    
    await User.create({
      firstName: 'Student',
      lastName: 'User',
      email: 'student@example.com',
      password: studentHashedPassword,
      role: 'student',
      isActive: true
    });
    console.log('Student user created');

  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
};

export default seedUsers;