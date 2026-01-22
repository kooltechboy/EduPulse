import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { School } from '@/types';
import { Users, Building, Shield, ArrowUpCircle } from 'lucide-react';

const SuperAdminView: React.FC = () => {
    const [schools, setSchools] = useState<School[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadSchools = async () => {
        setIsLoading(true);
        // This query requires the "Super admins can see all schools" RLS policy
        const { data, error } = await supabase
            .from('schools')
            .select('*')
            .order('created_at', { ascending: false });

        if (data) setSchools(data as any[]); // Type assertion for now as DB types might differ slightly
        setIsLoading(false);
    };

    useEffect(() => {
        loadSchools();
    }, []);

    const updatePlan = async (schoolId: string, newPlan: string) => {
        const { error } = await supabase
            .from('schools')
            .update({ subscription_plan: newPlan })
            .eq('id', schoolId);

        if (!error) {
            loadSchools(); // Refresh
        } else {
            console.error("Failed to update plan", error);
            alert("Failed to update plan");
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Super Admin Core</h1>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-2">Global Tenant Oversight</p>
                </div>
                <div className="flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-full border border-indigo-100 text-indigo-700 font-bold text-xs uppercase tracking-wider">
                    <Shield size={14} /> Root Access Active
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                    <h3 className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-2">Total Tenants</h3>
                    <p className="text-4xl font-black text-slate-900">{schools.length}</p>
                </div>
                {/* Placeholder stats */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                    <h3 className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-2">Active Sessions</h3>
                    <p className="text-4xl font-black text-emerald-600">842</p>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                    <h3 className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-2">Total Revenue (MRR)</h3>
                    <p className="text-4xl font-black text-blue-600">$12.4k</p>
                </div>
            </div>

            <div className="bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-xl shadow-slate-200/50">
                <div className="px-8 py-6 border-b border-slate-100 flex items-center gap-3">
                    <Building size={20} className="text-slate-400" />
                    <h3 className="font-bold text-slate-900">Registered Campuses</h3>
                </div>

                <table className="w-full text-left">
                    <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <tr>
                            <th className="px-8 py-4">School Name</th>
                            <th className="px-8 py-4">Slug / Domain</th>
                            <th className="px-8 py-4">Subscription Plan</th>
                            <th className="px-8 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {schools.map(school => (
                            <tr key={school.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-8 py-4 font-bold text-slate-700">{school.name}</td>
                                <td className="px-8 py-4 text-sm text-slate-500 font-mono">{school.slug}</td>
                                <td className="px-8 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wider
                                        ${school.subscriptionPlan === 'enterprise' ? 'bg-indigo-100 text-indigo-800' :
                                            school.subscriptionPlan === 'premium' ? 'bg-purple-100 text-purple-800' :
                                                school.subscriptionPlan === 'basic' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-slate-100 text-slate-800'}`}>
                                        {school.subscriptionPlan}
                                    </span>
                                </td>
                                <td className="px-8 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <select
                                            value={school.subscriptionPlan}
                                            onChange={(e) => updatePlan(school.id, e.target.value)}
                                            className="bg-white border border-slate-200 rounded-lg text-xs font-bold py-1 px-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                        >
                                            <option value="free">Free</option>
                                            <option value="basic">Basic</option>
                                            <option value="premium">Premium</option>
                                            <option value="enterprise">Enterprise</option>
                                        </select>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {schools.length === 0 && !isLoading && (
                    <div className="p-12 text-center text-slate-400 font-medium">No schools found (or insufficient permissions).</div>
                )}
            </div>
        </div>
    );
};

export default SuperAdminView;
