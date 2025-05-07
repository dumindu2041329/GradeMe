import express from 'express';
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  loginUser
} from '../controllers/userController.js';

const router = express.Router();

// CRUD routes
router.get('/', getUsers);
router.get('/:id', getUser);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

// Authentication route
router.post('/login', loginUser);

export default router;