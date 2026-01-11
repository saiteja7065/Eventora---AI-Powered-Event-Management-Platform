import { Request, Response } from 'express';
import { generateEventFromPrompt, generateEventBanner } from '../services/ai.service';
import { searchEventImages } from '../services/unsplash.service';

/**
 * AI Controller
 * Handles AI-powered event generation requests
 */

/**
 * POST /api/ai/generate-event
 * Generate event details from a user prompt
 */
export async function generateEvent(req: Request, res: Response) {
    try {
        const { prompt } = req.body;

        // Validation
        if (!prompt || typeof prompt !== 'string') {
            return res.status(400).json({
                success: false,
                error: 'Prompt is required and must be a string'
            });
        }

        if (prompt.trim().length < 10) {
            return res.status(400).json({
                success: false,
                error: 'Prompt must be at least 10 characters long'
            });
        }

        if (prompt.length > 500) {
            return res.status(400).json({
                success: false,
                error: 'Prompt must be less than 500 characters'
            });
        }

        console.log(`🤖 Generating event from prompt: "${prompt.substring(0, 50)}..."`);

        // Generate event details and fetch images in parallel (optimization)
        const [eventDetails, images] = await Promise.all([
            generateEventFromPrompt(prompt),
            // We'll fetch images after getting keywords, but prepare the call
            Promise.resolve(null)
        ]);

        // Now search for images and generate AI banner using the keywords from AI
        const [coverImages, aiBanner] = await Promise.all([
            searchEventImages(eventDetails.keywords, 5),
            generateEventBanner(eventDetails.title, eventDetails.description, eventDetails.keywords)
        ]);

        // Add AI banner to event details if generated
        if (aiBanner) {
            eventDetails.aiGeneratedBanner = aiBanner;
        }

        // Combine results
        const result = {
            ...eventDetails,
            coverImages
        };

        console.log(`✅ Event generated: "${result.title}"`);

        res.json({
            success: true,
            data: result
        });

    } catch (error: any) {
        console.error('❌ Error generating event:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to generate event'
        });
    }
}

/**
 * POST /api/ai/generate-banner
 * Generate event banner image from event details
 */
export async function generateBanner(req: Request, res: Response) {
    try {
        const { title, description, keywords } = req.body;

        // Validation
        if (!title || !description) {
            return res.status(400).json({
                success: false,
                error: 'Title and description are required'
            });
        }

        if (!keywords || !Array.isArray(keywords) || keywords.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Keywords array is required'
            });
        }

        console.log(`🎨 Generating banner for: "${title}"`);

        const banner = await generateEventBanner(title, description, keywords);

        if (!banner) {
            return res.status(500).json({
                success: false,
                error: 'Failed to generate banner. Please try again.'
            });
        }

        res.json({
            success: true,
            data: banner
        });

    } catch (error: any) {
        console.error('❌ Error generating banner:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to generate banner'
        });
    }
}
