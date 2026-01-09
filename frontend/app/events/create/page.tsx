'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Wand2, Loader2, Image as ImageIcon, Calendar, MapPin, Users, DollarSign } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';

export default function CreateEventPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedEvent, setGeneratedEvent] = useState<any>(null);

    const examplePrompts = [
        "Tech conference in San Francisco about AI and web development",
        "Charity run for local animal shelter in Central Park",
        "Virtual yoga and meditation retreat for beginners",
        "Music festival featuring indie rock bands in Austin",
    ];

    const handleGenerate = async () => {
        if (!prompt.trim()) return;

        setIsGenerating(true);
        // Simulate AI generation (will integrate real API later)
        setTimeout(() => {
            setGeneratedEvent({
                title: "AI & Web Dev Summit 2024",
                description: "Join us for an immersive full-day conference exploring the intersection of artificial intelligence and modern web development. Connect with industry leaders, attend hands-on workshops, and discover cutting-edge tools shaping the future of tech.",
                categories: ["Technology", "Conference", "AI", "Web Development"],
                suggestedLocation: { city: "San Francisco", country: "USA" },
            });
            setIsGenerating(false);
        }, 3000);
    };

    return (
        <div className="min-h-screen bg-bg-primary py-12 px-4">
            {/* Background Effects */}
            <div className="mesh-background" />

            <div className="container mx-auto max-w-6xl relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-4">
                        <Wand2 className="w-5 h-5 text-primary" />
                        <span className="text-sm font-medium">AI-Powered Event Creation</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold mb-4">
                        <span className="gradient-text">Command Center</span>
                    </h1>
                    <p className="text-xl text-text-secondary max-w-2xl mx-auto">
                        Describe your dream event and let AI handle the rest
                    </p>
                </motion.div>

                {/* AI Prompt Input */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card variant="glass" className="mb-8">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Sparkles className="w-6 h-6 text-primary" />
                                Tell us about your event
                            </CardTitle>
                            <CardDescription>
                                Be as detailed or brief as you like - our AI will fill in the gaps
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {/* Textarea */}
                                <div className="relative">
                                    <textarea
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                        placeholder="e.g., Tech conference in NYC about AI, Charity marathon for cancer research, Virtual cooking class for Italian cuisine..."
                                        className="w-full h-32 px-4 py-3 bg-bg-secondary/50 border-2 border-white/10 rounded-lg focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all text-white placeholder:text-text-muted resize-none"
                                        disabled={isGenerating}
                                    />
                                    <div className="absolute bottom-3 right-3 text-xs text-text-muted">
                                        {prompt.length}/500
                                    </div>
                                </div>

                                {/* Example Prompts */}
                                <div className="flex flex-wrap gap-2">
                                    <span className="text-sm text-text-secondary">Try:</span>
                                    {examplePrompts.map((example, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setPrompt(example)}
                                            className="text-xs px-3 py-1 rounded-full glass hover:bg-white/10 transition-colors text-text-secondary hover:text-white"
                                            disabled={isGenerating}
                                        >
                                            {example}
                                        </button>
                                    ))}
                                </div>

                                {/* Generate Button */}
                                <Button
                                    variant="gradient"
                                    size="lg"
                                    className="w-full group"
                                    onClick={handleGenerate}
                                    disabled={!prompt.trim() || isGenerating}
                                >
                                    {isGenerating ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                            AI is working its magic...
                                        </>
                                    ) : (
                                        <>
                                            <Wand2 className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                                            Generate with AI
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Generated Event Preview */}
                {generatedEvent && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        {/* Event Details */}
                        <Card variant="glass">
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <span>Generated Event Details</span>
                                    <span className="text-sm font-normal text-primary">✨ AI Generated</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Title */}
                                <div>
                                    <label className="text-sm font-medium text-text-secondary mb-2 block">Event Title</label>
                                    <input
                                        type="text"
                                        defaultValue={generatedEvent.title}
                                        className="w-full px-4 py-3 bg-bg-secondary/50 border border-white/10 rounded-lg focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all text-white text-xl font-bold"
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="text-sm font-medium text-text-secondary mb-2 block">Description</label>
                                    <textarea
                                        defaultValue={generatedEvent.description}
                                        className="w-full px-4 py-3 bg-bg-secondary/50 border border-white/10 rounded-lg focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all text-white h-32 resize-none"
                                    />
                                </div>

                                {/* Categories */}
                                <div>
                                    <label className="text-sm font-medium text-text-secondary mb-2 block">Categories</label>
                                    <div className="flex flex-wrap gap-2">
                                        {generatedEvent.categories.map((category: string, index: number) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1 rounded-full glass text-sm"
                                            >
                                                {category}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Quick Form */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/10">
                                    <div>
                                        <label className="text-sm font-medium text-text-secondary mb-2 block flex items-center gap-2">
                                            <MapPin className="w-4 h-4" />
                                            Location
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="City, Country"
                                            defaultValue={`${generatedEvent.suggestedLocation.city}, ${generatedEvent.suggestedLocation.country}`}
                                            className="w-full px-4 py-2 bg-bg-secondary/50 border border-white/10 rounded-lg focus:outline-none focus:border-primary/50 text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-text-secondary mb-2 block flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            Start Date & Time
                                        </label>
                                        <input
                                            type="datetime-local"
                                            className="w-full px-4 py-2 bg-bg-secondary/50 border border-white/10 rounded-lg focus:outline-none focus:border-primary/50 text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-text-secondary mb-2 block flex items-center gap-2">
                                            <Users className="w-4 h-4" />
                                            Capacity
                                        </label>
                                        <input
                                            type="number"
                                            placeholder="100"
                                            className="w-full px-4 py-2 bg-bg-secondary/50 border border-white/10 rounded-lg focus:outline-none focus:border-primary/50 text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-text-secondary mb-2 block flex items-center gap-2">
                                            <DollarSign className="w-4 h-4" />
                                            Ticket Price (USD)
                                        </label>
                                        <input
                                            type="number"
                                            placeholder="0 for free"
                                            defaultValue="0"
                                            className="w-full px-4 py-2 bg-bg-secondary/50 border border-white/10 rounded-lg focus:outline-none focus:border-primary/50 text-white"
                                        />
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3 pt-4">
                                    <Button variant="gradient" size="lg" className="flex-1">
                                        Create Event
                                    </Button>
                                    <Button variant="ghost" size="lg" onClick={() => setGeneratedEvent(null)}>
                                        Start Over
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
