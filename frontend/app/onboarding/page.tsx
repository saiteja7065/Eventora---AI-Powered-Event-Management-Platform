'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Heart, Music, Code, Briefcase, Palette, Dumbbell,
    Coffee, GraduationCap, Heart as HeartHealth, Film,
    Users, Gift, ChevronLeft, ChevronRight, Check,
    MapPin, Globe, Bell, Mail, Loader2
} from 'lucide-react';
import { saveUserPreferences } from '@/lib/api-client';

const INTEREST_CATEGORIES = [
    { id: 'technology', label: 'Technology', icon: Code, color: 'from-blue-500 to-cyan-500' },
    { id: 'business', label: 'Business', icon: Briefcase, color: 'from-purple-500 to-pink-500' },
    { id: 'arts-culture', label: 'Arts & Culture', icon: Palette, color: 'from-orange-500 to-red-500' },
    { id: 'sports-fitness', label: 'Sports & Fitness', icon: Dumbbell, color: 'from-green-500 to-emerald-500' },
    { id: 'food-drink', label: 'Food & Drink', icon: Coffee, color: 'from-amber-500 to-yellow-500' },
    { id: 'music', label: 'Music', icon: Music, color: 'from-pink-500 to-rose-500' },
    { id: 'education', label: 'Education', icon: GraduationCap, color: 'from-indigo-500 to-blue-500' },
    { id: 'health-wellness', label: 'Health & Wellness', icon: HeartHealth, color: 'from-teal-500 to-cyan-500' },
    { id: 'entertainment', label: 'Entertainment', icon: Film, color: 'from-violet-500 to-purple-500' },
    { id: 'networking', label: 'Networking', icon: Users, color: 'from-blue-600 to-indigo-600' },
    { id: 'charity', label: 'Charity', icon: Gift, color: 'from-rose-500 to-pink-500' },
    { id: 'lifestyle', label: 'Lifestyle', icon: Heart, color: 'from-red-500 to-pink-500' },
];

const COUNTRIES = [
    'United States', 'United Kingdom', 'Canada', 'Australia', 'India',
    'Germany', 'France', 'Spain', 'Italy', 'Japan', 'China', 'Brazil',
    'Mexico', 'Netherlands', 'Singapore', 'UAE', 'South Africa', 'Other'
];

export default function OnboardingPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Form state
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
    const [location, setLocation] = useState({ city: '', country: '' });
    const [notifications, setNotifications] = useState({
        email: true,
        eventReminders: true,
        weeklyDigest: false
    });

    const toggleInterest = (id: string) => {
        setSelectedInterests(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleNext = () => {
        if (currentStep === 1 && selectedInterests.length === 0) {
            setError('Please select at least one interest');
            return;
        }
        if (currentStep === 2 && (!location.city || !location.country)) {
            setError('Please provide your location');
            return;
        }
        setError('');
        setCurrentStep(prev => prev + 1);
    };

    const handleBack = () => {
        setError('');
        setCurrentStep(prev => prev - 1);
    };

    const handleSkip = () => {
        router.push('/dashboard');
    };

    const handleComplete = async () => {
        setLoading(true);
        setError('');

        const preferences = {
            interests: selectedInterests,
            location: location.city && location.country ? location : undefined,
            notificationSettings: notifications
        };

        const result = await saveUserPreferences(preferences);

        if (result.success) {
            router.push('/dashboard');
        } else {
            setError(result.error || 'Failed to save preferences');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-bg-primary flex items-center justify-center py-12 px-4">
            <div className="mesh-background" />

            <div className="w-full max-w-4xl relative z-10">
                {/* Progress Indicator */}
                <div className="mb-8">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        {[1, 2, 3].map(step => (
                            <div key={step} className="flex items-center">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${step < currentStep ? 'bg-gradient-to-r from-primary to-purple-600' :
                                        step === currentStep ? 'bg-primary' :
                                            'bg-white/10'
                                    }`}>
                                    {step < currentStep ? (
                                        <Check className="w-5 h-5 text-white" />
                                    ) : (
                                        <span className="text-white font-semibold">{step}</span>
                                    )}
                                </div>
                                {step < 3 && (
                                    <div className={`w-16 h-1 mx-2 transition-all ${step < currentStep ? 'bg-gradient-to-r from-primary to-purple-600' : 'bg-white/10'
                                        }`} />
                                )}
                            </div>
                        ))}
                    </div>
                    <p className="text-center text-text-secondary">
                        Step {currentStep} of 3
                    </p>
                </div>

                <Card variant="glass">
                    <CardContent className="p-8">
                        <AnimatePresence mode="wait">
                            {/* Step 1: Interests */}
                            {currentStep === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                >
                                    <h2 className="text-3xl font-bold mb-2 gradient-text">What are you interested in?</h2>
                                    <p className="text-text-secondary mb-6">
                                        Select the event categories you'd like to see. Choose at least one.
                                    </p>

                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                                        {INTEREST_CATEGORIES.map(category => {
                                            const Icon = category.icon;
                                            const isSelected = selectedInterests.includes(category.id);
                                            return (
                                                <motion.button
                                                    key={category.id}
                                                    onClick={() => toggleInterest(category.id)}
                                                    className={`p-4 rounded-xl border-2 transition-all ${isSelected
                                                            ? 'border-primary bg-primary/10 scale-105'
                                                            : 'border-white/10 hover:border-primary/50'
                                                        }`}
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                >
                                                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center mx-auto mb-2`}>
                                                        <Icon className="w-6 h-6 text-white" />
                                                    </div>
                                                    <p className="text-sm font-medium text-center">{category.label}</p>
                                                    {isSelected && (
                                                        <div className="mt-2 flex justify-center">
                                                            <Check className="w-4 h-4 text-primary" />
                                                        </div>
                                                    )}
                                                </motion.button>
                                            );
                                        })}
                                    </div>

                                    {selectedInterests.length > 0 && (
                                        <p className="text-sm text-text-secondary text-center mb-4">
                                            {selectedInterests.length} {selectedInterests.length === 1 ? 'category' : 'categories'} selected
                                        </p>
                                    )}
                                </motion.div>
                            )}

                            {/* Step 2: Location */}
                            {currentStep === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                >
                                    <h2 className="text-3xl font-bold mb-2 gradient-text">Where are you located?</h2>
                                    <p className="text-text-secondary mb-6">
                                        Help us show you events near you
                                    </p>

                                    <div className="max-w-md mx-auto space-y-4">
                                        <div>
                                            <label className="text-sm font-medium text-text-secondary mb-2 block flex items-center gap-2">
                                                <Globe className="w-4 h-4" />
                                                Country
                                            </label>
                                            <select
                                                value={location.country}
                                                onChange={(e) => setLocation({ ...location, country: e.target.value })}
                                                className="w-full px-4 py-3 bg-bg-secondary/50 border border-white/10 rounded-lg focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all text-white"
                                            >
                                                <option value="">Select country</option>
                                                {COUNTRIES.map(country => (
                                                    <option key={country} value={country}>{country}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium text-text-secondary mb-2 block flex items-center gap-2">
                                                <MapPin className="w-4 h-4" />
                                                City
                                            </label>
                                            <input
                                                type="text"
                                                value={location.city}
                                                onChange={(e) => setLocation({ ...location, city: e.target.value })}
                                                placeholder="e.g., New York"
                                                className="w-full px-4 py-3 bg-bg-secondary/50 border border-white/10 rounded-lg focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all text-white"
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 3: Notifications */}
                            {currentStep === 3 && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                >
                                    <h2 className="text-3xl font-bold mb-2 gradient-text">Stay updated</h2>
                                    <p className="text-text-secondary mb-6">
                                        Choose how you'd like to hear from us
                                    </p>

                                    <div className="max-w-md mx-auto space-y-4">
                                        <div className="p-4 rounded-lg border border-white/10 hover:border-primary/30 transition-all">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                                                        <Mail className="w-5 h-5 text-primary" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">Email Notifications</p>
                                                        <p className="text-sm text-text-secondary">Event updates and announcements</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => setNotifications({ ...notifications, email: !notifications.email })}
                                                    className={`w-12 h-6 rounded-full transition-all ${notifications.email ? 'bg-primary' : 'bg-white/10'
                                                        }`}
                                                >
                                                    <div className={`w-5 h-5 rounded-full bg-white transition-all ${notifications.email ? 'translate-x-6' : 'translate-x-0.5'
                                                        }`} />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="p-4 rounded-lg border border-white/10 hover:border-primary/30 transition-all">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                                                        <Bell className="w-5 h-5 text-purple-400" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">Event Reminders</p>
                                                        <p className="text-sm text-text-secondary">Get notified before events start</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => setNotifications({ ...notifications, eventReminders: !notifications.eventReminders })}
                                                    className={`w-12 h-6 rounded-full transition-all ${notifications.eventReminders ? 'bg-primary' : 'bg-white/10'
                                                        }`}
                                                >
                                                    <div className={`w-5 h-5 rounded-full bg-white transition-all ${notifications.eventReminders ? 'translate-x-6' : 'translate-x-0.5'
                                                        }`} />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="p-4 rounded-lg border border-white/10 hover:border-primary/30 transition-all">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                                                        <Mail className="w-5 h-5 text-green-400" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">Weekly Digest</p>
                                                        <p className="text-sm text-text-secondary">Curated events based on your interests</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => setNotifications({ ...notifications, weeklyDigest: !notifications.weeklyDigest })}
                                                    className={`w-12 h-6 rounded-full transition-all ${notifications.weeklyDigest ? 'bg-primary' : 'bg-white/10'
                                                        }`}
                                                >
                                                    <div className={`w-5 h-5 rounded-full bg-white transition-all ${notifications.weeklyDigest ? 'translate-x-6' : 'translate-x-0.5'
                                                        }`} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Error Message */}
                        {error && (
                            <div className="mt-6 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                                <p className="text-sm text-red-400">{error}</p>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
                            <div>
                                {currentStep > 1 && (
                                    <Button
                                        variant="ghost"
                                        onClick={handleBack}
                                        disabled={loading}
                                    >
                                        <ChevronLeft className="w-5 h-5 mr-1" />
                                        Back
                                    </Button>
                                )}
                            </div>

                            <div className="flex items-center gap-3">
                                <Button
                                    variant="ghost"
                                    onClick={handleSkip}
                                    disabled={loading}
                                >
                                    Skip for now
                                </Button>

                                {currentStep < 3 ? (
                                    <Button
                                        variant="gradient"
                                        onClick={handleNext}
                                        disabled={loading}
                                    >
                                        Next
                                        <ChevronRight className="w-5 h-5 ml-1" />
                                    </Button>
                                ) : (
                                    <Button
                                        variant="gradient"
                                        onClick={handleComplete}
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <Check className="w-5 h-5 mr-2" />
                                                Complete
                                            </>
                                        )}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
