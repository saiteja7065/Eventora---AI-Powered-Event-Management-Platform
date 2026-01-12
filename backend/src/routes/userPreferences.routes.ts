import { Router } from 'express';
import { authenticateUser } from '../middleware/auth.middleware';
import {
    createOrUpdatePreferences,
    getUserPreferences,
    deleteUserPreferences
} from '../controllers/userPreferences.controller';

const router = Router();

// All routes require authentication
router.post('/preferences', authenticateUser, createOrUpdatePreferences);
router.get('/preferences', authenticateUser, getUserPreferences);
router.delete('/preferences', authenticateUser, deleteUserPreferences);

export default router;
