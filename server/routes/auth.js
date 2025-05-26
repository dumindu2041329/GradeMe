import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Mock user data (replace with database in production)
const users = [
  {
    id: '1',
    email: 'admin@example.com',
    password: '$2a$10$XOPbrlUPQdwdJUpSrIF6X.LbE14qsMmKGhM1A8W9iqDOMJVF7/oY2', // admin123
    name: 'Admin User',
    role: 'admin'
  },
  {
    id: '2',
    email: 'student@example.com',
    password: '$2a$10$YuKhhZ4.Mp0V5BbP5VNqc.y2h5AL4tDt.dCi3qPvh2PWyKGFGQK4O', // student123
    name: 'Student User',
    role: 'student'
  }
];

// Login validation middleware
const loginValidation = [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

// Login route
router.post('/login', loginValidation, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const user = users.find(u => u.email === email);

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;