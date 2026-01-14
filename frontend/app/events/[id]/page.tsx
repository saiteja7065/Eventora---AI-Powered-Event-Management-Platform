'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Calendar,
    MapPin,
    IndianRupee,
    Users,
    Clock,
    Globe,
    Share2,
    Loader2,
    CheckCircle,
    UserPlus,
    UserMinus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getEventById, registerForEvent, cancelRegistration, getRegistrationStatus, getEventAttendees } from '@/lib/api-client';
import type { Event } from '@/types/event';
import { useAuth } from '@/lib/auth-context';
import AttendeesModal from '@/components/AttendeesModal';

export default function EventDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const eventId = params.id as string;

    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Registration state
    const [registrationStatus, setRegistrationStatus] = useState<any>(null);
    const [isRegistering, setIsRegistering] = useState(false);
    const [registrationMessage, setRegistrationMessage] = useState('');

    // Attendees modal state
    const [showAttendeesModal, setShowAttendeesModal] = useState(false);
    const [attendees, setAttendees] = useState<any[]>([]);
    const [loadingAttendees, setLoadingAttendees] = useState(false);

    useEffect(() => {
        async function fetchEvent() {
            try {
                setLoading(true);
                const response = await getEventById(eventId);

                if (response.success && response.data) {
                    setEvent(response.data);
                } else {
                    setError('Event not found');
                }
            } catch (err: any) {
                setError(err.message || 'Failed to load event');
            } finally {
                setLoading(false);
            }
        }

        async function fetchRegistrationStatus() {
            const response = await getRegistrationStatus(eventId);
            if (response.success && response.data) {
                setRegistrationStatus(response.data);
            }
        }

        if (eventId) {
            fetchEvent();
            fetchRegistrationStatus();
        }
    }, [eventId]);

    // Format date and time
    const formatEventDate = (date: string | Date) => {
        const eventDate = new Date(date);
        return eventDate.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
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

    const handleShare = async () => {
        if (navigator.share && event) {
            try {
                await navigator.share({
                    title: event.title,
                    text: event.description,
                    url: window.location.href
                });
            } catch (err) {
                // User cancelled share or share not supported
                console.log('Share cancelled');
            }
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    const handleRegister = async () => {
        if (!user) {
            router.push('/auth/signin');
            return;
        }

        setIsRegistering(true);
        setRegistrationMessage('');

        const response = await registerForEvent(eventId);

        if (response.success) {
            setRegistrationMessage(response.message || 'Successfully registered!');
            // Refresh registration status
            const statusResponse = await getRegistrationStatus(eventId);
            if (statusResponse.success && statusResponse.data) {
                setRegistrationStatus(statusResponse.data);
            }
        } else {
            setRegistrationMessage(response.error || 'Failed to register');
        }

        setIsRegistering(false);

        // Clear message after 3 seconds
        setTimeout(() => setRegistrationMessage(''), 3000);
    };

    const handleCancelRegistration = async () => {
        if (!confirm('Are you sure you want to cancel your registration?')) {
            return;
        }

        setIsRegistering(true);
        setRegistrationMessage('');

        const response = await cancelRegistration(eventId);

        if (response.success) {
            setRegistrationMessage(response.message || 'Registration cancelled');
            // Refresh registration status
            const statusResponse = await getRegistrationStatus(eventId);
            if (statusResponse.success && statusResponse.data) {
                setRegistrationStatus(statusResponse.data);
            }
        } else {
            setRegistrationMessage(response.error || 'Failed to cancel registration');
        }

        setIsRegistering(false);

        // Clear message after 3 seconds
        setTimeout(() => setRegistrationMessage(''), 3000);
    };

    // Handle viewing attendees (organizer only)
    const handleViewAttendees = async () => {
        setLoadingAttendees(true);
        setShowAttendeesModal(true);

        const response = await getEventAttendees(eventId);

        if (response.success && response.data) {
            setAttendees(response.data);
        } else {
            console.error('Failed to fetch attendees:', response.error);
        }

        setLoadingAttendees(false);
    };

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-bg-primary flex items-center justify-center">
                <div className="mesh-background" />
                <div className="relative z-10 text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-text-secondary">Loading event...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error || !event) {
        return (
            <div className="min-h-screen bg-bg-primary flex items-center justify-center">
                <div className="mesh-background" />
                <Card variant="glass" className="relative z-10 p-12 max-w-md mx-4">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-4">Event Not Found</h2>
                        <p className="text-text-secondary mb-6">{error}</p>
                        <Button variant="gradient" onClick={() => router.push('/events/discover')}>
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Discover
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    const priceDisplay = event.ticketPrice === 0 ? 'FREE' : `₹${event.ticketPrice.toFixed(2)}`;

    return (
        <div className="min-h-screen bg-bg-primary">
            <div className="mesh-background" />

            <div className="relative z-10">
                {/* Breadcrumb Navigation */}
                <div className="container mx-auto px-4 py-6">
                    <Link
                        href="/events/discover"
                        className="inline-flex items-center text-text-secondary hover:text-primary transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Discover
                    </Link>
                </div>

                {/* Event Header with Cover Image */}
                <div className="container mx-auto px-4 pb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative h-96 rounded-2xl overflow-hidden mb-8"
                    >
                        <Image
                            src={event.coverImage.url}
                            alt={event.coverImage.alt || event.title}
                            fill
                            className="object-cover"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                        {/* Title and Price Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-8">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                                        {event.title}
                                    </h1>
                                    <div className="flex flex-wrap gap-2">
                                        {event.categories.map((category) => (
                                            <span
                                                key={category}
                                                className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm text-white"
                                            >
                                                {category.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className={`px-6 py-3 rounded-full text-lg font-bold text-white ${event.ticketPrice === 0
                                        ? 'bg-green-500'
                                        : 'bg-gradient-to-r from-primary to-purple-600'
                                        }`}>
                                        {priceDisplay}
                                    </div>
                                    <Button
                                        variant="glass"
                                        size="icon"
                                        onClick={handleShare}
                                        className="rounded-full"
                                    >
                                        <Share2 className="w-5 h-5" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Description */}
                            <Card variant="glass">
                                <CardContent className="p-6">
                                    <h2 className="text-2xl font-bold mb-4">About This Event</h2>
                                    <p className="text-text-secondary leading-relaxed whitespace-pre-wrap">
                                        {event.description}
                                    </p>
                                </CardContent>
                            </Card>

                            {/* Creator Info */}
                            {event.creator && (
                                <Card variant="glass">
                                    <CardContent className="p-6">
                                        <h2 className="text-2xl font-bold mb-4">Organized By</h2>
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                                                {event.creator.name?.charAt(0).toUpperCase() || 'U'}
                                            </div>
                                            <div>
                                                <p className="font-semibold">{event.creator.name || 'Event Organizer'}</p>
                                                <p className="text-sm text-text-secondary">{event.creator.email}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Event Details Card */}
                            <Card variant="glass" className="sticky top-4">
                                <CardContent className="p-6 space-y-4">
                                    <h3 className="text-xl font-bold mb-4">Event Details</h3>

                                    {/* Date & Time */}
                                    <div className="space-y-3">
                                        <div className="flex items-start gap-3">
                                            <Calendar className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p className="font-medium">Date</p>
                                                <p className="text-sm text-text-secondary">{formatEventDate(event.startTime)}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p className="font-medium">Time</p>
                                                <p className="text-sm text-text-secondary">
                                                    {formatEventTime(event.startTime)} - {formatEventTime(event.endTime)}
                                                </p>
                                                {event.timezone && (
                                                    <p className="text-xs text-text-muted">{event.timezone}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-t border-white/10 my-4" />

                                    {/* Location */}
                                    <div className="flex items-start gap-3">
                                        {event.locationType === 'virtual' ? (
                                            <Globe className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                        ) : (
                                            <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                        )}
                                        <div className="flex-1">
                                            <p className="font-medium">Location</p>
                                            {event.locationType === 'virtual' ? (
                                                <p className="text-sm text-text-secondary">Virtual Event</p>
                                            ) : (
                                                <>
                                                    {event.address && <p className="text-sm text-text-secondary">{event.address}</p>}
                                                    <p className="text-sm text-text-secondary">{event.city}, {event.country}</p>
                                                </>
                                            )}
                                            {event.locationType === 'hybrid' && (
                                                <span className="inline-block mt-1 px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded">
                                                    Hybrid Event
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Capacity */}
                                    {event.capacity && (
                                        <>
                                            <div className="border-t border-white/10 my-4" />
                                            <div className="flex items-start gap-3">
                                                <Users className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="font-medium">Capacity</p>
                                                    <p className="text-sm text-text-secondary">Up to {event.capacity} attendees</p>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {/* Price */}
                                    <div className="border-t border-white/10 my-4" />
                                    <div className="flex items-start gap-3">
                                        <IndianRupee className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="font-medium">Ticket Price</p>
                                            <p className="text-sm text-text-secondary">{priceDisplay}</p>
                                        </div>
                                    </div>

                                    {/* Attendee Count & Registration Status */}
                                    {registrationStatus && (
                                        <>
                                            <div className="border-t border-white/10 my-4" />
                                            <div className="flex items-start gap-3">
                                                <Users className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                                <div className="flex-1">
                                                    <p className="font-medium">Attendees</p>
                                                    <p className="text-sm text-text-secondary">
                                                        {registrationStatus.confirmedCount}
                                                        {registrationStatus.capacity && ` / ${registrationStatus.capacity}`} registered
                                                    </p>
                                                    {registrationStatus.isFull && (
                                                        <span className="inline-block mt-1 px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded">
                                                            Event Full
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {/* Register Button */}
                                    <div className="border-t border-white/10 my-4" />

                                    {/* Show message if any */}
                                    {registrationMessage && (
                                        <div className={`p-3 rounded-lg mb-3 text-sm ${registrationMessage.includes('Success') || registrationMessage.includes('cancelled')
                                            ? 'bg-green-500/20 text-green-400'
                                            : 'bg-red-500/20 text-red-400'
                                            }`}>
                                            {registrationMessage}
                                        </div>
                                    )}

                                    {/* Check if user is the organizer */}
                                    {user && event?.creator && user.id === event.creator.id ? (
                                        <div className="space-y-3">
                                            <Button
                                                variant="gradient"
                                                size="lg"
                                                className="w-full"
                                                onClick={() => router.push(`/events/${eventId}/edit`)}
                                            >
                                                Edit Event
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="lg"
                                                className="w-full"
                                                onClick={handleViewAttendees}
                                            >
                                                <Users className="w-4 h-4 mr-2" />
                                                View Attendees ({registrationStatus?.confirmedCount || 0})
                                            </Button>
                                        </div>
                                    ) : registrationStatus?.isRegistered ? (
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-center gap-2 p-3 bg-green-500/20 text-green-400 rounded-lg">
                                                <CheckCircle className="w-5 h-5" />
                                                <span className="font-medium">You're Registered!</span>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="lg"
                                                className="w-full text-red-400 hover:text-red-300"
                                                onClick={handleCancelRegistration}
                                                disabled={isRegistering}
                                            >
                                                {isRegistering ? (
                                                    <>
                                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                                        Cancelling...
                                                    </>
                                                ) : (
                                                    <>
                                                        <UserMinus className="w-5 h-5 mr-2" />
                                                        Cancel Registration
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    ) : registrationStatus?.isFull ? (
                                        <Button variant="gradient" size="lg" className="w-full" disabled>
                                            Event Full
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="gradient"
                                            size="lg"
                                            className="w-full"
                                            onClick={handleRegister}
                                            disabled={isRegistering}
                                        >
                                            {isRegistering ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                                    Registering...
                                                </>
                                            ) : (
                                                <>
                                                    <UserPlus className="w-5 h-5 mr-2" />
                                                    Register for Free
                                                </>
                                            )}
                                        </Button>
                                    )}

                                    {!user && (
                                        <p className="text-xs text-center text-text-muted mt-2">
                                            Sign in to register for this event
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>

            {/* Attendees Modal */}
            <AttendeesModal
                isOpen={showAttendeesModal}
                onClose={() => setShowAttendeesModal(false)}
                eventId={eventId}
                eventTitle={event?.title || ''}
                attendees={attendees}
                loading={loadingAttendees}
            />
        </div>
    );
}
