/**
 * Event Types
 * Shared type definitions for events across the application
 */

export interface Event {
    id: string;
    title: string;
    description: string;
    coverImage: {
        url: string;
        alt: string;
        photographer?: string;
        photographerUrl?: string;
        source?: 'unsplash' | 'upload' | 'huggingface-sdxl';
    };
    categories: string[];
    locationType: 'physical' | 'virtual' | 'hybrid';
    address?: string;
    city: string;
    country: string;
    coordinates?: {
        lat: number;
        lng: number;
    };
    virtualLink?: string;
    startTime: string | Date;
    endTime: string | Date;
    timezone?: string;
    capacity?: number;
    ticketPrice: number;
    status: 'DRAFT' | 'PUBLISHED' | 'CANCELLED';
    creatorId: string;
    creator?: {
        id: string;
        name: string;
        email: string;
        avatar?: string;
    };
    createdAt?: string | Date;
    updatedAt?: string | Date;
}

export interface EventCardData {
    id: string;
    title: string;
    description: string;
    coverImage: {
        url: string;
        alt: string;
    };
    categories: string[];
    city: string;
    country: string;
    startTime: string;
    ticketPrice: number;
    capacity?: number;
    locationType: 'physical' | 'virtual' | 'hybrid';
}

export interface MyEvent {
    id: string;
    title: string;
    description: string;
    coverImage: {
        url: string;
        alt: string;
    };
    categories: string[];
    city: string;
    country: string;
    startTime: string | Date;
    endTime: string | Date;
    status: string;
    ticketPrice: number;
    capacity?: number;
    locationType: string;
    createdAt: string | Date;
    stats: {
        views: number;
        rsvps: number;
        isUpcoming: boolean;
        isPast: boolean;
    };
}
