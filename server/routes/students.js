import express from 'express';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Mock data (replace with database in production)
let students = [
  {
    _id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    class: '12A',
    enrollmentDate: '2024-01-15'
  }
];

// Validation middleware
const studentValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('class').notEmpty().withMessage('Class is required'),
  body('enrollmentDate').notEmpty().withMessage('Enrollment date is required')
];

// Get all students
router.get('/', (req, res) => {
  res.json(students);
});

// Get student by ID
router.get('/:id', (req, res) => {
  const student = students.find(s => s._id === req.params.id);
  if (!student) {
    return res.status(404).json({ message: 'Student not found' });
  }
  res.json(student);
});

// Create new student
router.post('/', studentValidation, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const newStudent = {
    _id: Date.now().toString(),
    ...req.body
  };

  students.push(newStudent);
  res.status(201).json(newStudent);
});

// Update student
router.put('/:id', studentValidation, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const studentIndex = students.findIndex(s => s._id === req.params.id);
  if (studentIndex === -1) {
    return res.status(404).json({ message: 'Student not found' });
  }

  students[studentIndex] = {
    ...students[studentIndex],
    ...req.body
  };

  res.json(students[studentIndex]);
});

// Delete student
router.delete('/:id', (req, res) => {
  const studentIndex = students.findIndex(s => s._id === req.params.id);
  if (studentIndex === -1) {
    return res.status(404).json({ message: 'Student not found' });
  }

  students = students.filter(s => s._id !== req.params.id);
  res.json({ message: 'Student deleted successfully' });
});

export default router;