import { Router } from 'express';
import {
  getAllAssessments,
  getAssessmentById,
  createAssessment,
  updateAssessment,
  deleteAssessment,
} from '../controllers/assessmentController';
import { authenticateAdmin } from '../middleware/auth';

const router = Router();

// Public routes (for viewer dashboard)
router.get('/', getAllAssessments);
router.get('/:id', getAssessmentById);

// Protected routes (admin only)
router.post('/', authenticateAdmin, createAssessment);
router.put('/:id', authenticateAdmin, updateAssessment);
router.delete('/:id', authenticateAdmin, deleteAssessment);

export default router;
