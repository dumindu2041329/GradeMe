import express from 'express';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Mock data (replace with database in production)
let exams = [
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
  }
];

// Validation middleware
const examValidation = [
  body('name').notEmpty().withMessage('Exam name is required'),
  body('subject').notEmpty().withMessage('Subject is required'),
  body('date').notEmpty().withMessage('Date is required'),
  body('duration').notEmpty().withMessage('Duration is required'),
  body('questions').isArray().withMessage('Questions must be an array'),
  body('totalMarks').isNumeric().withMessage('Total marks must be a number')
];

// Get all exams
router.get('/', (req, res) => {
  res.json(exams);
});

// Get exam by ID
router.get('/:id', (req, res) => {
  const exam = exams.find(e => e._id === req.params.id);
  if (!exam) {
    return res.status(404).json({ message: 'Exam not found' });
  }
  res.json(exam);
});

// Create new exam
router.post('/', examValidation, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const newExam = {
    _id: Date.now().toString(),
    ...req.body
  };

  exams.push(newExam);
  res.status(201).json(newExam);
});

// Update exam
router.put('/:id', examValidation, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const examIndex = exams.findIndex(e => e._id === req.params.id);
  if (examIndex === -1) {
    return res.status(404).json({ message: 'Exam not found' });
  }

  exams[examIndex] = {
    ...exams[examIndex],
    ...req.body
  };

  res.json(exams[examIndex]);
});

// Delete exam
router.delete('/:id', (req, res) => {
  const examIndex = exams.findIndex(e => e._id === req.params.id);
  if (examIndex === -1) {
    return res.status(404).json({ message: 'Exam not found' });
  }

  exams = exams.filter(e => e._id !== req.params.id);
  res.json({ message: 'Exam deleted successfully' });
});

export default router;