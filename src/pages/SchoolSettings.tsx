import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Save, Building2, Globe, Palette, Loader2 } from 'lucide-react';

const SchoolSettings: React.FC = () => {
    const { user, school: currentSchool } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        domain: '',
        primaryColor: '#4F46E5',
    });

    useEffect(() => {
        if (currentSchool) {
            setFormData({
                name: currentSchool.name || '',
                slug: currentSchool.slug || '',
                domain: currentSchool.domain || '',
                primaryColor: '#4F46E5', // Default if not found in specific settings yet
            });
        }
    }, [currentSchool]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.schoolId) return;

        setIsLoading(true);
        setMessage(null);

        try {
            const { error } = await supabase
                .from('schools')
                .update({
                    name: formData.name,
                    domain: formData.domain,
                    // Slug is usually immutable after creation to prevent URL breakage, 
                    // but we allow editing here for simplicity or strictly controlled updates.
                    updated_at: new Date().toISOString()
                })
                .eq('id', user.schoolId);

            if (error) throw error;

            setMessage({ type: 'success', text: 'School settings updated successfully.' });
            // Ideally, we should also update the local auth context school state here 
            // via a refresh method, or prompt a reload.
            setTimeout(() => window.location.reload(), 1500);

        } catch (err: any) {
            console.error('Error updating school:', err);
            setMessage({ type: 'error', text: err.message || 'Failed to update settings.' });
        } finally {
            setIsLoading(false);
        }
    };

    if (!currentSchool) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            <header>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">School Settings</h1>
                <p className="text-slate-500 mt-2">Manage your institution's profile and preferences.</p>
            </header>

            <form onSubmit={handleSave} className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-8 relative overflow-hidden">
                {isLoading && (
                    <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center cursor-not-allowed"></div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* General Info */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 text-slate-900 font-bold border-b border-slate-100 pb-2">
                            <Building2 size={20} className="text-blue-600" />
                            <h2>General Information</h2>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">School Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Unique Slug (Identifier)</label>
                            <input
                                type="text"
                                value={formData.slug}
                                disabled
                                className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 font-semibold text-slate-400 cursor-not-allowed"
                                title="Contact support to change your school's unique identifier."
                            />
                        </div>
                    </div>

                    {/* Branding & Technical */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 text-slate-900 font-bold border-b border-slate-100 pb-2">
                            <Globe size={20} className="text-emerald-600" />
                            <h2>Online Presence</h2>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Custom Domain</label>
                            <input
                                type="text"
                                value={formData.domain}
                                onChange={e => setFormData({ ...formData, domain: e.target.value })}
                                placeholder="e.g. academy.edu"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            />
                        </div>

                        <div className="space-y-2 opacity-50 pointer-events-none" title="Coming soon">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Theme Primary Color</label>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-indigo-600 border-2 border-white shadow-lg ring-2 ring-indigo-100"></div>
                                <span className="text-sm font-medium text-slate-400">Theme customization is locked to Enterprise plan.</span>
                            </div>
                        </div>
                    </div>
                </div>

                {message && (
                    <div className={`p-4 rounded-xl text-sm font-bold flex items-center gap-2 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                        {message.type === 'success' ? <Save size={16} /> : <Loader2 size={16} className="animate-spin" />}
                        {message.text}
                    </div>
                )}

                <div className="pt-6 border-t border-slate-100 flex justify-end">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-900/20 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SchoolSettings;
