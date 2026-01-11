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
        source: 'unsplash' | 'upload';
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
 * Get all events
 */
export async function getEvents(params?: {
    page?: number;
    limit?: number;
    status?: string;
    city?: string;
    category?: string;
}) {
    try {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());
        if (params?.status) queryParams.append('status', params.status);
        if (params?.city) queryParams.append('city', params.city);
        if (params?.category) queryParams.append('category', params.category);

        const response = await fetch(`${API_URL}/api/events?${queryParams}`, {
            method: 'GET',
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to fetch events');
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
export async function getEventById(id: string) {
    try {
        const response = await fetch(`${API_URL}/api/events/${id}`, {
            method: 'GET',
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to fetch event');
        }

        return data;
    } catch (error: any) {
        console.error('API Error:', error);
        throw error;
    }
}
