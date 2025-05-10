import mongoose from 'mongoose';
import Exam from '../models/Exam.js';

const createExamCollection = async () => {
  try {
    const collections = await mongoose.connection.db.listCollections().toArray();
    const examCollectionExists = collections.some(col => col.name === 'exams');

    if (!examCollectionExists) {
      await mongoose.connection.createCollection('exams', {
        validator: {
          $jsonSchema: {
            bsonType: 'object',
            required: ['name', 'subject', 'date', 'duration', 'totalMarks', 'questions'],
            properties: {
              name: {
                bsonType: 'string',
                description: 'Exam name is required'
              },
              subject: {
                bsonType: 'string',
                description: 'Subject is required'
              },
              date: {
                bsonType: 'date',
                description: 'Exam date is required'
              },
              duration: {
                bsonType: 'string',
                description: 'Duration is required'
              },
              totalMarks: {
                bsonType: 'number',
                minimum: 0,
                description: 'Total marks must be a non-negative number'
              },
              questions: {
                bsonType: 'array',
                description: 'Questions array is required',
                items: {
                  bsonType: 'object',
                  required: ['text', 'type', 'marks'],
                  properties: {
                    text: {
                      bsonType: 'string',
                      description: 'Question text is required'
                    },
                    type: {
                      enum: ['mcq', 'written'],
                      description: 'Question type must be mcq or written'
                    },
                    options: {
                      bsonType: 'array',
                      description: 'Options for MCQ questions',
                      items: {
                        bsonType: 'string'
                      }
                    },
                    marks: {
                      bsonType: 'number',
                      minimum: 0,
                      description: 'Marks must be a non-negative number'
                    }
                  }
                }
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

      console.log('Exams collection created successfully');

      // Create indexes
      await mongoose.connection.collection('exams').createIndex(
        { name: 1 },
        { unique: true }
      );
      await mongoose.connection.collection('exams').createIndex(
        { subject: 1 }
      );
      await mongoose.connection.collection('exams').createIndex(
        { date: 1 }
      );
      console.log('Exam indexes created');
    }

  } catch (error) {
    console.error('Error creating exam collection:', error);
    throw error;
  }
};

export default createExamCollection;