
import { supabase } from '@/lib/supabase';
import { Student, StudentLifecycleStatus, GradeLevel } from '@/types';

export const studentService = {
    async fetchAll(schoolId: string): Promise<Student[]> {
        const { data, error } = await supabase
            .from('students')
            .select('*')
            .eq('school_id', schoolId)
            .order('name', { ascending: true });

        if (error) {
            console.error('Error fetching students:', error);
            return [];
        }

        return (data || []).map((s: any) => ({
            id: s.id,
            name: s.name,
            email: s.email,
            gradeLevel: s.grade_level as GradeLevel,
            grade: s.grade,
            gpa: s.gpa || 0,
            status: s.status || 'Active',
            lifecycleStatus: s.lifecycle_status as StudentLifecycleStatus,
            gender: s.gender,
            dob: s.dob,
            enrollmentDate: s.enrollment_date,
            attendance: s.attendance || 0,
            balanceOwed: s.balance_owed || 0,
            documents: [],
            parentPhone: s.parent_phone,
            fatherName: s.father_name,
            motherName: s.mother_name
        }));
    },

    async create(student: Partial<Student>, schoolId: string): Promise<Student | null> {
        const { data, error } = await supabase
            .from('students')
            .insert([{
                school_id: schoolId,
                name: student.name,
                email: student.email,
                grade_level: student.gradeLevel,
                grade: student.grade,
                lifecycle_status: student.lifecycleStatus || StudentLifecycleStatus.ENROLLED,
                status: 'Active',
                enrollment_date: new Date().toISOString().split('T')[0]
            }])
            .select()
            .single();

        if (error) {
            console.error('Error creating student:', error);
            throw error;
        }
        return data;
    }
};
