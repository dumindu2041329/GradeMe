import mongoose from 'mongoose';
import Student from '../models/Student.js';
import bcrypt from 'bcryptjs';

const createStudentCollection = async () => {
  try {
    const collections = await mongoose.connection.db.listCollections().toArray();
    const studentCollectionExists = collections.some(col => col.name === 'students');

    if (!studentCollectionExists) {
      await mongoose.connection.createCollection('students', {
        validator: {
          $jsonSchema: {
            bsonType: 'object',
            required: ['name', 'email', 'class', 'enrollmentDate', 'password'],
            properties: {
              name: {
                bsonType: 'string',
                description: 'Student name is required'
              },
              email: {
                bsonType: 'string',
                pattern: '^\\w+([.-]?\\w+)*@\\w+([.-]?\\w+)*(\\.\\w{2,3})+$',
                description: 'Must be a valid email address'
              },
              class: {
                bsonType: 'string',
                description: 'Class is required'
              },
              enrollmentDate: {
                bsonType: 'date',
                description: 'Enrollment date is required'
              },
              password: {
                bsonType: 'string',
                minLength: 6,
                description: 'Password must be at least 6 characters'
              },
              createdAt: {
                bsonType: 'date',
                description: 'Creation timestamp'
              },
              updatedAt: {
                bsonType: 'date',
                description: 'Last update timestamp'
              }
            }
          }
        },
        validationAction: 'error'
      });

      console.log('Students collection created successfully');

      // Create indexes
      await mongoose.connection.collection('students').createIndex(
        { email: 1 },
        { unique: true }
      );
      await mongoose.connection.collection('students').createIndex(
        { name: 1 }
      );
      await mongoose.connection.collection('students').createIndex(
        { class: 1 }
      );
      console.log('Student indexes created');

      // Create demo student
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('student123', salt);
      
      await Student.create({
        name: 'Demo Student',
        email: 'student@example.com',
        class: 'Class 10',
        enrollmentDate: new Date(),
        password: hashedPassword
      });
      console.log('Demo student created');
    }

  } catch (error) {
    console.error('Error creating student collection:', error);
    throw error;
  }
};

export default createStudentCollection;