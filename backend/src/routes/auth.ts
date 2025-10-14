import { Router } from 'express';
import { adminLogin, viewerAuth, getMe } from '../controllers/authController';
import { authenticateAdmin } from '../middleware/auth';

const router = Router();

router.post('/admin/login', adminLogin);
router.post('/viewer/auth', viewerAuth);
router.get('/me', authenticateAdmin, getMe);

export default router;
