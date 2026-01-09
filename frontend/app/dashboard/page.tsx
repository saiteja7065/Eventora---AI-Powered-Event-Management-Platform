'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sparkles, Plus, Calendar, Users, BarChart3, LogOut } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
    const { user, signOut, loading } = useAuth();
    const router = useRouter();

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

                            <Card variant="glass" className="p-6 cursor-pointer hover:scale-105 transition-transform group opacity-50">
                                <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center mb-4">
                                    <Calendar className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2">My Events</h3>
                                <p className="text-sm text-text-secondary">Coming soon...</p>
                            </Card>

                            <Card variant="glass" className="p-6 cursor-pointer hover:scale-105 transition-transform group opacity-50">
                                <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center mb-4">
                                    <Users className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2">Attendees</h3>
                                <p className="text-sm text-text-secondary">Coming soon...</p>
                            </Card>

                            <Card variant="glass" className="p-6 cursor-pointer hover:scale-105 transition-transform group opacity-50">
                                <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center mb-4">
                                    <BarChart3 className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2">Analytics</h3>
                                <p className="text-sm text-text-secondary">Coming soon...</p>
                            </Card>
                        </div>

                        {/* Empty State */}
                        <Card variant="glass" className="p-12 text-center">
                            <div className="max-w-md mx-auto">
                                <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center mx-auto mb-6">
                                    <Sparkles className="w-10 h-10 text-white" />
                                </div>
                                <h2 className="text-2xl font-bold mb-4">No events yet</h2>
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
                    </motion.div>
                </main>
            </div>
        </div>
    );
}
