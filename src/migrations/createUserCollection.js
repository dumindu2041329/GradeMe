import mongoose from 'mongoose';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

const createUserCollection = async () => {
  try {
    // Drop existing collection if it exists
    try {
      await mongoose.connection.dropCollection('users');
      console.log('Dropped existing users collection');
    } catch (error) {
      // Collection might not exist, continue
    }

    // Create collection with validation
    await mongoose.connection.createCollection('users', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['firstName', 'lastName', 'email', 'password', 'role'],
          properties: {
            firstName: {
              bsonType: 'string',
              description: 'First name is required'
            },
            lastName: {
              bsonType: 'string',
              description: 'Last name is required'
            },
            email: {
              bsonType: 'string',
              pattern: '^\\w+([.-]?\\w+)*@\\w+([.-]?\\w+)*(\\.\\w{2,3})+$',
              description: 'Must be a valid email address'
            },
            password: {
              bsonType: 'string',
              minLength: 6,
              description: 'Password must be at least 6 characters'
            },
            role: {
              enum: ['admin', 'student'],
              description: 'Role must be either admin or student'
            },
            isActive: {
              bsonType: 'bool',
              description: 'Must be a boolean'
            },
            lastLogin: {
              bsonType: ['date', 'null'],
              description: 'Must be a date or null'
            },
            createdAt: {
              bsonType: 'date',
              description: 'Must be a date'
            },
            updatedAt: {
              bsonType: 'date',
              description: 'Must be a date'
            }
          }
        }
      },
      validationAction: 'error'
    });

    console.log('Users collection created successfully');

    // Create indexes
    await mongoose.connection.collection('users').createIndex(
      { email: 1 }, 
      { unique: true }
    );
    console.log('Email index created');

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
    console.error('Error creating user collection:', error);
    throw error;
  }
};

export default createUserCollection;