'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sparkles, Plus, Calendar, Users, BarChart3, LogOut, Search } from 'lucide-react';
import Link from 'next/link';
import { getMyEvents } from '@/lib/api-client';
import type { MyEvent } from '@/types/event';
import DashboardEventCard from '@/components/DashboardEventCard';

export default function DashboardPage() {
    const { user, signOut, loading } = useAuth();
    const router = useRouter();

    // My Events state
    const [myEvents, setMyEvents] = useState<MyEvent[]>([]);
    const [eventsLoading, setEventsLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'PUBLISHED' | 'DRAFT'>('all');

    // Fetch user's events
    useEffect(() => {
        async function fetchMyEvents() {
            if (!user) return;

            setEventsLoading(true);
            const result = await getMyEvents(filter === 'all' ? undefined : filter);
            if (result.success && result.data) {
                setMyEvents(result.data);
            }
            setEventsLoading(false);
        }

        fetchMyEvents();
    }, [user?.id, filter]); // Use user?.id instead of user to prevent infinite loop

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
        );
    }

    const handleSignOut = async () => {
        await signOut();
        router.push('/');
    };

    return (
        <div className="min-h-screen bg-bg-primary">
            {/* Background */}
            <div className="mesh-background" />

            <div className="relative z-10">
                {/* Header */}
                <header className="border-b border-white/10 glass sticky top-0 z-50">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center justify-between">
                            <Link href="/" className="flex items-center gap-2">
                                <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                                    <Sparkles className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-2xl font-bold gradient-text">Eventora</span>
                            </Link>

                            <div className="flex items-center gap-4">
                                <span className="text-sm text-text-secondary">
                                    {user?.user_metadata?.name || user?.email}
                                </span>
                                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Sign Out
                                </Button>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="container mx-auto px-4 py-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {/* Welcome Message */}
                        <div className="mb-12">
                            <h1 className="text-5xl font-bold mb-4">
                                Welcome back, <span className="gradient-text">{user?.user_metadata?.name || 'Creator'}</span>! 👋
                            </h1>
                            <p className="text-xl text-text-secondary">
                                Ready to create something extraordinary?
                            </p>
                        </div>

                        {/* Quick Actions */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                            <Link href="/events/create">
                                <Card variant="glass" className="p-6 cursor-pointer hover:scale-105 transition-transform group">
                                    <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <Plus className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2">Create Event</h3>
                                    <p className="text-sm text-text-secondary">Use AI to generate your perfect event</p>
                                </Card>
                            </Link>

                            <Link href="/events/discover">
                                <Card variant="glass" className="p-6 cursor-pointer hover:scale-105 transition-transform group">
                                    <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <Search className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2">Discover Events</h3>
                                    <p className="text-sm text-text-secondary">Browse and search all events</p>
                                </Card>
                            </Link>


                            <Link href="/my-registrations">
                                <Card variant="glass" className="p-6 cursor-pointer hover:scale-105 transition-transform group">
                                    <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <Calendar className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2">My Registrations</h3>
                                    <p className="text-sm text-text-secondary">View events you're attending</p>
                                </Card>
                            </Link>

                            <Card variant="glass" className="p-6 cursor-pointer hover:scale-105 transition-transform group opacity-50">
                                <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center mb-4">
                                    <BarChart3 className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2">Analytics</h3>
                                <p className="text-sm text-text-secondary">Coming soon...</p>
                            </Card>
                        </div>

                        {/* My Events Section */}
                        <div className="mb-12">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-3xl font-bold">My Events</h2>

                                {/* Filter Tabs */}
                                <div className="flex gap-2">
                                    {['all', 'PUBLISHED', 'DRAFT'].map(status => (
                                        <Button
                                            key={status}
                                            variant={filter === status ? 'gradient' : 'ghost'}
                                            size="sm"
                                            onClick={() => setFilter(status as any)}
                                        >
                                            {status === 'all' ? 'All' : status.charAt(0) + status.slice(1).toLowerCase()}
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            {/* Statistics Cards */}
                            {myEvents.length > 0 && (
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                                    <Card variant="glass" className="p-4">
                                        <p className="text-sm text-text-secondary">Total Events</p>
                                        <p className="text-2xl font-bold">{myEvents.length}</p>
                                    </Card>
                                    <Card variant="glass" className="p-4">
                                        <p className="text-sm text-text-secondary">Published</p>
                                        <p className="text-2xl font-bold">
                                            {myEvents.filter(e => e.status === 'PUBLISHED').length}
                                        </p>
                                    </Card>
                                    <Card variant="glass" className="p-4">
                                        <p className="text-sm text-text-secondary">Upcoming</p>
                                        <p className="text-2xl font-bold">
                                            {myEvents.filter(e => e.stats.isUpcoming).length}
                                        </p>
                                    </Card>
                                    <Card variant="glass" className="p-4">
                                        <p className="text-sm text-text-secondary">Draft</p>
                                        <p className="text-2xl font-bold">
                                            {myEvents.filter(e => e.status === 'DRAFT').length}
                                        </p>
                                    </Card>
                                </div>
                            )}

                            {/* Events Grid or Empty State */}
                            {eventsLoading ? (
                                <div className="text-center py-12">
                                    <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
                                </div>
                            ) : myEvents.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {myEvents.map(event => (
                                        <DashboardEventCard
                                            key={event.id}
                                            event={event}
                                            onDelete={async () => {
                                                // Refresh events list after deletion
                                                const result = await getMyEvents(filter === 'all' ? undefined : filter);
                                                if (result.success && result.data) {
                                                    setMyEvents(result.data);
                                                }
                                            }}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <Card variant="glass" className="p-12 text-center">
                                    <div className="max-w-md mx-auto">
                                        <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center mx-auto mb-6">
                                            <Sparkles className="w-10 h-10 text-white" />
                                        </div>
                                        <h2 className="text-2xl font-bold mb-4">
                                            No {filter !== 'all' ? filter.toLowerCase() : ''} events yet
                                        </h2>
                                        <p className="text-text-secondary mb-6">
                                            Get started by creating your first AI-powered event!
                                        </p>
                                        <Link href="/events/create">
                                            <Button variant="gradient" size="lg">
                                                <Plus className="w-5 h-5 mr-2" />
                                                Create Your First Event
                                            </Button>
                                        </Link>
                                    </div>
                                </Card>
                            )}
                        </div>
                    </motion.div>
                </main>
            </div>
        </div>
    );
}
