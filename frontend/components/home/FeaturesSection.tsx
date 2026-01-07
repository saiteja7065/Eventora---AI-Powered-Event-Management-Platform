'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Search, Ticket, BarChart3, Zap, Users } from 'lucide-react';

const features = [
    {
        icon: Sparkles,
        title: 'AI-Powered Creation',
        description: 'Generate complete event details from a single text prompt. Our AI creates titles, descriptions, and categories instantly.',
        gradient: 'from-cyan-500 to-blue-500',
    },
    {
        icon: Search,
        title: 'Smart Discovery',
        description: 'Personalized event recommendations based on your interests and location. Never miss an event you\'d love.',
        gradient: 'from-purple-500 to-pink-500',
    },
    {
        icon: Ticket,
        title: 'Digital Ticketing',
        description: 'QR-coded tickets delivered instantly. Seamless check-in with our built-in scanner for organizers.',
        gradient: 'from-orange-500 to-red-500',
    },
    {
        icon: BarChart3,
        title: 'Real-Time Analytics',
        description: 'Track registrations, attendance, and revenue live. Exportable reports for post-event analysis.',
        gradient: 'from-green-500 to-emerald-500',
    },
    {
        icon: Zap,
        title: 'Lightning Fast',
        description: 'Optimized performance with sub-2-second response times. Built for scale with cutting-edge technology.',
        gradient: 'from-yellow-500 to-orange-500',
    },
    {
        icon: Users,
        title: 'Community Driven',
        description: 'Connect with like-minded attendees. Share experiences and build your event network.',
        gradient: 'from-indigo-500 to-purple-500',
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
        },
    },
};

export default function FeaturesSection() {
    return (
        <section className="py-24 px-4 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto max-w-7xl">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-5xl md:text-6xl font-bold mb-4">
                        Everything You Need,
                        <br />
                        <span className="gradient-text">All in One Place</span>
                    </h2>
                    <p className="text-xl text-text-secondary max-w-2xl mx-auto">
                        Powerful features designed to make event management effortless and enjoyable
                    </p>
                </motion.div>

                {/* Features Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {features.map((feature, index) => (
                        <motion.div key={feature.title} variants={itemVariants}>
                            <Card variant="glass" hover glow className="h-full group">
                                <CardHeader>
                                    <div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                        <feature.icon className="w-7 h-7 text-white" />
                                    </div>
                                    <CardTitle className="text-2xl">{feature.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-base leading-relaxed">
                                        {feature.description}
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
