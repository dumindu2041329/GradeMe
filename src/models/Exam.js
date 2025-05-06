import mongoose from 'mongoose';

const examSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Exam name is required'],
    trim: true
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true
  },
  date: {
    type: Date,
    required: [true, 'Exam date is required']
  },
  duration: {
    type: String,
    required: [true, 'Duration is required'],
    trim: true
  },
  totalMarks: {
    type: Number,
    required: [true, 'Total marks is required'],
    min: [0, 'Total marks cannot be negative']
  },
  questions: [{
    text: {
      type: String,
      required: [true, 'Question text is required']
    },
    type: {
      type: String,
      enum: ['mcq', 'written'],
      required: [true, 'Question type is required']
    },
    options: {
      type: [String],
      validate: {
        validator: function(options) {
          return this.type !== 'mcq' || (options && options.length === 4);
        },
        message: 'MCQ questions must have exactly 4 options'
      }
    },
    marks: {
      type: Number,
      required: [true, 'Question marks are required'],
      min: [0, 'Marks cannot be negative']
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
examSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Exam = mongoose.model('Exam', examSchema);

export default Exam;