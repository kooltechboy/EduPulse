
import { supabase } from '@/lib/supabase';
import { AdmissionsCandidate, Invoice } from '@/types';

export const dashboardService = {
    async getFinancialMetrics() {
        // In a real app, use Supabase aggregation or RPC
        // For now, fetch all invoices and calc client-side to keep it simple without custom Postgres functions
        const { data } = await supabase.from('invoices').select('amount, status');

        const revenue = (data || [])
            .filter(i => i.status === 'Paid')
            .reduce((sum, i) => sum + i.amount, 0);

        const pending = (data || [])
            .filter(i => i.status !== 'Paid')
            .reduce((sum, i) => sum + i.amount, 0);

        return { revenue, pending };
    },

    async getAdmissionsQueue(): Promise<AdmissionsCandidate[]> {
        const { data } = await supabase
            .from('admissions_candidates')
            .select('*')
            .order('date_applied', { ascending: false })
            .limit(5); // Recent ones

        return (data || []).map(d => ({
            ...d,
            appliedGrade: d.applied_grade,
            dateApplied: d.date_applied,
            parentName: d.parent_name,
            sentimentScore: d.sentiment_score
        }));
    },

    async getQuickStats() {
        // Parallel fetch for counts
        const [students, staff, candidates] = await Promise.all([
            supabase.from('students').select('id', { count: 'exact', head: true }),
            supabase.from('users').select('id', { count: 'exact', head: true }).eq('role', 'TEACHER'), // Assuming users table has role
            supabase.from('admissions_candidates').select('id', { count: 'exact', head: true })
        ]);

        return {
            totalStudents: students.count || 0,
            activeFaculty: staff.count || 0,
            enrollmentQueue: candidates.count || 0
        };
    }
};
