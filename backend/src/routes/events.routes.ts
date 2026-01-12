import { Router } from 'express';
import {
    uploadEventImage,
    createEvent,
    getEvents,
    getEventById,
    updateEvent,
    deleteEvent
} from '../controllers/events.controller';
import { authenticateUser, optionalAuth } from '../middleware/auth.middleware';
import { uploadEventImage as uploadMiddleware } from '../middleware/upload.middleware';

const router = Router();

/**
 * Events Routes
 * /api/events/*
 */

// GET /api/events - Get all events (public, with optional auth for personalization)
router.get('/', optionalAuth, getEvents);

// GET /api/events/:id - Get event by ID (public)
router.get('/:id', getEventById);

// POST /api/events/upload-image - Upload event image (requires auth)
router.post('/upload-image', authenticateUser, uploadMiddleware.single('image'), uploadEventImage);

// POST /api/events - Create event (requires auth)
router.post('/', authenticateUser, createEvent);

// PATCH /api/events/:id - Update event (requires auth)
router.patch('/:id', authenticateUser, updateEvent);

// DELETE /api/events/:id - Delete event (requires auth)
router.delete('/:id', authenticateUser, deleteEvent);

export default router;
