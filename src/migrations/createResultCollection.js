import mongoose from 'mongoose';

const createResultCollection = async () => {
  try {
    const collections = await mongoose.connection.db.listCollections().toArray();
    const resultCollectionExists = collections.some(col => col.name === 'results');

    if (!resultCollectionExists) {
      await mongoose.connection.createCollection('results', {
        validator: {
          $jsonSchema: {
            bsonType: 'object',
            required: ['student', 'exam', 'score', 'answers', 'submittedAt'],
            properties: {
              student: {
                bsonType: 'objectId',
                description: 'Student reference is required'
              },
              exam: {
                bsonType: 'objectId',
                description: 'Exam reference is required'
              },
              score: {
                bsonType: 'number',
                minimum: 0,
                description: 'Score must be a non-negative number'
              },
              answers: {
                bsonType: 'array',
                description: 'Answers array is required',
                items: {
                  bsonType: 'object',
                  required: ['question', 'answer', 'marks'],
                  properties: {
                    question: {
                      bsonType: 'objectId',
                      description: 'Question reference is required'
                    },
                    answer: {
                      bsonType: 'string',
                      description: 'Answer text is required'
                    },
                    marks: {
                      bsonType: 'number',
                      minimum: 0,
                      description: 'Marks must be a non-negative number'
                    }
                  }
                }
              },
              submittedAt: {
                bsonType: 'date',
                description: 'Submission timestamp'
              },
              gradedAt: {
                bsonType: 'date',
                description: 'Grading timestamp'
              }
            }
          }
        },
        validationAction: 'error'
      });

      console.log('Results collection created successfully');

      // Create indexes
      await mongoose.connection.collection('results').createIndex(
        { student: 1, exam: 1 },
        { unique: true }
      );
      await mongoose.connection.collection('results').createIndex(
        { submittedAt: -1 }
      );
      console.log('Result indexes created');
    }

  } catch (error) {
    console.error('Error creating result collection:', error);
    throw error;
  }
};

export default createResultCollection;