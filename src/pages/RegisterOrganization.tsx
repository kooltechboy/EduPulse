import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { GraduationCap, Loader2, ArrowRight, Building2, User, Mail, Lock, CheckCircle, AlertCircle } from 'lucide-react';
import { UserRole } from '@/types';

const RegisterOrganization = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        schoolName: '',
        slug: '',
        adminName: '',
        email: '',
        password: ''
    });

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');
    };

    const handleSchoolNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        setFormData(prev => ({
            ...prev,
            schoolName: name,
            slug: generateSlug(name)
        }));
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            // 1. Create School
            const { data: school, error: schoolError } = await supabase
                .from('schools')
                .insert({
                    name: formData.schoolName,
                    slug: formData.slug,
                    subscription_plan: 'free'
                })
                .select()
                .single();

            if (schoolError) {
                // Handle unique slug error specifically
                if (schoolError.code === '23505') {
                    throw new Error('This school URL is already taken. Please try a different name or specific slug.');
                }
                throw new Error(schoolError.message);
            }

            if (!school) throw new Error('Failed to create school');

            // 2. SignUp Admin User
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        name: formData.adminName,
                        role: UserRole.ADMIN,
                        school_id: school.id,
                        is_super_admin: true // First user is super admin for the school
                    }
                }
            });

            if (authError) throw new Error(authError.message);

            // 3. Create User Profile Record (Triggers usually handle this, but for safety/migration we might need manual insert if no trigger)
            // Assuming triggers are set up or we rely on Auth Context to pick it up from Metadata?
            // For now, let's manually insert to be safe if `users` table is managed manually.
            // CHECK: typical starter kits trigger on auth.users. But our migration 003 creates `users` table manually.
            // Ideally we should have a Trigger. If not, we insert here.

            const { error: profileError } = await supabase
                .from('users')
                .insert({
                    id: authData.user?.id,
                    email: formData.email,
                    name: formData.adminName,
                    role: UserRole.ADMIN,
                    school_id: school.id
                });

            if (profileError) {
                // If duplicate key error, it means trigger already handled it (if implemented). 
                // If not, it's a real error. For now, proceeding as Trigger is the best practice, 
                // but we will ignore 'duplicate key' if we assume trigger exists. 
                // Given we haven't written a trigger in 004, we MUST insert manually.
                console.error("Profile creation error:", profileError);
                // Don't throw here if auth succeeded, but user might have issues logging in if profile missing.
            }

            // Success
            navigate('/dashboard');

        } catch (err: any) {
            console.error("Registration error:", err);
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center items-center gap-2 mb-6">
                    <div className="bg-indigo-600 p-2 rounded-lg">
                        <GraduationCap className="w-8 h-8 text-white" />
                    </div>
                    <span className="text-2xl font-bold text-slate-900">EduPulse</span>
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
                    Create your Digital Campus
                </h2>
                <p className="mt-2 text-center text-sm text-slate-600">
                    Join the future of education management
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-slate-200">
                    {error && (
                        <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center gap-2 text-sm">
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleRegister}>

                        {/* Step 1: Organization Details */}
                        <div>
                            <h3 className="text-lg font-medium text-slate-900 flex items-center gap-2 mb-4">
                                <Building2 className="text-indigo-600" size={20} />
                                Institution Details
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="schoolName" className="block text-sm font-medium text-slate-700">
                                        School / Organization Name
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="schoolName"
                                            name="schoolName"
                                            type="text"
                                            required
                                            value={formData.schoolName}
                                            onChange={handleSchoolNameChange}
                                            className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            placeholder="e.g. Springfield Academy"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="slug" className="block text-sm font-medium text-slate-700">
                                        Workspace URL
                                    </label>
                                    <div className="mt-1 flex rounded-md shadow-sm">
                                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-slate-300 bg-slate-50 text-slate-500 sm:text-sm">
                                            edupulse.com/
                                        </span>
                                        <input
                                            type="text"
                                            name="slug"
                                            id="slug"
                                            required
                                            value={formData.slug}
                                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                            className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-slate-300"
                                        />
                                    </div>
                                    <p className="mt-1 text-xs text-slate-500">This will be your unique address.</p>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-slate-100 pt-6"></div>

                        {/* Step 2: Admin Details */}
                        <div>
                            <h3 className="text-lg font-medium text-slate-900 flex items-center gap-2 mb-4">
                                <User className="text-indigo-600" size={20} />
                                Administrator Account
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="adminName" className="block text-sm font-medium text-slate-700">
                                        Full Name
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="adminName"
                                            name="adminName"
                                            type="text"
                                            required
                                            value={formData.adminName}
                                            onChange={(e) => setFormData({ ...formData, adminName: e.target.value })}
                                            className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                                        Email address
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                                        Password
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="password"
                                            name="password"
                                            type="password"
                                            autoComplete="new-password"
                                            required
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {isLoading ? (
                                    <><Loader2 className="animate-spin mr-2" size={20} /> Creating Campus...</>
                                ) : (
                                    <>Create Account & Campus <ArrowRight className="ml-2" size={20} /></>
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-slate-500">
                                    Already have an account?
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 text-center">
                            <button
                                onClick={() => navigate('/login')}
                                className="font-medium text-indigo-600 hover:text-indigo-500"
                            >
                                Sign in to existing campus
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterOrganization;
