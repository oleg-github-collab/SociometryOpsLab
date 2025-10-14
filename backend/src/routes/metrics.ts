import { Router } from 'express';
import {
  getTeamMetrics,
  getMemberMetrics,
  calculateAssessmentMetrics,
} from '../controllers/metricsController';
import { authenticateAdmin } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/team', getTeamMetrics);
router.get('/member/:code', getMemberMetrics);

// Protected routes (admin only)
router.post('/assessment/:id/calculate', authenticateAdmin, calculateAssessmentMetrics);

export default router;
