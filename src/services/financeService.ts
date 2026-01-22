
import { supabase } from '@/lib/supabase';
import { FinancialTransaction, Invoice } from '@/types';

export const financeService = {
    async fetchTransactions(schoolId: string): Promise<FinancialTransaction[]> {
        const { data, error } = await supabase
            .from('transactions')
            .select('*')
            .eq('school_id', schoolId)
            .order('date', { ascending: false });

        if (error) {
            console.error('Error fetching transactions:', error);
            return [];
        }

        return data.map((t: any) => ({
            id: t.id,
            date: t.date,
            type: t.type,
            category: t.category,
            accountCode: t.account_code,
            amount: t.amount,
            description: t.description,
            entityName: t.entity_name,
            status: t.status,
            method: t.method
        }));
    },

    async fetchInvoices(schoolId: string): Promise<Invoice[]> {
        const { data, error } = await supabase
            .from('invoices')
            .select('*')
            .eq('school_id', schoolId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching invoices:', error);
            return [];
        }

        return data.map((i: any) => ({
            id: i.id,
            studentId: i.student_id,
            studentName: i.student_name,
            amount: i.amount,
            dueDate: i.due_date,
            status: i.status,
            category: i.category
        }));
    },

    async createInvoice(invoice: Partial<Invoice>) {
        // implementation
    }
};
