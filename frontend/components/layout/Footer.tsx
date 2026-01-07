import Link from 'next/link';
import { Sparkles, Github, Twitter, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
    const footerLinks = {
        Product: [
            { label: 'Features', href: '#features' },
            { label: 'Pricing', href: '#pricing' },
            { label: 'How It Works', href: '#how-it-works' },
            { label: 'Roadmap', href: '#roadmap' },
        ],
        Company: [
            { label: 'About', href: '#about' },
            { label: 'Blog', href: '#blog' },
            { label: 'Careers', href: '#careers' },
            { label: 'Contact', href: '#contact' },
        ],
        Resources: [
            { label: 'Documentation', href: '#docs' },
            { label: 'API Reference', href: '#api' },
            { label: 'Community', href: '#community' },
            { label: 'Support', href: '#support' },
        ],
        Legal: [
            { label: 'Privacy', href: '#privacy' },
            { label: 'Terms', href: '#terms' },
            { label: 'Security', href: '#security' },
            { label: 'Cookies', href: '#cookies' },
        ],
    };

    const socialLinks = [
        { icon: Github, href: '#', label: 'GitHub' },
        { icon: Twitter, href: '#', label: 'Twitter' },
        { icon: Linkedin, href: '#', label: 'LinkedIn' },
        { icon: Mail, href: '#', label: 'Email' },
    ];

    return (
        <footer className="relative border-t border-white/10 bg-bg-primary">
            <div className="container mx-auto px-4 py-16">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
                    {/* Brand Column */}
                    <div className="lg:col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                                <Sparkles className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-2xl font-bold gradient-text">Eventora</span>
                        </Link>
                        <p className="text-text-secondary mb-6 max-w-sm">
                            AI-powered event management platform. Create extraordinary events in seconds.
                        </p>
                        <div className="flex gap-4">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    className="w-10 h-10 rounded-lg glass flex items-center justify-center hover:glow-cyan transition-all duration-300 group"
                                    aria-label={social.label}
                                >
                                    <social.icon className="w-5 h-5 text-text-secondary group-hover:text-white transition-colors" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links Columns */}
                    {Object.entries(footerLinks).map(([category, links]) => (
                        <div key={category}>
                            <h3 className="font-semibold mb-4 text-white">{category}</h3>
                            <ul className="space-y-3">
                                {links.map((link) => (
                                    <li key={link.label}>
                                        <a
                                            href={link.href}
                                            className="text-text-secondary hover:text-white transition-colors duration-200 text-sm"
                                        >
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-text-secondary text-sm">
                        © {new Date().getFullYear()} Eventora. All rights reserved.
                    </p>
                    <p className="text-text-secondary text-sm">
                        Built with ❤️ using Next.js, Tailwind CSS, and AI
                    </p>
                </div>
            </div>

            {/* Background Decoration */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
        </footer>
    );
}
