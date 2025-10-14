import { Router } from 'express';
import {
  getAllMembers,
  getMemberByCode,
  createMember,
  updateMember,
  deleteMember,
  bulkImportMembers,
} from '../controllers/memberController';
import { authenticateAdmin } from '../middleware/auth';

const router = Router();

// Public routes (for viewer dashboard)
router.get('/', getAllMembers);
router.get('/:code', getMemberByCode);

// Protected routes (admin only)
router.post('/', authenticateAdmin, createMember);
router.put('/:code', authenticateAdmin, updateMember);
router.delete('/:code', authenticateAdmin, deleteMember);
router.post('/bulk-import', authenticateAdmin, bulkImportMembers);

export default router;
