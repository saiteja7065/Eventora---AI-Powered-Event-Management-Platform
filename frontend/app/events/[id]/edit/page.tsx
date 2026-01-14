'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Calendar, MapPin, Users, IndianRupee, AlertCircle, Save, X, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { getEventById, updateEvent } from '@/lib/api-client';
import Link from 'next/link';

export default function EditEventPage() {
    const { user } = useAuth();
    const router = useRouter();
    const params = useParams();
    const eventId = params.id as string;

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [event, setEvent] = useState<any>(null);

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        categories: [] as string[],
        city: '',
        country: '',
        locationType: 'physical' as 'physical' | 'virtual' | 'hybrid',
        startTime: '',
        endTime: '',
        capacity: '',
        ticketPrice: '0',
    });

    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

    // Fetch event data on mount
    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await getEventById(eventId);

                if (!response.success || !response.data) {
                    setError(response.error || 'Event not found');
                    return;
                }

                const eventData = response.data;
                setEvent(eventData);

                // Pre-populate form
                setFormData({
                    title: eventData.title || '',
                    description: eventData.description || '',
                    categories: eventData.categories || [],
                    city: eventData.city || '',
                    country: eventData.country || '',
                    locationType: eventData.locationType || 'physical',
                    startTime: eventData.startTime ? new Date(eventData.startTime).toISOString().slice(0, 16) : '',
                    endTime: eventData.endTime ? new Date(eventData.endTime).toISOString().slice(0, 16) : '',
                    capacity: eventData.capacity?.toString() || '',
                    ticketPrice: eventData.ticketPrice?.toString() || '0',
                });
            } catch (err: any) {
                setError(err.message || 'Failed to load event');
            } finally {
                setIsLoading(false);
            }
        };

        if (eventId) {
            fetchEvent();
        }
    }, [eventId]);

    const validateForm = (): boolean => {
        const errors: Record<string, string> = {};

        if (!formData.title.trim()) {
            errors.title = 'Event title is required';
        }
        if (!formData.description.trim()) {
            errors.description = 'Event description is required';
        }
        if (formData.categories.length === 0) {
            errors.categories = 'At least one category is required';
        }
        if (!formData.city.trim()) {
            errors.city = 'City is required';
        }
        if (!formData.country.trim()) {
            errors.country = 'Country is required';
        }
        if (!formData.startTime) {
            errors.startTime = 'Start date and time is required';
        }
        if (!formData.endTime) {
            errors.endTime = 'End date and time is required';
        }

        // Validate end time is after start time
        if (formData.startTime && formData.endTime) {
            const start = new Date(formData.startTime);
            const end = new Date(formData.endTime);
            if (end <= start) {
                errors.endTime = 'End time must be after start time';
            }
        }

        // Validate capacity
        if (formData.capacity && parseInt(formData.capacity) <= 0) {
            errors.capacity = 'Capacity must be greater than 0';
        }

        // Validate ticket price
        if (parseFloat(formData.ticketPrice) < 0) {
            errors.ticketPrice = 'Ticket price cannot be negative';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            setError('You must be logged in to edit events');
            return;
        }

        if (!validateForm()) {
            setError('Please fix the form errors before submitting');
            return;
        }

        setIsSaving(true);
        setError(null);

        try {
            const updateData = {
                title: formData.title,
                description: formData.description,
                categories: formData.categories,
                city: formData.city,
                country: formData.country,
                locationType: formData.locationType,
                startTime: new Date(formData.startTime).toISOString(),
                endTime: new Date(formData.endTime).toISOString(),
                capacity: formData.capacity ? parseInt(formData.capacity) : undefined,
                ticketPrice: parseFloat(formData.ticketPrice),
            };

            const response = await updateEvent(eventId, updateData);

            if (!response.success) {
                throw new Error(response.error || 'Failed to update event');
            }

            // Success! Redirect to dashboard
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Failed to update event');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-bg-primary flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-text-secondary">Loading event...</p>
                </div>
            </div>
        );
    }

    if (error && !event) {
        return (
            <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
                <Card variant="glass" className="max-w-md w-full">
                    <CardContent className="pt-6">
                        <div className="flex items-start gap-3 mb-6">
                            <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                            <div>
                                <h3 className="font-semibold text-red-400 mb-1">Error Loading Event</h3>
                                <p className="text-sm text-red-300">{error}</p>
                            </div>
                        </div>
                        <Link href="/dashboard">
                            <Button variant="gradient" className="w-full">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Dashboard
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-bg-primary py-12 px-4">
            {/* Background Effects */}
            <div className="mesh-background" />

            <div className="container mx-auto max-w-4xl relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <Link href="/dashboard" className="inline-flex items-center text-text-secondary hover:text-white mb-4 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Dashboard
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-bold mb-2">
                        <span className="gradient-text">Edit Event</span>
                    </h1>
                    <p className="text-text-secondary">Update your event details</p>
                </motion.div>

                {/* Edit Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <form onSubmit={handleSubmit}>
                        <Card variant="glass">
                            <CardHeader>
                                <CardTitle>Event Details</CardTitle>
                                <CardDescription>Make changes to your event information</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Event Title */}
                                <div>
                                    <label className="text-sm font-medium text-text-secondary mb-2 block">
                                        Event Title *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={(e) => {
                                            setFormData({ ...formData, title: e.target.value });
                                            if (validationErrors.title) {
                                                setValidationErrors({ ...validationErrors, title: '' });
                                            }
                                        }}
                                        placeholder="e.g., Tech Conference 2024"
                                        className={`w-full px-4 py-3 bg-bg-secondary/50 border rounded-lg focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all text-white text-xl font-bold ${validationErrors.title ? 'border-red-500' : 'border-white/10'
                                            }`}
                                    />
                                    {validationErrors.title && (
                                        <p className="text-red-400 text-sm mt-1">{validationErrors.title}</p>
                                    )}
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="text-sm font-medium text-text-secondary mb-2 block">
                                        Description *
                                    </label>
                                    <textarea
                                        required
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Describe your event..."
                                        rows={4}
                                        className={`w-full px-4 py-3 bg-bg-secondary/50 border rounded-lg focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all text-white resize-none ${validationErrors.description ? 'border-red-500' : 'border-white/10'
                                            }`}
                                    />
                                    {validationErrors.description && (
                                        <p className="text-red-400 text-sm mt-1">{validationErrors.description}</p>
                                    )}
                                </div>

                                {/* Categories */}
                                <div>
                                    <label className="text-sm font-medium text-text-secondary mb-2 block">
                                        Categories *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        defaultValue={formData.categories.join(', ')}
                                        placeholder="Technology, Networking, Conference (comma-separated)"
                                        onChange={(e) => {
                                            const categories = e.target.value.split(',').map(c => c.trim()).filter(Boolean);
                                            setFormData({ ...formData, categories });
                                        }}
                                        className="w-full px-4 py-3 bg-bg-secondary/50 border border-white/10 rounded-lg focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all text-white"
                                    />
                                    {formData.categories.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {formData.categories.map((cat, i) => (
                                                <span key={i} className="px-3 py-1 rounded-full glass text-sm">
                                                    {cat}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Location Type */}
                                <div>
                                    <label className="text-sm font-medium text-text-secondary mb-2 block">
                                        Location Type *
                                    </label>
                                    <div className="flex gap-3">
                                        {(['physical', 'virtual', 'hybrid'] as const).map((type) => (
                                            <button
                                                key={type}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, locationType: type })}
                                                className={`px-4 py-2 rounded-lg capitalize transition-all ${formData.locationType === type
                                                        ? 'bg-primary text-white'
                                                        : 'glass text-text-secondary hover:text-white'
                                                    }`}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Location & Date Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/10">
                                    <div>
                                        <label className="text-sm font-medium text-text-secondary mb-2 block flex items-center gap-2">
                                            <MapPin className="w-4 h-4" />
                                            City *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.city}
                                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                            placeholder="San Francisco"
                                            className="w-full px-4 py-2 bg-bg-secondary/50 border border-white/10 rounded-lg focus:outline-none focus:border-primary/50 text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-text-secondary mb-2 block">
                                            Country *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.country}
                                            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                            placeholder="USA"
                                            className="w-full px-4 py-2 bg-bg-secondary/50 border border-white/10 rounded-lg focus:outline-none focus:border-primary/50 text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-text-secondary mb-2 block flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            Start Date & Time *
                                        </label>
                                        <input
                                            type="datetime-local"
                                            required
                                            value={formData.startTime}
                                            onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                            className="w-full px-4 py-2 bg-bg-secondary/50 border border-white/10 rounded-lg focus:outline-none focus:border-primary/50 text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-text-secondary mb-2 block flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            End Date & Time *
                                        </label>
                                        <input
                                            type="datetime-local"
                                            required
                                            value={formData.endTime}
                                            onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                                            className="w-full px-4 py-2 bg-bg-secondary/50 border border-white/10 rounded-lg focus:outline-none focus:border-primary/50 text-white"
                                        />
                                        {validationErrors.endTime && (
                                            <p className="text-red-400 text-sm mt-1">{validationErrors.endTime}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-text-secondary mb-2 block flex items-center gap-2">
                                            <Users className="w-4 h-4" />
                                            Capacity
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.capacity}
                                            onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                                            placeholder="100"
                                            min="1"
                                            className="w-full px-4 py-2 bg-bg-secondary/50 border border-white/10 rounded-lg focus:outline-none focus:border-primary/50 text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-text-secondary mb-2 block flex items-center gap-2">
                                            <IndianRupee className="w-4 h-4" />
                                            Ticket Price (₹)
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.ticketPrice}
                                            onChange={(e) => setFormData({ ...formData, ticketPrice: e.target.value })}
                                            placeholder="0 for free"
                                            step="0.01"
                                            min="0"
                                            className="w-full px-4 py-2 bg-bg-secondary/50 border border-white/10 rounded-lg focus:outline-none focus:border-primary/50 text-white"
                                        />
                                    </div>
                                </div>

                                {/* Error Message */}
                                {error && (
                                    <div className="flex items-start gap-2 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                                        <div className="flex-1">
                                            <p className="text-sm text-red-400 font-medium">Error</p>
                                            <p className="text-xs text-red-300 mt-1">{error}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex gap-3 pt-4">
                                    <Button
                                        type="submit"
                                        variant="gradient"
                                        size="lg"
                                        className="flex-1"
                                        disabled={isSaving}
                                    >
                                        {isSaving ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                                Saving Changes...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="w-5 h-5 mr-2" />
                                                Save Changes
                                            </>
                                        )}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="lg"
                                        onClick={() => router.push('/dashboard')}
                                        disabled={isSaving}
                                    >
                                        <X className="w-5 h-5 mr-2" />
                                        Cancel
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
