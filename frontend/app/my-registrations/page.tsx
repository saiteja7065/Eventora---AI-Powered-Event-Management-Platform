'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, Loader2, Ticket, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getMyRegistrations, cancelRegistration } from '@/lib/api-client';
import Link from 'next/link';
import Image from 'next/image';

export default function MyRegistrationsPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    const [registrations, setRegistrations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [cancellingId, setCancellingId] = useState<string | null>(null);

    useEffect(() => {
        async function fetchRegistrations() {
            if (!user) {
                router.push('/auth/signin');
                return;
            }

            setLoading(true);
            console.log('Fetching registrations for user:', user.id);

            const result = await getMyRegistrations();

            console.log('Registration result:', result);

            if (result.success && result.data) {
                console.log('Registrations data:', result.data);
                setRegistrations(result.data);
                setError('');
            } else {
                console.error('Failed to fetch registrations:', result.error);
                setError(result.error || 'Failed to fetch registrations');
            }

            setLoading(false);
        }

        if (!authLoading) {
            fetchRegistrations();
        }
    }, [user?.id, authLoading, router]);

    const handleCancelRegistration = async (eventId: string, eventTitle: string) => {
        if (!confirm(`Are you sure you want to cancel your registration for "${eventTitle}"?`)) {
            return;
        }

        setCancellingId(eventId);
        const result = await cancelRegistration(eventId);

        if (result.success) {
            // Remove from list
            setRegistrations(prev => prev.filter(reg => reg.event.id !== eventId));
        } else {
            alert(result.error || 'Failed to cancel registration');
        }

        setCancellingId(null);
    };

    const formatEventDate = (date: string | Date) => {
        const eventDate = new Date(date);
        return eventDate.toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatEventTime = (date: string | Date) => {
        const eventDate = new Date(date);
        return eventDate.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-bg-primary flex items-center justify-center">
                <div className="mesh-background" />
                <div className="relative z-10 text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-text-secondary">Loading your registrations...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-bg-primary">
            <div className="mesh-background" />

            <div className="relative z-10">
                {/* Header */}
                <div className="container mx-auto px-4 py-6">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center text-text-secondary hover:text-primary transition-colors mb-6"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Dashboard
                    </Link>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="text-4xl md:text-5xl font-bold mb-2">
                            <span className="gradient-text">My Registrations</span>
                        </h1>
                        <p className="text-xl text-text-secondary">
                            Events you've registered to attend
                        </p>
                    </motion.div>
                </div>

                {/* Content */}
                <div className="container mx-auto px-4 pb-12">
                    {error && (
                        <Card variant="glass" className="p-6 mb-6 bg-red-500/10 border-red-500/20">
                            <p className="text-red-400">{error}</p>
                        </Card>
                    )}

                    {registrations.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <Card variant="glass" className="p-12 text-center">
                                <div className="max-w-md mx-auto">
                                    <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center mx-auto mb-6">
                                        <Ticket className="w-10 h-10 text-white" />
                                    </div>
                                    <h2 className="text-2xl font-bold mb-4">
                                        No Registrations Yet
                                    </h2>
                                    <p className="text-text-secondary mb-6">
                                        You haven't registered for any events. Explore events and register to get started!
                                    </p>
                                    <Link href="/events/discover">
                                        <Button variant="gradient" size="lg">
                                            Discover Events
                                        </Button>
                                    </Link>
                                </div>
                            </Card>
                        </motion.div>
                    ) : (
                        <>
                            <div className="mb-6 text-text-secondary">
                                {registrations.length} {registrations.length === 1 ? 'event' : 'events'}
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {registrations.map((registration, index) => {
                                    const event = registration.event;
                                    const isPastEvent = new Date(event.endTime) < new Date();

                                    return (
                                        <motion.div
                                            key={registration.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                        >
                                            <Card variant="glass" className="overflow-hidden">
                                                <div className="flex flex-col md:flex-row">
                                                    {/* Event Image */}
                                                    <div className="relative h-48 md:h-auto md:w-48 flex-shrink-0">
                                                        <Image
                                                            src={event.coverImage.url}
                                                            alt={event.coverImage.alt || event.title}
                                                            fill
                                                            className="object-cover"
                                                            unoptimized
                                                        />
                                                        {isPastEvent && (
                                                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                                                <span className="text-white font-semibold px-4 py-2 bg-gray-500/80 rounded">
                                                                    Past Event
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Event Details */}
                                                    <div className="p-6 flex-1">
                                                        <h3 className="text-xl font-bold mb-3 line-clamp-2">
                                                            {event.title}
                                                        </h3>

                                                        <div className="space-y-2 mb-4">
                                                            {/* Date */}
                                                            <div className="flex items-center gap-2 text-sm text-text-secondary">
                                                                <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
                                                                <span>{formatEventDate(event.startTime)}</span>
                                                            </div>

                                                            {/* Time */}
                                                            <div className="flex items-center gap-2 text-sm text-text-secondary">
                                                                <Clock className="w-4 h-4 text-primary flex-shrink-0" />
                                                                <span>
                                                                    {formatEventTime(event.startTime)} - {formatEventTime(event.endTime)}
                                                                </span>
                                                            </div>

                                                            {/* Location */}
                                                            <div className="flex items-center gap-2 text-sm text-text-secondary">
                                                                <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                                                                <span>
                                                                    {event.city}, {event.country}
                                                                    {event.locationType === 'virtual' && ' (Virtual)'}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* Registration Info */}
                                                        <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                                                            <p className="text-sm text-green-400">
                                                                ✓ Registered on {new Date(registration.registeredAt).toLocaleDateString()}
                                                            </p>
                                                        </div>

                                                        {/* Actions */}
                                                        <div className="flex gap-2">
                                                            <Link href={`/events/${event.id}`} className="flex-1">
                                                                <Button variant="ghost" className="w-full">
                                                                    View Details
                                                                </Button>
                                                            </Link>

                                                            {!isPastEvent && (
                                                                <Button
                                                                    variant="ghost"
                                                                    className="text-red-400 hover:text-red-300"
                                                                    onClick={() => handleCancelRegistration(event.id, event.title)}
                                                                    disabled={cancellingId === event.id}
                                                                >
                                                                    {cancellingId === event.id ? (
                                                                        <>
                                                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                                            Cancelling...
                                                                        </>
                                                                    ) : (
                                                                        'Cancel Registration'
                                                                    )}
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </Card>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
