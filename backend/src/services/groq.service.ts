import Groq from 'groq-sdk';

/**
 * Groq AI Service
 * Handles AI-powered event generation using Groq's ultra-fast LLM API
 * FREE tier - no billing required!
 */

// Initialize Groq AI with proper error handling
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || ''
});

// Simple in-memory cache for common prompts (optimization)
const promptCache = new Map<string, any>();
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

export interface GeneratedEvent {
    title: string;
    description: string;
    categories: string[];
    suggestedLocation: {
        city: string;
        country: string;
        locationType: 'physical' | 'virtual' | 'hybrid';
    };
    suggestedDate?: string;
    estimatedDuration?: number; // in hours
    suggestedCapacity?: number;
    keywords: string[]; // For image search
}

/**
 * Generate event details from a user prompt using Groq AI
 * @param userPrompt - User's event description
 * @returns Generated event details
 */
export async function generateEventFromPrompt(userPrompt: string): Promise<GeneratedEvent> {
    try {
        // Check cache first (optimization)
        const cacheKey = userPrompt.toLowerCase().trim();
        const cached = promptCache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
            console.log('✅ Returning cached AI response');
            return cached.data;
        }

        // Enhanced prompt for better results
        const enhancedPrompt = `
You are an expert event planner. Based on the following user input, generate complete event details in JSON format.

User Input: "${userPrompt}"

Generate a JSON object with these fields:
{
  "title": "Catchy, professional event title (max 80 characters)",
  "description": "Compelling 2-3 paragraph description highlighting what attendees will experience and learn (200-300 words)",
  "categories": ["primary category", "secondary category", "tertiary category"] (choose from: Technology, Business, Health, Education, Arts, Music, Sports, Food, Charity, Networking, Workshop, Conference, Festival, Meetup),
  "suggestedLocation": {
    "city": "city name from prompt or most relevant city",
    "country": "country name",
    "locationType": "physical or virtual or hybrid based on context"
  },
  "suggestedDate": "ISO date string 2-3 months from now if not specified",
  "estimatedDuration": number of hours (typical for this event type),
  "suggestedCapacity": realistic number based on event type,
  "keywords": ["5-7 visual keywords for finding relevant images: event type, theme, atmosphere, venue style"]
}

Important:
- Be creative but professional
- Make descriptions engaging and benefit-focused
- Ensure keywords are specific and visual (for image search)
- If location not specified in prompt, suggest a major city relevant to the event type
- Keep tone professional yet exciting

Return ONLY the JSON object, no markdown formatting or explanations.
`;

        console.log(`🤖 Generating event from prompt: "${userPrompt.substring(0, 50)}..."`);

        // Call Groq API using llama-3.3-70b-versatile (fast and powerful)
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: 'user',
                    content: enhancedPrompt
                }
            ],
            model: 'llama-3.3-70b-versatile', // Fast, high-quality model
            temperature: 0.7,
            max_tokens: 1500,
            top_p: 1,
        });

        const responseText = completion.choices[0]?.message?.content;

        if (!responseText) {
            throw new Error('No response from Groq AI');
        }

        // Parse JSON response
        // Remove markdown code blocks if present
        const jsonText = responseText.replace(/```json\n?|\n?```/g, '').trim();
        const generatedEvent: GeneratedEvent = JSON.parse(jsonText);

        // Validate response
        if (!generatedEvent.title || !generatedEvent.description || !generatedEvent.categories) {
            throw new Error('Invalid AI response: missing required fields');
        }

        // Cache the result (optimization)
        promptCache.set(cacheKey, {
            data: generatedEvent,
            timestamp: Date.now()
        });

        console.log(`✅ Event generated: "${generatedEvent.title}"`);
        return generatedEvent;

    } catch (error: any) {
        console.error('❌ Groq AI Error:', error.message);

        // FALLBACK: If API fails, use mock data
        console.warn('⚠️ Using FALLBACK data - Check your GROQ_API_KEY in .env');

        // Generate mock event based on user prompt
        const mockEvent: GeneratedEvent = {
            title: `Event: ${userPrompt.substring(0, 50)}`,
            description: `This is a demonstration event generated from your prompt: "${userPrompt}". The AI service encountered an issue. Please check your GROQ_API_KEY in the backend/.env file.`,
            categories: ['Technology', 'Networking', 'Conference'],
            suggestedLocation: {
                city: 'San Francisco',
                country: 'USA',
                locationType: 'physical'
            },
            suggestedDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
            estimatedDuration: 4,
            suggestedCapacity: 100,
            keywords: ['event', 'conference', 'technology', 'networking', 'innovation']
        };

        return mockEvent;
    }
}

/**
 * Clear the prompt cache (useful for testing or memory management)
 */
export function clearCache(): void {
    promptCache.clear();
    console.log('🗑️ Prompt cache cleared');
}
