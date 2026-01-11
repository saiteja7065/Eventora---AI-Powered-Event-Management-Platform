import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

/**
 * Production AI Service - Google Gemini
 * Free tier: 60 requests/minute, no billing required
 */

// Cache for optimization
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
    estimatedDuration?: number;
    suggestedCapacity?: number;
    keywords: string[];
    aiGeneratedBanner?: {
        imageData: string; // base64 encoded image
        prompt: string;
        source: 'huggingface-sdxl';
    };
}

/**
 * Generate event from user prompt using Gemini
 */
export async function generateEventFromPrompt(userPrompt: string): Promise<GeneratedEvent> {
    // Read API key at runtime
    const API_KEY = process.env.GEMINI_API_KEY;

    if (!API_KEY) {
        throw new Error('GEMINI_API_KEY is not set in environment variables');
    }

    // Check cache first
    const cacheKey = userPrompt.toLowerCase().trim();
    const cached = promptCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        console.log('✅ Returning cached AI response');
        return cached.data;
    }

    console.log(`🤖 Generating event from prompt: "${userPrompt.substring(0, 50)}..."`);

    try {
        // Initialize Gemini with free tier model
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({
            model: 'gemini-2.5-flash',
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 2000, // Increased to prevent truncation
            },
            safetySettings: [
                {
                    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                    threshold: HarmBlockThreshold.BLOCK_NONE,
                },
                {
                    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                    threshold: HarmBlockThreshold.BLOCK_NONE,
                },
            ],
        });

        // Concise prompt for reliable JSON output
        const systemPrompt = `For: "${userPrompt}"

Generate ONLY valid JSON (no markdown):
{"title":"event name","description":"brief 1-2 sentence description (max 100 words)","categories":["cat1","cat2"],"suggestedLocation":{"city":"City","country":"Country","locationType":"physical"},"suggestedDate":"2024-12-15T10:00:00Z","estimatedDuration":4,"suggestedCapacity":100,"keywords":["kw1","kw2","kw3"]}

Keep description concise. Return JSON only:`;

        // Generate content
        const result = await model.generateContent(systemPrompt);
        const response = result.response;

        // Check finish reason
        const finishReason = response.candidates?.[0]?.finishReason;
        console.log('🏁 Finish reason:', finishReason);

        const responseText = response.text();

        // Log both start and end of response
        console.log('📝 Response START:', responseText.substring(0, 200));
        console.log('📝 Response END:', responseText.substring(responseText.length - 100));

        // Clean response - handle multiple formats
        let cleanedText = responseText.trim();

        // Remove markdown code blocks aggressively  
        cleanedText = cleanedText.replace(/```json\s*/gi, '').replace(/```\s*/g, '');

        console.log('🧹 Cleaned text length:', cleanedText.length);
        console.log('🧹 Cleaned START:', cleanedText.substring(0, 100));
        console.log('🧹 Cleaned END:', cleanedText.substring(cleanedText.length - 100));

        // Find JSON object - use greedy match to get complete object
        let jsonMatch = cleanedText.match(/\{[\s\S]*\}/);

        // If not found, try to find between first { and last }
        if (!jsonMatch) {
            const firstBrace = cleanedText.indexOf('{');
            const lastBrace = cleanedText.lastIndexOf('}');
            if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
                jsonMatch = [cleanedText.substring(firstBrace, lastBrace + 1)];
                console.log('✅ Found JSON using brace method');
            }
        } else {
            console.log('✅ Found JSON using regex');
        }

        if (!jsonMatch) {
            console.error('❌ No JSON found');
            console.error('Full response:', responseText);
            throw new Error('No valid JSON found in AI response');
        }

        console.log('🎯 Extracted JSON length:', jsonMatch[0].length);

        const generatedEvent: GeneratedEvent = JSON.parse(jsonMatch[0]);

        // Validate required fields
        if (!generatedEvent.title || !generatedEvent.description) {
            throw new Error('AI response missing required fields');
        }

        // Ensure arrays and defaults
        if (!Array.isArray(generatedEvent.categories) || generatedEvent.categories.length === 0) {
            generatedEvent.categories = ['Technology', 'Networking', 'Conference'];
        }

        if (!Array.isArray(generatedEvent.keywords) || generatedEvent.keywords.length === 0) {
            generatedEvent.keywords = ['event', 'conference', 'networking', 'professional', 'innovation'];
        }

        if (!generatedEvent.suggestedLocation) {
            generatedEvent.suggestedLocation = {
                city: 'San Francisco',
                country: 'USA',
                locationType: 'physical'
            };
        }

        generatedEvent.estimatedDuration = generatedEvent.estimatedDuration || 4;
        generatedEvent.suggestedCapacity = generatedEvent.suggestedCapacity || 100;
        generatedEvent.suggestedDate = generatedEvent.suggestedDate ||
            new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString();

        // Cache the result
        promptCache.set(cacheKey, {
            data: generatedEvent,
            timestamp: Date.now()
        });

        console.log(`✅ Event generated successfully: "${generatedEvent.title}"`);
        return generatedEvent;

    } catch (error: any) {
        console.error('❌ Gemini AI Error:', error.message);

        // If API key is invalid, throw clear error
        if (error.message?.includes('API_KEY_INVALID') || error.message?.includes('API key not valid')) {
            throw new Error('Invalid Gemini API key. Get a new key from https://aistudio.google.com/app/apikey');
        }

        throw new Error(`Failed to generate event with AI: ${error.message}`);
    }
}

/**
 * Clear cache
 */
export function clearCache(): void {
    promptCache.clear();
    console.log('🗑️ Prompt cache cleared');
}

/**
 * Generate event banner image using HuggingFace Stable Diffusion
 * Free tier: ~300 requests/hour, no billing required
 */
export async function generateEventBanner(
    title: string,
    description: string,
    keywords: string[]
): Promise<{ imageData: string; prompt: string; source: 'huggingface-sdxl' } | null> {
    const API_KEY = process.env.HUGGINGFACE_API_KEY;

    if (!API_KEY) {
        console.warn('⚠️ HUGGINGFACE_API_KEY not set, skipping banner generation');
        return null;
    }

    // Build a descriptive prompt for the banner
    const bannerPrompt = `Professional event banner for "${title}". ${description.substring(0, 100)}. Modern, vibrant, high-quality digital art, professional design, ${keywords.slice(0, 3).join(', ')}, landscape orientation, no text`;

    // Check cache first
    const cacheKey = `banner:${title.toLowerCase().trim()}`;
    const cached = promptCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        console.log('✅ Returning cached banner');
        return cached.data;
    }

    console.log(`🎨 Generating event banner with HuggingFace for: "${title}"`);

    try {
        // Use HuggingFace Inference API
        const { HfInference } = await import('@huggingface/inference');
        const hf = new HfInference(API_KEY);

        // Use Stable Diffusion XL for high-quality images
        // Note: HuggingFace types incorrectly say this returns 'string', but it actually returns a Blob
        const response: any = await hf.textToImage({
            model: 'stabilityai/stable-diffusion-xl-base-1.0',
            inputs: bannerPrompt,
            parameters: {
                negative_prompt: 'text, words, letters, watermark, low quality, blurry',
                num_inference_steps: 30,
                guidance_scale: 7.5
            }
        });

        // Convert response to base64
        // HuggingFace returns a Blob in the browser, but in Node.js it returns a Blob-like object
        let buffer: Buffer;

        if (response instanceof Buffer || response instanceof Uint8Array) {
            // Already a buffer
            buffer = Buffer.from(response);
        } else if (typeof response === 'object' && response !== null && 'arrayBuffer' in response) {
            // It's a Blob-like object
            const arrayBuffer = await (response as Blob).arrayBuffer();
            buffer = Buffer.from(arrayBuffer);
        } else {
            throw new Error('Unexpected response type from HuggingFace API');
        }

        const imageData = buffer.toString('base64');

        if (!imageData) {
            throw new Error('No image data generated');
        }

        const result = {
            imageData,
            prompt: bannerPrompt,
            source: 'huggingface-sdxl' as const
        };

        // Cache the result
        promptCache.set(cacheKey, {
            data: result,
            timestamp: Date.now()
        });

        console.log(`✅ Banner generated successfully with HuggingFace for "${title}"`);
        return result;

    } catch (error: any) {
        console.error('❌ HuggingFace API Error:', error.message);

        // Return null on error - caller will use Unsplash fallback
        return null;
    }
}
