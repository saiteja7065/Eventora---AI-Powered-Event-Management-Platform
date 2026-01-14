'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { MapPin, Calendar, IndianRupee, Users, Edit, Trash2, Eye } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { useState } from 'react';
import { deleteEvent } from '@/lib/api-client';

interface DashboardEventCardProps {
    event: {
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
        ticketPrice: number;
        capacity?: number;
        locationType: string;
        status?: string;
    };
    onDelete?: () => void;
}

export default function DashboardEventCard({ event, onDelete }: DashboardEventCardProps) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    // Format date
    const eventDate = new Date(event.startTime);
    const formattedDate = eventDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
    const formattedTime = eventDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });

    // Format price
    const priceDisplay = event.ticketPrice === 0 ? 'FREE' : `₹${event.ticketPrice.toFixed(2)}`;

    // Category badge colors
    const categoryColors: Record<string, string> = {
        technology: 'from-blue-500 to-cyan-500',
        business: 'from-purple-500 to-pink-500',
        'arts-culture': 'from-orange-500 to-red-500',
        'sports-fitness': 'from-green-500 to-emerald-500',
        'food-drink': 'from-amber-500 to-yellow-500',
        music: 'from-pink-500 to-rose-500',
        education: 'from-indigo-500 to-blue-500',
        'health-wellness': 'from-teal-500 to-cyan-500',
        entertainment: 'from-violet-500 to-purple-500',
        networking: 'from-blue-600 to-indigo-600',
        charity: 'from-rose-500 to-pink-500',
        lifestyle: 'from-red-500 to-pink-500'
    };

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        router.push(`/events/${event.id}/edit`);
    };

    const handleView = (e: React.MouseEvent) => {
        e.stopPropagation();
        router.push(`/events/${event.id}`);
    };

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();

        if (!confirm(`Are you sure you want to delete "${event.title}"? This action cannot be undone.`)) {
            return;
        }

        setIsDeleting(true);
        const result = await deleteEvent(event.id);

        if (result.success) {
            onDelete?.();
        } else {
            alert(result.error || 'Failed to delete event');
            setIsDeleting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
        >
            <Card variant="glass" className="overflow-hidden h-full">
                {/* Event Image */}
                <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-primary/20 to-purple-600/20">
                    <Image
                        src={event.coverImage.url}
                        alt={event.coverImage.alt || event.title}
                        fill
                        className="object-cover"
                        unoptimized
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                        }}
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Category Badges */}
                    <div className="absolute top-4 right-4 flex gap-2">
                        {event.categories.slice(0, 2).map((category) => {
                            const gradient = categoryColors[category] || 'from-gray-500 to-gray-600';
                            return (
                                <div
                                    key={category}
                                    className={`px-2 py-1 rounded-md text-xs font-medium text-white bg-gradient-to-r ${gradient} backdrop-blur-sm`}
                                >
                                    {category.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                                </div>
                            );
                        })}
                    </div>

                    {/* Status Badge */}
                    {event.status && (
                        <div className="absolute top-4 left-4">
                            <span className={`px-2 py-1 rounded-md text-xs font-medium text-white backdrop-blur-sm ${event.status === 'PUBLISHED' ? 'bg-green-500/80' : 'bg-yellow-500/80'
                                }`}>
                                {event.status}
                            </span>
                        </div>
                    )}
                </div>

                {/* Event Details */}
                <div className="p-4">
                    {/* Title */}
                    <h3 className="text-lg font-bold mb-2 line-clamp-2">
                        {event.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-text-secondary mb-4 line-clamp-2">
                        {event.description}
                    </p>

                    {/* Info Grid */}
                    <div className="space-y-2 mb-4">
                        {/* Location */}
                        <div className="flex items-center gap-2 text-sm text-text-secondary">
                            <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                            <span className="truncate">
                                {event.city}, {event.country}
                                {event.locationType === 'virtual' && ' (Virtual)'}
                                {event.locationType === 'hybrid' && ' (Hybrid)'}
                            </span>
                        </div>

                        {/* Date & Time */}
                        <div className="flex items-center gap-2 text-sm text-text-secondary">
                            <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
                            <span>
                                {formattedDate} · {formattedTime}
                            </span>
                        </div>

                        {/* Capacity */}
                        {event.capacity && (
                            <div className="flex items-center gap-2 text-sm text-text-secondary">
                                <Users className="w-4 h-4 text-primary flex-shrink-0" />
                                <span>
                                    Up to {event.capacity} attendees
                                </span>
                            </div>
                        )}

                        {/* Price */}
                        <div className="flex items-center gap-2 text-sm">
                            <IndianRupee className="w-4 h-4 text-primary flex-shrink-0" />
                            <span className={`font-semibold ${event.ticketPrice === 0
                                    ? 'text-green-500'
                                    : 'text-primary'
                                }`}>
                                {priceDisplay}
                            </span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-4 border-t border-white/10">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="flex-1"
                            onClick={handleView}
                        >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="flex-1"
                            onClick={handleEdit}
                        >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="flex-1 text-red-400 hover:text-red-300"
                            onClick={handleDelete}
                            disabled={isDeleting}
                        >
                            <Trash2 className="w-4 h-4 mr-1" />
                            {isDeleting ? 'Deleting...' : 'Delete'}
                        </Button>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}
