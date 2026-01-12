/**
 * API Client for Eventora Backend
 * Handles all API requests with proper error handling and types
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Types
export interface GenerateEventRequest {
    prompt: string;
}

export interface GeneratedEventResponse {
    success: boolean;
    data?: {
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
        coverImages: Array<{
            id: string;
            url: string;
            thumb: string;
            photographer: string;
            photographerUrl: string;
            alt: string;
        }>;
    };
    error?: string;
}

export interface CreateEventRequest {
    title: string;
    description: string;
    categories: string[];
    coverImage: {
        url: string;
        alt: string;
        photographer?: string;
        source: 'unsplash' | 'upload' | 'huggingface-sdxl';
    };
    locationType: 'physical' | 'virtual' | 'hybrid';
    address?: string;
    city: string;
    country: string;
    coordinates?: { lat: number; lng: number };
    virtualLink?: string;
    startTime: string;
    endTime: string;
    timezone?: string;
    capacity?: number;
    ticketPrice?: number;
}

/**
 * Upload event image
 */
export async function uploadEventImage(file: File): Promise<{ success: boolean; data?: { url: string }; error?: string }> {
    try {
        const token = await getAuthToken();

        if (!token) {
            throw new Error('You must be logged in to upload images');
        }

        const formData = new FormData();
        formData.append('image', file);

        const response = await fetch(`${API_URL}/api/events/upload-image`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to upload image');
        }

        return {
            success: true,
            data: { url: `${API_URL}${data.data.url}` }
        };
    } catch (error: any) {
        console.error('API Error:', error);
        return {
            success: false,
            error: error.message || 'Failed to upload image. Please try again.',
        };
    }
}

// ==========================================
// Get Events with Filters
// ==========================================

export interface GetEventsParams {
    search?: string;
    categories?: string[];
    city?: string;
    country?: string;
    startDate?: string;
    endDate?: string;
    minPrice?: number;
    maxPrice?: number;
    locationType?: 'physical' | 'virtual' | 'hybrid';
    sortBy?: 'date' | 'price' | 'startTime';
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
}

export interface EventsResponse {
    events: any[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasMore: boolean;
    };
}

/**
 * Get events with filters and pagination
 */
export async function getEvents(params: GetEventsParams = {}): Promise<{ success: boolean; data?: EventsResponse; error?: string }> {
    try {
        // Build query string
        const queryParams = new URLSearchParams();

        if (params.search) queryParams.append('search', params.search);
        if (params.categories && params.categories.length > 0) {
            queryParams.append('categories', params.categories.join(','));
        }
        if (params.city) queryParams.append('city', params.city);
        if (params.country) queryParams.append('country', params.country);
        if (params.startDate) queryParams.append('startDate', params.startDate);
        if (params.endDate) queryParams.append('endDate', params.endDate);
        if (params.minPrice !== undefined) queryParams.append('minPrice', params.minPrice.toString());
        if (params.maxPrice !== undefined) queryParams.append('maxPrice', params.maxPrice.toString());
        if (params.locationType) queryParams.append('locationType', params.locationType);
        if (params.sortBy) queryParams.append('sortBy', params.sortBy);
        if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
        if (params.page) queryParams.append('page', params.page.toString());
        if (params.limit) queryParams.append('limit', params.limit.toString());

        const url = `${API_URL}/api/events${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to fetch events');
        }

        return {
            success: true,
            data: data.data
        };
    } catch (error: any) {
        console.error('API Error:', error);
        return {
            success: false,
            error: error.message || 'Failed to fetch events',
        };
    }
}

// ==========================================
// User Preferences API
// ==========================================

export interface UserPreferences {
    userId: string;
    interests: string[];
    location?: {
        city: string;
        country: string;
        coordinates?: { lat: number; lng: number };
    };
    notificationSettings?: {
        email: boolean;
        eventReminders: boolean;
        weeklyDigest: boolean;
    };
    privacySettings?: {
        profileVisibility: 'public' | 'private';
        showLocation: boolean;
    };
    createdAt: string;
    updatedAt: string;
}

/**
 * Create or update user preferences
 */
export async function saveUserPreferences(preferences: {
    interests: string[];
    location?: { city: string; country: string; coordinates?: { lat: number; lng: number } };
    notificationSettings?: { email: boolean; eventReminders: boolean; weeklyDigest: boolean };
    privacySettings?: { profileVisibility: 'public' | 'private'; showLocation: boolean };
}): Promise<{ success: boolean; data?: UserPreferences; error?: string }> {
    try {
        const token = await getAuthToken();

        if (!token) {
            throw new Error('You must be logged in');
        }

        const response = await fetch(`${API_URL}/api/user/preferences`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(preferences),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to save preferences');
        }

        return {
            success: true,
            data: data.data
        };
    } catch (error: any) {
        console.error('API Error:', error);
        return {
            success: false,
            error: error.message || 'Failed to save preferences',
        };
    }
}

/**
 * Get user preferences
 */
export async function getUserPreferences(): Promise<{ success: boolean; data?: UserPreferences | null; error?: string }> {
    try {
        const token = await getAuthToken();

        if (!token) {
            throw new Error('You must be logged in');
        }

        const response = await fetch(`${API_URL}/api/user/preferences`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to fetch preferences');
        }

        return {
            success: true,
            data: data.data
        };
    } catch (error: any) {
        console.error('API Error:', error);
        return {
            success: false,
            error: error.message || 'Failed to fetch preferences',
        };
    }
}

/**
 * Get auth token from Supabase session
 */
async function getAuthToken(): Promise<string | null> {
    if (typeof window === 'undefined') return null;

    try {
        const { createClient } = await import('@/lib/supabase/client');
        const supabase = createClient();
        const { data } = await supabase.auth.getSession();
        return data.session?.access_token || null;
    } catch (error) {
        console.error('Failed to get auth token:', error);
        return null;
    }
}

/**
 * Generate event from AI prompt
 */
export async function generateEventFromPrompt(prompt: string): Promise<GeneratedEventResponse> {
    try {
        const response = await fetch(`${API_URL}/api/ai/generate-event`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to generate event');
        }

        return data;
    } catch (error: any) {
        console.error('API Error:', error);
        return {
            success: false,
            error: error.message || 'Failed to generate event. Please try again.',
        };
    }
}

/**
 * Create a new event
 */
export async function createEvent(eventData: CreateEventRequest) {
    try {
        const token = await getAuthToken();

        if (!token) {
            throw new Error('You must be logged in to create an event');
        }

        const response = await fetch(`${API_URL}/api/events`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(eventData),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to create event');
        }

        return data;
    } catch (error: any) {
        console.error('API Error:', error);
        throw error;
    }
}

/**
 * Get event by ID
 */
export async function getEventById(id: string): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
        const response = await fetch(`${API_URL}/api/events/${id}`, {
            method: 'GET',
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to fetch event');
        }

        return {
            success: true,
            data: data.data
        };
    } catch (error: any) {
        console.error('API Error:', error);
        return {
            success: false,
            error: error.message || 'Failed to fetch event'
        };
    }
}
