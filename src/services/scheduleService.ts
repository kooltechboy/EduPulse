
import { supabase } from '@/lib/supabase';
import { ScheduleEntry, GradeLevel } from '@/types';

export const scheduleService = {
    async fetchAll(schoolId: string): Promise<ScheduleEntry[]> {
        const { data, error } = await supabase
            .from('schedule')
            .select('*')
            .eq('school_id', schoolId);

        if (error) {
            console.error('Error fetching schedule:', error);
            return [];
        }

        return (data || []).map(item => ({
            id: item.id,
            day: item.day,
            time: item.time,
            subject: item.subject,
            room: item.room,
            teacher: item.teacher_name,
            teacherId: item.teacher_id || 'TCH-000',
            grade: item.grade,
            gradeLevel: item.grade_level as GradeLevel,
            color: item.color || 'bg-blue-100 text-blue-700 border-blue-200'
        }));
    },

    async create(entry: Partial<ScheduleEntry>) {
        // Implementation for creating schedule entries
    }
};
