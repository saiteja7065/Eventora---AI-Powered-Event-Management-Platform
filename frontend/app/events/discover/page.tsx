'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, X, ChevronLeft, ChevronRight, Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import EventCard from '@/components/EventCard';
import { getEvents, GetEventsParams } from '@/lib/api-client';
import Link from 'next/link';

const CATEGORIES = [
    { id: 'technology', label: 'Technology' },
    { id: 'business', label: 'Business' },
    { id: 'arts-culture', label: 'Arts & Culture' },
    { id: 'sports-fitness', label: 'Sports & Fitness' },
    { id: 'food-drink', label: 'Food & Drink' },
    { id: 'music', label: 'Music' },
    { id: 'education', label: 'Education' },
    { id: 'health-wellness', label: 'Health & Wellness' },
    { id: 'entertainment', label: 'Entertainment' },
    { id: 'networking', label: 'Networking' },
    { id: 'charity', label: 'Charity' },
    { id: 'lifestyle', label: 'Lifestyle' },
];

export default function DiscoverPage() {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    // Filter state
    const [search, setSearch] = useState('');
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [priceFilter, setPriceFilter] = useState<'all' | 'free' | 'paid'>('all');
    const [locationType, setLocationType] = useState<'physical' | 'virtual' | 'hybrid' | ''>('');

    // Pagination
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 12,
        total: 0,
        totalPages: 0,
        hasMore: false
    });

    // Debounce search
    const [searchDebounce, setSearchDebounce] = useState('');
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchDebounce(search);
            setPage(1); // Reset to page 1 when search changes
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    // Fetch events
    const fetchEvents = useCallback(async () => {
        setLoading(true);
        setError('');

        const params: GetEventsParams = {
            page,
            limit: 12,  // Increased from 6 for better performance
            search: searchDebounce || undefined,
            categories: selectedCategories.length > 0 ? selectedCategories : undefined,
            city: city || undefined,
            country: country || undefined,
            locationType: locationType || undefined,
            sortBy: 'date',
            sortOrder: 'asc'
        };

        // Price filter
        if (priceFilter === 'free') {
            params.maxPrice = 0;
        } else if (priceFilter === 'paid') {
            params.minPrice = 0.01;
        }

        const result = await getEvents(params);

        if (result.success && result.data) {
            setEvents(result.data.events);
            setPagination(result.data.pagination);
        } else {
            setError(result.error || 'Failed to fetch events');
        }

        setLoading(false);
    }, [page, searchDebounce, selectedCategories, city, country, priceFilter, locationType]);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    const toggleCategory = (categoryId: string) => {
        setSelectedCategories(prev =>
            prev.includes(categoryId)
                ? prev.filter(c => c !== categoryId)
                : [...prev, categoryId]
        );
        setPage(1); // Reset to page 1
    };

    const clearFilters = () => {
        setSearch('');
        setSelectedCategories([]);
        setCity('');
        setCountry('');
        setPriceFilter('all');
        setLocationType('');
        setPage(1);
    };

    const hasActiveFilters = search || selectedCategories.length > 0 || city || country || priceFilter !== 'all' || locationType;

    return (
        <div className="min-h-screen bg-bg-primary py-12 px-4">
            <div className="mesh-background" />

            <div className="container mx-auto max-w-7xl relative z-10">
                {/* Back Button */}
                <div className="mb-6">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center text-text-secondary hover:text-primary transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Dashboard
                    </Link>
                </div>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-2">
                        <span className="gradient-text">Discover Events</span>
                    </h1>
                    <p className="text-xl text-text-secondary">
                        Find amazing events happening near you
                    </p>
                </motion.div>

                {/* Search Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-6"
                >
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                        <input
                            type="text"
                            id="event-search"
                            name="search"
                            autoComplete="off"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search events..."
                            className="w-full pl-12 pr-4 py-4 bg-bg-secondary/50 border border-white/10 rounded-lg focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all text-white"
                        />
                    </div>
                </motion.div>

                {/* Filter Toggle (Mobile) */}
                <div className="mb-6 lg:hidden">
                    <Button
                        variant="ghost"
                        onClick={() => setShowFilters(!showFilters)}
                        className="w-full"
                    >
                        <Filter className="w-5 h-5 mr-2" />
                        {showFilters ? 'Hide Filters' : 'Show Filters'}
                    </Button>
                </div>

                <div className="flex gap-6">
                    {/* Filter Sidebar */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className={`w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}
                    >
                        <Card variant="glass" className="sticky top-4">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-bold text-lg">Filters</h3>
                                    {hasActiveFilters && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={clearFilters}
                                        >
                                            Clear All
                                        </Button>
                                    )}
                                </div>

                                <div className="space-y-6">
                                    {/* Categories */}
                                    <div>
                                        <h4 className="font-medium mb-3">Categories</h4>
                                        <div className="space-y-2 max-h-64 overflow-y-auto">
                                            {CATEGORIES.map(category => (
                                                <label
                                                    key={category.id}
                                                    className="flex items-center gap-2 cursor-pointer group"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        id={`category-${category.id}`}
                                                        name={`category-${category.id}`}
                                                        checked={selectedCategories.includes(category.id)}
                                                        onChange={() => toggleCategory(category.id)}
                                                        className="w-4 h-4 rounded border-white/20 bg-bg-secondary/50 text-primary focus:ring-primary/20"
                                                    />
                                                    <span className="text-sm group-hover:text-primary transition-colors">
                                                        {category.label}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Location */}
                                    <div>
                                        <h4 className="font-medium mb-3">Location</h4>
                                        <div className="space-y-2">
                                            <input
                                                type="text"
                                                id="filter-city"
                                                name="city"
                                                autoComplete="address-level2"
                                                value={city}
                                                onChange={(e) => { setCity(e.target.value); setPage(1); }}
                                                placeholder="City"
                                                className="w-full px-3 py-2 bg-bg-secondary/50 border border-white/10 rounded-lg focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all text-white text-sm"
                                            />
                                            <input
                                                type="text"
                                                id="filter-country"
                                                name="country"
                                                autoComplete="country-name"
                                                value={country}
                                                onChange={(e) => { setCountry(e.target.value); setPage(1); }}
                                                placeholder="Country"
                                                className="w-full px-3 py-2 bg-bg-secondary/50 border border-white/10 rounded-lg focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all text-white text-sm"
                                            />
                                        </div>
                                    </div>

                                    {/* Price */}
                                    <div>
                                        <h4 className="font-medium mb-3">Price</h4>
                                        <div className="space-y-2">
                                            {['all', 'free', 'paid'].map((price) => (
                                                <label
                                                    key={price}
                                                    className="flex items-center gap-2 cursor-pointer group"
                                                >
                                                    <input
                                                        type="radio"
                                                        id={`price-${price}`}
                                                        name="price"
                                                        checked={priceFilter === price}
                                                        onChange={() => { setPriceFilter(price as any); setPage(1); }}
                                                        className="w-4 h-4 border-white/20 bg-bg-secondary/50 text-primary focus:ring-primary/20"
                                                    />
                                                    <span className="text-sm group-hover:text-primary transition-colors capitalize">
                                                        {price}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Event Type */}
                                    <div>
                                        <h4 className="font-medium mb-3">Event Type</h4>
                                        <div className="space-y-2">
                                            {([
                                                { value: '', label: 'All' },
                                                { value: 'physical', label: 'In-Person' },
                                                { value: 'virtual', label: 'Virtual' },
                                                { value: 'hybrid', label: 'Hybrid' }
                                            ] as const).map((type) => (
                                                <label
                                                    key={type.value}
                                                    className="flex items-center gap-2 cursor-pointer group"
                                                >
                                                    <input
                                                        type="radio"
                                                        id={`location-type-${type.value || 'all'}`}
                                                        name="locationType"
                                                        checked={locationType === type.value}
                                                        onChange={() => { setLocationType(type.value); setPage(1); }}
                                                        className="w-4 h-4 border-white/20 bg-bg-secondary/50 text-primary focus:ring-primary/20"
                                                    />
                                                    <span className="text-sm group-hover:text-primary transition-colors">
                                                        {type.label}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Events Grid */}
                    <div className="flex-1">
                        {/* Results Count */}
                        {!loading && (
                            <div className="mb-4 text-text-secondary">
                                Found {pagination.total} {pagination.total === 1 ? 'event' : 'events'}
                            </div>
                        )}

                        {/* Loading State */}
                        {loading && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="animate-pulse">
                                        <div className="bg-bg-secondary/30 h-64 rounded-lg"></div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Error State */}
                        {error && !loading && (
                            <Card variant="glass" className="p-12 text-center">
                                <p className="text-red-400 mb-4">{error}</p>
                                <Button variant="gradient" onClick={fetchEvents}>
                                    Try Again
                                </Button>
                            </Card>
                        )}

                        {/* Empty State */}
                        {!loading && !error && events.length === 0 && (
                            <Card variant="glass" className="p-12 text-center">
                                <div className="max-w-md mx-auto">
                                    <h3 className="text-2xl font-bold mb-2">No events found</h3>
                                    <p className="text-text-secondary mb-6">
                                        Try adjusting your filters or search query
                                    </p>
                                    {hasActiveFilters && (
                                        <Button variant="gradient" onClick={clearFilters}>
                                            Clear Filters
                                        </Button>
                                    )}
                                </div>
                            </Card>
                        )}

                        {/* Events Grid */}
                        {!loading && !error && events.length > 0 && (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                    {events.map((event, index) => (
                                        <motion.div
                                            key={event.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                        >
                                            <EventCard event={event} />
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Pagination */}
                                {pagination.totalPages > 1 && (
                                    <div className="flex items-center justify-center gap-2">
                                        <Button
                                            variant="ghost"
                                            onClick={() => setPage(p => Math.max(1, p - 1))}
                                            disabled={page === 1}
                                        >
                                            <ChevronLeft className="w-5 h-5" />
                                        </Button>

                                        <div className="flex items-center gap-2">
                                            {[...Array(pagination.totalPages)].map((_, i) => {
                                                const pageNum = i + 1;
                                                // Show first, last, and pages around current
                                                if (
                                                    pageNum === 1 ||
                                                    pageNum === pagination.totalPages ||
                                                    (pageNum >= page - 1 && pageNum <= page + 1)
                                                ) {
                                                    return (
                                                        <Button
                                                            key={pageNum}
                                                            variant={pageNum === page ? 'gradient' : 'ghost'}
                                                            onClick={() => setPage(pageNum)}
                                                            size="sm"
                                                        >
                                                            {pageNum}
                                                        </Button>
                                                    );
                                                } else if (
                                                    pageNum === page - 2 ||
                                                    pageNum === page + 2
                                                ) {
                                                    return <span key={pageNum} className="text-text-muted">...</span>;
                                                }
                                                return null;
                                            })}
                                        </div>

                                        <Button
                                            variant="ghost"
                                            onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                                            disabled={!pagination.hasMore}
                                        >
                                            <ChevronRight className="w-5 h-5" />
                                        </Button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
