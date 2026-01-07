// Shared Types and Interfaces for Eventora

// ============================================
// User Types
// ============================================
export interface User {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    preferences: UserPreferences;
    subscription: SubscriptionTier;
    location?: Location;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserPreferences {
    interests: EventCategory[];
    location: Location;
    notificationSettings: NotificationSettings;
    privacySettings: PrivacySettings;
}

export type SubscriptionTier = 'free' | 'pro';

export interface NotificationSettings {
    email: boolean;
    push: boolean;
    eventReminders: boolean;
    newRecommendations: boolean;
}

export interface PrivacySettings {
    profileVisibility: 'public' | 'private';
    showLocation: boolean;
}

// ============================================
// Event Types
// ============================================
export interface Event {
    id: string;
    title: string;
    description: string;
    creatorId: string;
    categories: EventCategory[];
    coverImage: EventImage;
    location: EventLocation;
    dateTime: EventDateTime;
    capacity?: number;
    ticketPrice?: number;
    status: EventStatus;
    analytics?: EventAnalytics;
    createdAt: Date;
    updatedAt: Date;
}

export type EventCategory =
    | 'technology'
    | 'business'
    | 'arts'
    | 'music'
    | 'sports'
    | 'food'
    | 'education'
    | 'health'
    | 'networking'
    | 'entertainment';

export interface EventImage {
    url: string;
    alt: string;
    photographer?: string;
    source: 'unsplash' | 'upload' | 'generated';
}

export interface EventLocation {
    type: 'physical' | 'virtual' | 'hybrid';
    address?: string;
    city: string;
    country: string;
    coordinates?: {
        lat: number;
        lng: number;
    };
    virtualLink?: string;
}

export interface EventDateTime {
    start: Date;
    end: Date;
    timezone: string;
}

export type EventStatus = 'draft' | 'published' | 'cancelled' | 'completed';

// ============================================
// Ticket Types
// ============================================
export interface Ticket {
    id: string;
    eventId: string;
    userId: string;
    qrCode: string;
    status: TicketStatus;
    metadata: TicketMetadata;
    createdAt: Date;
    checkedInAt?: Date;
}

export type TicketStatus = 'active' | 'used' | 'cancelled' | 'expired';

export interface TicketMetadata {
    ticketNumber: string;
    purchasePrice: number;
    attendeeName: string;
    attendeeEmail: string;
}

// ============================================
// Analytics Types
// ============================================
export interface EventAnalytics {
    eventId: string;
    views: number;
    registrations: number;
    checkIns: number;
    revenue: number;
    engagementRate: number;
    demographics?: UserDemographics;
}

export interface UserDemographics {
    ageGroups: Record<string, number>;
    locations: Record<string, number>;
    interests: Record<string, number>;
}

// ============================================
// AI Generation Types
// ============================================
export interface AIEventContent {
    title: string;
    description: string;
    categories: EventCategory[];
    suggestedDuration: number;
    targetAudience: string[];
}

export interface AIGenerationRequest {
    prompt: string;
    context?: {
        location?: string;
        targetAudience?: string;
        eventType?: string;
    };
}

// ============================================
// Location Types
// ============================================
export interface Location {
    city: string;
    country: string;
    coordinates?: {
        lat: number;
        lng: number;
    };
}

// ============================================
// API Response Types
// ============================================
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: ApiError;
    message?: string;
}

export interface ApiError {
    code: string;
    message: string;
    details?: any;
}

// ============================================
// Pagination Types
// ============================================
export interface PaginationParams {
    page: number;
    limit: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
