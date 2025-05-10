import express from 'express';
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  resetPassword
} from '../controllers/userController.js';

const router = express.Router();

// CRUD routes
router.get('/', getUsers);
router.get('/:id', getUser);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

// Authentication routes
router.post('/login', loginUser);
router.post('/reset-password', resetPassword);

export default router;