'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Wand2, Loader2, Image as ImageIcon, Calendar, MapPin, Users, DollarSign, AlertCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { generateEventFromPrompt, createEvent } from '@/lib/api-client';

export default function CreateEventPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [generatedEvent, setGeneratedEvent] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    const examplePrompts = [
        "Tech conference in San Francisco about AI and web development",
        "Charity run for local animal shelter in Central Park",
        "Virtual yoga and meditation retreat for beginners",
        "Music festival featuring indie rock bands in Austin",
    ];

    const handleGenerate = async () => {
        if (!prompt.trim()) return;

        setIsGenerating(true);
        setError(null);

        try {
            const response = await generateEventFromPrompt(prompt);

            if (response.success && response.data) {
                setGeneratedEvent(response.data);
                // Pre-select AI banner if available, otherwise first Unsplash image
                setSelectedImageIndex(response.data.aiGeneratedBanner ? -1 : 0);
            } else {
                setError(response.error || 'Failed to generate event. Please try again.');
            }
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleCreateEvent = async () => {
        if (!generatedEvent || !user) {
            setError('You must be logged in to create an event');
            return;
        }

        setIsCreating(true);
        setError(null);

        try {
            // Get form values
            const form = document.getElementById('event-form') as HTMLFormElement;
            const formData = new FormData(form);

            // Determine which image is selected
            let coverImage: any;

            if (selectedImageIndex === -1 && generatedEvent.aiGeneratedBanner) {
                // AI-generated banner is selected
                coverImage = {
                    url: `data:image/png;base64,${generatedEvent.aiGeneratedBanner.imageData}`,
                    alt: 'AI Generated Banner',
                    photographer: 'HuggingFace AI',
                    source: 'huggingface-sdxl' as const
                };
            } else {
                // Unsplash image is selected
                const selectedImage = generatedEvent.coverImages[selectedImageIndex];
                coverImage = {
                    url: selectedImage.url,
                    alt: selectedImage.alt,
                    photographer: selectedImage.photographer,
                    source: 'unsplash' as const
                };
            }

            const eventData = {
                title: formData.get('title') as string,
                description: formData.get('description') as string,
                categories: generatedEvent.categories,
                coverImage,
                locationType: generatedEvent.suggestedLocation.locationType,
                city: formData.get('city') as string,
                country: generatedEvent.suggestedLocation.country,
                startTime: formData.get('startTime') as string,
                endTime: '', // Calculate from startTime + duration
                capacity: parseInt(formData.get('capacity') as string) || undefined,
                ticketPrice: parseFloat(formData.get('ticketPrice') as string) || 0,
            };

            // Calculate endTime based on start + estimated duration
            const startDate = new Date(eventData.startTime);
            const durationHours = generatedEvent.estimatedDuration || 2;
            startDate.setHours(startDate.getHours() + durationHours);
            eventData.endTime = startDate.toISOString();

            await createEvent(eventData);

            // Success! Redirect to dashboard or events list
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Failed to create event');
        } finally {
            setIsCreating(false);
        }
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
                        {/* Cover Images Selection */}
                        {generatedEvent.coverImages && generatedEvent.coverImages.length > 0 && (
                            <Card variant="glass">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <ImageIcon className="w-6 h-6 text-primary" />
                                        Choose Your Event Cover
                                    </CardTitle>
                                    <CardDescription>
                                        {generatedEvent.aiGeneratedBanner
                                            ? 'AI-generated banner available, plus curated Unsplash images'
                                            : 'Select from AI-curated images or upload your own'}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {/* AI Generated Banner - Show first if available */}
                                        {generatedEvent.aiGeneratedBanner && (
                                            <button
                                                key="ai-banner"
                                                type="button"
                                                onClick={() => setSelectedImageIndex(-1)}
                                                className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${selectedImageIndex === -1
                                                    ? 'border-primary ring-2 ring-primary/50'
                                                    : 'border-white/10 hover:border-white/30'
                                                    }`}
                                            >
                                                <img
                                                    src={`data:image/png;base64,${generatedEvent.aiGeneratedBanner.imageData}`}
                                                    alt="AI Generated Banner"
                                                    className="w-full h-full object-cover"
                                                />
                                                {selectedImageIndex === -1 && (
                                                    <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                                                        <div className="bg-primary rounded-full p-2">
                                                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                )}
                                                <div className="absolute top-2 left-2">
                                                    <span className="px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-xs font-semibold text-white shadow-lg flex items-center gap-1">
                                                        <Sparkles className="w-3 h-3" />
                                                        AI Generated
                                                    </span>
                                                </div>
                                            </button>
                                        )}

                                        {/* Unsplash Images */}
                                        {generatedEvent.coverImages.map((image: any, index: number) => (
                                            <button
                                                key={image.id}
                                                type="button"
                                                onClick={() => setSelectedImageIndex(index)}
                                                className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${selectedImageIndex === index
                                                    ? 'border-primary ring-2 ring-primary/50'
                                                    : 'border-white/10 hover:border-white/30'
                                                    }`}
                                            >
                                                <img
                                                    src={image.thumb}
                                                    alt={image.alt}
                                                    className="w-full h-full object-cover"
                                                />
                                                {selectedImageIndex === index && (
                                                    <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                                                        <div className="bg-primary rounded-full p-2">
                                                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                )}
                                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                                                    <p className="text-xs text-white/80">Photo by {image.photographer}</p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Event Details Form */}
                        <form id="event-form">
                            <Card variant="glass">
                                <CardHeader>
                                    <CardTitle className="flex items-center justify-between">
                                        <span>Event Details</span>
                                        <span className="text-sm font-normal text-primary">✨ AI Generated</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {/* Title */}
                                    <div>
                                        <label className="text-sm font-medium text-text-secondary mb-2 block">Event Title</label>
                                        <input
                                            type="text"
                                            name="title"
                                            defaultValue={generatedEvent.title}
                                            required
                                            className="w-full px-4 py-3 bg-bg-secondary/50 border border-white/10 rounded-lg focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all text-white text-xl font-bold"
                                        />
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <label className="text-sm font-medium text-text-secondary mb-2 block">Description</label>
                                        <textarea
                                            name="description"
                                            defaultValue={generatedEvent.description}
                                            required
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
                                                name="city"
                                                placeholder="City, Country"
                                                defaultValue={`${generatedEvent.suggestedLocation.city}, ${generatedEvent.suggestedLocation.country}`}
                                                required
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
                                                name="startTime"
                                                required
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
                                                name="capacity"
                                                placeholder="100"
                                                defaultValue={generatedEvent.suggestedCapacity || ''}
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
                                                name="ticketPrice"
                                                placeholder="0 for free"
                                                defaultValue="0"
                                                step="0.01"
                                                min="0"
                                                className="w-full px-4 py-2 bg-bg-secondary/50 border border-white/10 rounded-lg focus:outline-none focus:border-primary/50 text-white"
                                            />
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-3 pt-4">
                                        <Button
                                            type="button"
                                            variant="gradient"
                                            size="lg"
                                            className="flex-1"
                                            onClick={handleCreateEvent}
                                            disabled={isCreating}
                                        >
                                            {isCreating ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                                    Creating Event...
                                                </>
                                            ) : (
                                                'Create Event'
                                            )}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="lg"
                                            onClick={() => setGeneratedEvent(null)}
                                            disabled={isCreating}
                                        >
                                            Start Over
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </form>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
