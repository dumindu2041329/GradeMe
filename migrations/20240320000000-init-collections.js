export const up = async (db) => {
  // Create users collection with validation
  await db.createCollection("users", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["firstName", "lastName", "email", "password", "role"],
        properties: {
          firstName: {
            bsonType: "string",
            description: "First name is required"
          },
          lastName: {
            bsonType: "string",
            description: "Last name is required"
          },
          email: {
            bsonType: "string",
            pattern: "^\\w+([.-]?\\w+)*@\\w+([.-]?\\w+)*(\\.\\w{2,3})+$",
            description: "Must be a valid email address"
          },
          password: {
            bsonType: "string",
            minLength: 6,
            description: "Password must be at least 6 characters"
          },
          role: {
            enum: ["admin", "student"],
            description: "Role must be either admin or student"
          },
          isActive: {
            bsonType: "bool",
            description: "Must be a boolean"
          },
          lastLogin: {
            bsonType: ["date", "null"],
            description: "Must be a date or null"
          }
        }
      }
    }
  });

  // Create students collection with validation
  await db.createCollection("students", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["name", "email", "class", "enrollmentDate", "password"],
        properties: {
          name: {
            bsonType: "string",
            description: "Student name is required"
          },
          email: {
            bsonType: "string",
            pattern: "^\\w+([.-]?\\w+)*@\\w+([.-]?\\w+)*(\\.\\w{2,3})+$",
            description: "Must be a valid email address"
          },
          class: {
            bsonType: "string",
            description: "Class is required"
          },
          enrollmentDate: {
            bsonType: "date",
            description: "Enrollment date is required"
          },
          password: {
            bsonType: "string",
            minLength: 6,
            description: "Password must be at least 6 characters"
          }
        }
      }
    }
  });

  // Create exams collection with validation
  await db.createCollection("exams", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["name", "subject", "date", "duration", "totalMarks", "questions"],
        properties: {
          name: {
            bsonType: "string",
            description: "Exam name is required"
          },
          subject: {
            bsonType: "string",
            description: "Subject is required"
          },
          date: {
            bsonType: "date",
            description: "Exam date is required"
          },
          duration: {
            bsonType: "string",
            description: "Duration is required"
          },
          totalMarks: {
            bsonType: "number",
            minimum: 0,
            description: "Total marks must be a non-negative number"
          },
          questions: {
            bsonType: "array",
            description: "Questions array is required",
            items: {
              bsonType: "object",
              required: ["text", "type", "marks"],
              properties: {
                text: {
                  bsonType: "string",
                  description: "Question text is required"
                },
                type: {
                  enum: ["mcq", "written"],
                  description: "Question type must be mcq or written"
                },
                options: {
                  bsonType: "array",
                  description: "Options for MCQ questions",
                  items: {
                    bsonType: "string"
                  }
                },
                marks: {
                  bsonType: "number",
                  minimum: 0,
                  description: "Marks must be a non-negative number"
                }
              }
            }
          }
        }
      }
    }
  });

  // Create results collection with validation
  await db.createCollection("results", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["student", "exam", "score", "answers", "submittedAt"],
        properties: {
          student: {
            bsonType: "objectId",
            description: "Student reference is required"
          },
          exam: {
            bsonType: "objectId",
            description: "Exam reference is required"
          },
          score: {
            bsonType: "number",
            minimum: 0,
            description: "Score must be a non-negative number"
          },
          answers: {
            bsonType: "array",
            description: "Answers array is required",
            items: {
              bsonType: "object",
              required: ["question", "answer", "marks"],
              properties: {
                question: {
                  bsonType: "objectId",
                  description: "Question reference is required"
                },
                answer: {
                  bsonType: "string",
                  description: "Answer text is required"
                },
                marks: {
                  bsonType: "number",
                  minimum: 0,
                  description: "Marks must be a non-negative number"
                }
              }
            }
          },
          submittedAt: {
            bsonType: "date",
            description: "Submission timestamp"
          },
          gradedAt: {
            bsonType: "date",
            description: "Grading timestamp"
          }
        }
      }
    }
  });

  // Create indexes
  await db.collection("users").createIndex({ email: 1 }, { unique: true });
  await db.collection("students").createIndex({ email: 1 }, { unique: true });
  await db.collection("exams").createIndex({ name: 1 }, { unique: true });
  await db.collection("results").createIndex({ student: 1, exam: 1 }, { unique: true });
};

export const down = async (db) => {
  await db.collection("users").drop();
  await db.collection("students").drop();
  await db.collection("exams").drop();
  await db.collection("results").drop();
};