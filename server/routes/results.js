import express from 'express';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Mock data (replace with database in production)
let results = [
  {
    _id: '1',
    student: {
      name: 'Student User'
    },
    exam: {
      name: 'Mathematics Final'
    },
    score: 85,
    submittedAt: '2024-03-20T10:30:00Z'
  }
];

// Validation middleware
const resultValidation = [
  body('student').notEmpty().withMessage('Student information is required'),
  body('exam').notEmpty().withMessage('Exam information is required'),
  body('score').isNumeric().withMessage('Score must be a number'),
  body('submittedAt').notEmpty().withMessage('Submission date is required')
];

// Get all results
router.get('/', (req, res) => {
  res.json(results);
});

// Get result by ID
router.get('/:id', (req, res) => {
  const result = results.find(r => r._id === req.params.id);
  if (!result) {
    return res.status(404).json({ message: 'Result not found' });
  }
  res.json(result);
});

// Create new result
router.post('/', resultValidation, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const newResult = {
    _id: Date.now().toString(),
    ...req.body
  };

  results.push(newResult);
  res.status(201).json(newResult);
});

// Update result
router.put('/:id', resultValidation, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const resultIndex = results.findIndex(r => r._id === req.params.id);
  if (resultIndex === -1) {
    return res.status(404).json({ message: 'Result not found' });
  }

  results[resultIndex] = {
    ...results[resultIndex],
    ...req.body
  };

  res.json(results[resultIndex]);
});

// Delete result
router.delete('/:id', (req, res) => {
  const resultIndex = results.findIndex(r => r._id === req.params.id);
  if (resultIndex === -1) {
    return res.status(404).json({ message: 'Result not found' });
  }

  results = results.filter(r => r._id !== req.params.id);
  res.json({ message: 'Result deleted successfully' });
});

export default router;