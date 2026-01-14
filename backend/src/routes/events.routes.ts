import { Router } from 'express';
import {
    uploadEventImage,
    createEvent,
    getEvents,
    getEventById,
    updateEvent,
    deleteEvent,
    getMyEvents
} from '../controllers/events.controller';
import { authenticateUser, optionalAuth } from '../middleware/auth.middleware';
import { uploadEventImage as uploadMiddleware } from '../middleware/upload.middleware';
import {
    registerForEvent,
    cancelRegistration,
    getEventAttendees,
    getMyRegistrations,
    getRegistrationStatus
} from '../controllers/registrations.controller';

const router = Router();

/**
 * Events Routes
 * /api/events/*
 */

// GET /api/events - Get all events (public, with optional auth for personalization)
router.get('/', optionalAuth, getEvents);

// GET /api/events/my-events - Get user's created events (requires auth)
router.get('/my-events', authenticateUser, getMyEvents);

// GET /api/events/my-registrations - Get user's registered events (requires auth)
// IMPORTANT: Must be before /:id route to prevent route matching conflict
router.get('/my-registrations', authenticateUser, getMyRegistrations);

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

// Registration routes

// GET /api/events/:id/registration-status - Get registration status for event
router.get('/:id/registration-status', optionalAuth, getRegistrationStatus);

// GET /api/events/:id/attendees - Get event attendees (organizer only, requires auth)
router.get('/:id/attendees', authenticateUser, getEventAttendees);

// POST /api/events/:id/register - Register for event (requires auth)
router.post('/:id/register', authenticateUser, registerForEvent);

// DELETE /api/events/:id/register - Cancel registration (requires auth)
router.delete('/:id/register', authenticateUser, cancelRegistration);

export default router;
