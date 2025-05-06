import express from 'express';
import {
  getResults,
  getResult,
  getStudentResults,
  getExamResults,
  createResult,
  updateResult,
  deleteResult
} from '../controllers/resultController.js';

const router = express.Router();

router.get('/', getResults);
router.get('/:id', getResult);
router.get('/student/:studentId', getStudentResults);
router.get('/exam/:examId', getExamResults);
router.post('/', createResult);
router.put('/:id', updateResult);
router.delete('/:id', deleteResult);

export default router;