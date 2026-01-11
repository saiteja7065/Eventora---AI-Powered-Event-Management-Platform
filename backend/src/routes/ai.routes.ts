import { Router } from 'express';
import { generateEvent, generateBanner } from '../controllers/ai.controller';

const router = Router();

/**
 * AI Routes
 * /api/ai/*
 */

// POST /api/ai/generate-event - Generate event from prompt (no auth required for demo)
router.post('/generate-event', generateEvent);

// POST /api/ai/generate-banner - Generate event banner image
router.post('/generate-banner', generateBanner);

export default router;
