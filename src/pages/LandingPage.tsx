import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    BookOpen,
    Users,
    Calendar,
    CreditCard,
    MessageSquare,
    Shield,
    CheckCircle,
    ArrowRight,
    Menu,
    X,
    GraduationCap
} from 'lucide-react';

const LandingPage = () => {
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Handle scroll effect for navbar
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const features = [
        {
            icon: <BookOpen className="w-6 h-6 text-blue-600" />,
            title: "Learning Management",
            description: "Comprehensive LMS with course creation, assignment tracking, and grade management."
        },
        {
            icon: <Users className="w-6 h-6 text-indigo-600" />,
            title: "Student Information",
            description: "Centralized database for student profiles, attendance, and academic records."
        },
        {
            icon: <Calendar className="w-6 h-6 text-purple-600" />,
            title: "Smart Scheduling",
            description: "Automated timetable generation and conflict resolution for classes and exams."
        },
        {
            icon: <CreditCard className="w-6 h-6 text-green-600" />,
            title: "Finance & Billing",
            description: "Integrated financial management for tuition, invoicing, and expense tracking."
        },
        {
            icon: <MessageSquare className="w-6 h-6 text-orange-600" />,
            title: "Communication Hub",
            description: "Real-time messaging platform connecting teachers, students, and parents."
        },
        {
            icon: <Shield className="w-6 h-6 text-teal-600" />,
            title: "Secure & Compliant",
            description: "Enterprise-grade security ensuring data privacy and regulatory compliance."
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            {/* Navigation */}
            <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div className="bg-indigo-600 p-2 rounded-lg">
                                <GraduationCap className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-violet-700">
                                EduPulse
                            </span>
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center space-x-8">
                            <a href="#features" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Features</a>
                            <a href="#how-it-works" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Solutions</a>
                            <a href="#pricing" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Pricing</a>
                            <button
                                onClick={() => navigate('/login')}
                                className="text-slate-700 font-medium hover:text-indigo-600 px-4 py-2 transition-colors"
                            >
                                Log In
                            </button>
                            <button
                                onClick={() => navigate('/register')}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-full font-medium transition-all shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transform hover:-translate-y-0.5"
                            >
                                Get Started
                            </button>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden">
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="text-slate-600 hover:text-slate-900 focus:outline-none"
                            >
                                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden bg-white border-b border-slate-100 shadow-xl absolute w-full left-0 top-full px-4 py-4 flex flex-col space-y-4">
                        <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-slate-600 font-medium py-2">Features</a>
                        <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="text-slate-600 font-medium py-2">Solutions</a>
                        <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="text-slate-600 font-medium py-2">Pricing</a>
                        <hr className="border-slate-100" />
                        <button
                            onClick={() => navigate('/login')}
                            className="text-left text-slate-700 font-medium py-2"
                        >
                            Log In
                        </button>
                        <button
                            onClick={() => navigate('/register')}
                            className="bg-indigo-600 text-white px-5 py-3 rounded-lg font-medium text-center"
                        >
                            Get Started
                        </button>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
                {/* Background blobs */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-indigo-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[600px] h-[600px] bg-purple-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center max-w-4xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 mb-8 animate-fade-in-up">
                            <span className="flex h-2 w-2 rounded-full bg-indigo-600"></span>
                            <span className="text-sm font-semibold text-indigo-700">New: SaaS Platform for Modern Schools</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-slate-900 leading-tight tracking-tight mb-6">
                            The Heartbeat of <br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
                                Modern Education
                            </span>
                        </h1>

                        <p className="text-xl md:text-2xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                            Empower your institution with an all-in-one platform for learning, management, and growth. Streamline operations and focus on what matters most: education.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button
                                onClick={() => navigate('/login')}
                                className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white rounded-full font-bold text-lg shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
                            >
                                Start Your Journey <ArrowRight className="w-5 h-5" />
                            </button>
                            <button
                                className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-full font-bold text-lg hover:bg-slate-50 transition-all focus:ring-4 focus:ring-slate-100"
                            >
                                Schedule Demo
                            </button>
                        </div>

                        {/* Social Proof / Stats */}
                        <div className="mt-16 pt-8 border-t border-slate-200 flex flex-wrap justify-center gap-8 md:gap-16 text-slate-500">
                            <div className="text-center">
                                <p className="text-3xl font-bold text-slate-900">500+</p>
                                <p className="text-sm font-medium">Schools Trust Us</p>
                            </div>
                            <div className="text-center">
                                <p className="text-3xl font-bold text-slate-900">50k+</p>
                                <p className="text-sm font-medium">Active Students</p>
                            </div>
                            <div className="text-center">
                                <p className="text-3xl font-bold text-slate-900">99.9%</p>
                                <p className="text-sm font-medium">Uptime Guarantee</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Everything you need to run your school</h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            EduPulse replaces disconnected tools with a single, unified operating system for your entire educational ecosystem.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div key={index} className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-50 transition-all duration-300 group">
                                <div className="mb-4 inline-block p-3 rounded-xl bg-white shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                                    {React.cloneElement(feature.icon as React.ReactElement, {
                                        className: `w-6 h-6 ${feature.icon.props.className.split(' ')[2]} group-hover:text-white transition-colors`
                                    })}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-indigo-900 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
                <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to transform your institution?</h2>
                    <p className="text-indigo-200 text-lg mb-10 max-w-2xl mx-auto">
                        Join hundreds of forward-thinking schools that are actively shaping the future of education with EduPulse.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <button
                            onClick={() => navigate('/register')}
                            className="px-8 py-4 bg-white text-indigo-900 rounded-full font-bold text-lg hover:bg-slate-100 transition-colors shadow-lg"
                        >
                            Get Started Now
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                        <div className="col-span-1 md:col-span-1">
                            <div className="flex items-center gap-2 mb-4">
                                <GraduationCap className="w-6 h-6 text-white" />
                                <span className="text-xl font-bold text-white">EduPulse</span>
                            </div>
                            <p className="text-sm">
                                The complete operating system for modern educational institutions.
                            </p>
                        </div>

                        <div>
                            <h4 className="text-white font-semibold mb-4">Product</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Changelog</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-semibold mb-4">Company</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-semibold mb-4">Legal</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="pt-8 border-t border-slate-800 text-center text-sm">
                        &copy; {new Date().getFullYear()} EduPulse. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
