'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Download, Calendar, Mail, User, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface Attendee {
    id: string;
    registeredAt: string;
    user: {
        id: string;
        name: string;
        email: string;
        avatar: string | null;
    };
}

interface AttendeesModalProps {
    isOpen: boolean;
    onClose: () => void;
    eventId: string;
    eventTitle: string;
    attendees: Attendee[];
    loading?: boolean;
}

export default function AttendeesModal({
    isOpen,
    onClose,
    eventId,
    eventTitle,
    attendees,
    loading = false
}: AttendeesModalProps) {
    const [searchQuery, setSearchQuery] = useState('');

    // Filter attendees based on search
    const filteredAttendees = attendees.filter(attendee =>
        attendee.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        attendee.user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Export to CSV
    const handleExportCSV = () => {
        const csvContent = [
            ['Name', 'Email', 'Registration Date'],
            ...attendees.map(a => [
                a.user.name,
                a.user.email,
                new Date(a.registeredAt).toLocaleDateString()
            ])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${eventTitle.replace(/\s+/g, '_')}_attendees.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="w-full max-w-3xl max-h-[90vh] overflow-hidden"
                        >
                            <Card variant="glass" className="flex flex-col h-full">
                                {/* Header */}
                                <div className="p-6 border-b border-white/10">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                                <User className="w-6 h-6 text-primary" />
                                                Event Attendees
                                            </h2>
                                            <p className="text-sm text-text-secondary mt-1">
                                                {eventTitle}
                                            </p>
                                        </div>
                                        <button
                                            onClick={onClose}
                                            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>

                                    {/* Stats */}
                                    <div className="flex items-center gap-4 text-sm">
                                        <span className="text-text-secondary">
                                            Total Attendees: <span className="text-white font-semibold">{attendees.length}</span>
                                        </span>
                                        {filteredAttendees.length !== attendees.length && (
                                            <span className="text-text-secondary">
                                                Filtered: <span className="text-primary font-semibold">{filteredAttendees.length}</span>
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Search & Export */}
                                <div className="p-6 border-b border-white/10 space-y-4">
                                    <div className="flex gap-3">
                                        {/* Search */}
                                        <div className="relative flex-1">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                                            <input
                                                type="text"
                                                placeholder="Search by name or email..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="w-full pl-10 pr-4 py-2 bg-bg-secondary/50 border border-white/10 rounded-lg focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all text-white text-sm"
                                            />
                                        </div>

                                        {/* Export Button */}
                                        <Button
                                            variant="ghost"
                                            onClick={handleExportCSV}
                                            disabled={attendees.length === 0}
                                            className="shrink-0"
                                        >
                                            <Download className="w-4 h-4 mr-2" />
                                            Export CSV
                                        </Button>
                                    </div>
                                </div>

                                {/* Attendees List */}
                                <div className="flex-1 overflow-y-auto p-6">
                                    {loading ? (
                                        <div className="flex items-center justify-center py-12">
                                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                        </div>
                                    ) : filteredAttendees.length === 0 ? (
                                        <div className="text-center py-12">
                                            {searchQuery ? (
                                                <>
                                                    <p className="text-text-secondary mb-2">No attendees found matching "{searchQuery}"</p>
                                                    <Button
                                                        variant="ghost"
                                                        onClick={() => setSearchQuery('')}
                                                        size="sm"
                                                    >
                                                        Clear search
                                                    </Button>
                                                </>
                                            ) : (
                                                <p className="text-text-secondary">No attendees yet</p>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {filteredAttendees.map((attendee, index) => (
                                                <motion.div
                                                    key={attendee.id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.03 }}
                                                >
                                                    <Card variant="glass" className="p-4 hover:bg-white/5 transition-colors">
                                                        <div className="flex items-center gap-4">
                                                            {/* Avatar */}
                                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shrink-0">
                                                                {attendee.user.avatar ? (
                                                                    <img
                                                                        src={attendee.user.avatar}
                                                                        alt={attendee.user.name}
                                                                        className="w-full h-full rounded-full object-cover"
                                                                    />
                                                                ) : (
                                                                    <User className="w-6 h-6 text-primary" />
                                                                )}
                                                            </div>

                                                            {/* Info */}
                                                            <div className="flex-1 min-w-0">
                                                                <h3 className="font-semibold text-white truncate">
                                                                    {attendee.user.name}
                                                                </h3>
                                                                <div className="flex items-center gap-3 text-xs text-text-secondary mt-1">
                                                                    <span className="flex items-center gap-1">
                                                                        <Mail className="w-3 h-3" />
                                                                        <span className="truncate">{attendee.user.email}</span>
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            {/* Registration Date */}
                                                            <div className="text-right shrink-0">
                                                                <div className="flex items-center gap-1 text-xs text-text-secondary">
                                                                    <Calendar className="w-3 h-3" />
                                                                    <span>{formatDate(attendee.registeredAt)}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Card>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Footer */}
                                <div className="p-6 border-t border-white/10">
                                    <Button
                                        variant="ghost"
                                        onClick={onClose}
                                        className="w-full"
                                    >
                                        Close
                                    </Button>
                                </div>
                            </Card>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
