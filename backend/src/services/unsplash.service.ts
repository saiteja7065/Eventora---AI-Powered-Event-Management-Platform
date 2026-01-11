import axios from 'axios';

/**
 * Unsplash Image Service
 * Searches for relevant event cover images using Unsplash API
 * Optimized with proper error handling and image selection
 */

const UNSPLASH_API_URL = 'https://api.unsplash.com';
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

export interface UnsplashImage {
    id: string;
    url: string;
    thumb: string;
    photographer: string;
    photographerUrl: string;
    alt: string;
    downloadUrl: string;
}

/**
 * Search for event cover images based on keywords
 * @param keywords - Array of search terms
 * @param count - Number of images to return (default: 5)
 * @returns Array of curated images
 */
export async function searchEventImages(keywords: string[], count: number = 5): Promise<UnsplashImage[]> {
    try {
        // Build search query from keywords
        const query = keywords.join(' ');

        console.log(`🔍 Searching Unsplash for: "${query}"`);

        const response = await axios.get(`${UNSPLASH_API_URL}/search/photos`, {
            params: {
                query,
                per_page: count,
                orientation: 'landscape',
                content_filter: 'high' // Family-friendly content
            },
            headers: {
                'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
            },
            timeout: 5000 // 5 second timeout
        });

        const photos = response.data.results;

        // Transform to our interface
        const images: UnsplashImage[] = photos.map((photo: any) => ({
            id: photo.id,
            url: photo.urls.regular, // High quality for display
            thumb: photo.urls.thumb, // Thumbnail for previews
            photographer: photo.user.name,
            photographerUrl: photo.user.links.html,
            alt: photo.alt_description || `Event image related to ${query}`,
            downloadUrl: photo.links.download_location
        }));

        console.log(`✅ Found ${images.length} images from Unsplash`);
        return images;

    } catch (error: any) {
        console.error('❌ Unsplash API Error:', error.message);

        // Return placeholder images on error (graceful degradation)
        return getPlaceholderImages(keywords[0] || 'event', count);
    }
}

/**
 * Get placeholder images when Unsplash API fails
 * Uses Unsplash's source API which doesn't require authentication
 */
function getPlaceholderImages(keyword: string, count: number): UnsplashImage[] {
    const placeholders: UnsplashImage[] = [];

    for (let i = 0; i < count; i++) {
        placeholders.push({
            id: `placeholder-${i}`,
            url: `https://source.unsplash.com/1200x600/?${keyword},event`,
            thumb: `https://source.unsplash.com/400x300/?${keyword},event`,
            photographer: 'Unsplash',
            photographerUrl: 'https://unsplash.com',
            alt: `${keyword} event`,
            downloadUrl: ''
        });
    }

    console.log('⚠️ Using placeholder images due to API error');
    return placeholders;
}

/**
 * Trigger download tracking for Unsplash (required by their API guidelines)
 * @param downloadUrl - The download URL from the photo object
 */
export async function trackImageDownload(downloadUrl: string): Promise<void> {
    try {
        if (!downloadUrl) return;

        await axios.get(downloadUrl, {
            headers: {
                'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
            }
        });

        console.log('✅ Image download tracked');
    } catch (error) {
        // Non-critical, just log
        console.warn('⚠️ Failed to track image download');
    }
}
