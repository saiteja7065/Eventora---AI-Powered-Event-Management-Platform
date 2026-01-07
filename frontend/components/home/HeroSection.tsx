'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sparkles, Calendar, Ticket, TrendingUp } from 'lucide-react';

export default function HeroSection() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Animated Mesh Background */}
            <div className="mesh-background" />

            <div className="container mx-auto px-4 z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center max-w-5xl mx-auto"
                >
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6"
                    >
                        <Sparkles className="w-4 h-4 text-accent-aurora-green" />
                        <span className="text-sm font-medium">AI-Powered Event Management</span>
                    </motion.div>

                    {/* Headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.7 }}
                        className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
                    >
                        Create{' '}
                        <span className="gradient-text">Extraordinary</span>
                        <br />
                        Events in Seconds
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.7 }}
                        className="text-xl md:text-2xl text-text-secondary mb-10 max-w-3xl mx-auto leading-relaxed"
                    >
                        Harness the power of AI to generate complete event details from a single prompt.
                        Discover, manage, and attend events like never before.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.7 }}
                        className="flex flex-wrap gap-4 justify-center"
                    >
                        <Button variant="gradient" size="xl" className="group">
                            <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                            Get Started Free
                        </Button>
                        <Button variant="glass" size="xl">
                            Watch Demo
                        </Button>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.7 }}
                        className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
                    >
                        {[
                            { icon: Calendar, label: 'Events Created', value: '10K+' },
                            { icon: Ticket, label: 'Tickets Sold', value: '50K+' },
                            { icon: TrendingUp, label: 'Active Users', value: '5K+' },
                        ].map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
                                className="glass p-6 rounded-xl hover:glow-cyan transition-all duration-300"
                            >
                                <stat.icon className="w-8 h-8 mx-auto mb-3 text-primary" />
                                <div className="text-3xl font-bold gradient-text mb-1">{stat.value}</div>
                                <div className="text-sm text-text-secondary">{stat.label}</div>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>
            </div>

            {/* Floating Elements */}
            <motion.div
                animate={{
                    y: [0, -20, 0],
                    rotate: [0, 5, 0],
                }}
                transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute top-20 right-10 w-32 h-32 rounded-full gradient-primary opacity-20 blur-3xl"
            />
            <motion.div
                animate={{
                    y: [0, 20, 0],
                    rotate: [0, -5, 0],
                }}
                transition={{
                    duration: 7,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute bottom-20 left-10 w-40 h-40 rounded-full gradient-secondary opacity-20 blur-3xl"
            />
        </section>
    );
}
