'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Image, Calendar, Rocket } from 'lucide-react';

const steps = [
    {
        number: '01',
        icon: Sparkles,
        title: 'Describe Your Event',
        description: 'Just type what you want to create. "Tech conference in San Francisco" or "Charity run for local shelter".',
        color: 'from-cyan-500 to-blue-500',
    },
    {
        number: '02',
        icon: Image,
        title: 'AI Generates Details',
        description: 'Our AI creates the title, description, categories, and fetches perfect cover images from Unsplash.',
        color: 'from-purple-500 to-pink-500',
    },
    {
        number: '03',
        icon: Calendar,
        title: 'Customize & Publish',
        description: 'Review the generated content, make any tweaks, set your date and location, then publish.',
        color: 'from-orange-500 to-red-500',
    },
    {
        number: '04',
        icon: Rocket,
        title: 'Watch It Grow',
        description: 'Track registrations in real-time, scan tickets at the venue, and analyze your event\'s success.',
        color: 'from-green-500 to-emerald-500',
    },
];

export default function HowItWorksSection() {
    return (
        <section className="py-24 px-4 relative">
            <div className="container mx-auto max-w-7xl">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-20"
                >
                    <h2 className="text-5xl md:text-6xl font-bold mb-4">
                        <span className="gradient-text">How It Works</span>
                    </h2>
                    <p className="text-xl text-text-secondary max-w-2xl mx-auto">
                        From idea to live event in just 4 simple steps
                    </p>
                </motion.div>

                {/* Steps */}
                <div className="relative">
                    {/* Connection Line */}
                    <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 via-purple-500 to-green-500 opacity-20 -translate-y-1/2" />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {steps.map((step, index) => (
                            <motion.div
                                key={step.number}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="relative"
                            >
                                {/* Card */}
                                <div className="glass rounded-2xl p-6 h-full hover:glow-cyan transition-all duration-300 group">
                                    {/* Number Badge */}
                                    <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                                        <span className="text-2xl font-bold text-white">{step.number}</span>
                                    </div>

                                    {/* Icon */}
                                    <div className="flex justify-center mb-4">
                                        <step.icon className="w-8 h-8 text-primary" />
                                    </div>

                                    {/* Content */}
                                    <h3 className="text-xl font-bold mb-3 text-center">{step.title}</h3>
                                    <p className="text-text-secondary text-center leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>

                                {/* Arrow (desktop only) */}
                                {index < steps.length - 1 && (
                                    <div className="hidden lg:block absolute top-1/2 -right-4 -translate-y-1/2 z-10">
                                        <ArrowRight className="w-6 h-6 text-primary" />
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-center mt-16"
                >
                    <p className="text-lg text-text-secondary mb-4">
                        Ready to create your first AI-powered event?
                    </p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="gradient-primary px-8 py-4 rounded-lg text-white font-semibold text-lg shadow-lg hover:shadow-2xl glow-cyan transition-all duration-300"
                    >
                        Start Creating Now →
                    </motion.button>
                </motion.div>
            </div>
        </section>
    );
}
