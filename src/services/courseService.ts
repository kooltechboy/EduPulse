import { supabase } from '@/lib/supabase';
import { Course, GradeLevel } from '@/types';

export interface SupabaseCourse {
    id: string;
    name: string;
    code: string;
    teacher_id: string;
    teacher_name: string;
    grade_level: string;
    room: string;
    department: string;
    semester: string;
    banner_color: string;
    students: string[];
    created_at: string;
    updated_at: string;
}

// Convert Supabase row to Course type
const toCourse = (row: SupabaseCourse): Course => ({
    id: row.id,
    name: row.name,
    code: row.code,
    teacherId: row.teacher_id,
    teacherName: row.teacher_name,
    gradeLevel: row.grade_level as GradeLevel,
    room: row.room,
    department: row.department,
    semester: row.semester,
    bannerColor: row.banner_color,
    students: row.students || [],
    modules: [],
    liveSessions: [],
    materials: []
});

// Convert Course to Supabase row
const toSupabaseRow = (course: Partial<Course>) => ({
    name: course.name,
    code: course.code,
    teacher_id: course.teacherId,
    teacher_name: course.teacherName,
    grade_level: course.gradeLevel,
    room: course.room,
    department: course.department,
    semester: course.semester,
    banner_color: course.bannerColor,
    students: course.students || []
});

export const courseService = {
    /**
     * Fetch all courses from Supabase
     */
    async fetchAll(schoolId: string): Promise<Course[]> {
        const { data, error } = await supabase
            .from('courses')
            .select('*')
            .eq('school_id', schoolId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching courses:', error);
            // Fallback to localStorage
            const saved = localStorage.getItem('edupulse_courses_registry');
            return saved ? JSON.parse(saved) : [];
        }

        return (data || []).map(toCourse);
    },

    /**
     * Create a new course
     */
    async create(course: Partial<Course>, schoolId: string): Promise<Course | null> {
        const { data, error } = await supabase
            .from('courses')
            .insert({
                ...toSupabaseRow(course),
                school_id: schoolId
            })
            .select()
            .single();

        if (error) {
            console.error('Error creating course:', error);
            return null;
        }

        return toCourse(data);
    },

    /**
     * Update an existing course
     */
    async update(id: string, updates: Partial<Course>): Promise<Course | null> {
        const { data, error } = await supabase
            .from('courses')
            .update({ ...toSupabaseRow(updates), updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating course:', error);
            return null;
        }

        return toCourse(data);
    },

    /**
     * Delete a course
     */
    async delete(id: string): Promise<boolean> {
        const { error } = await supabase
            .from('courses')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting course:', error);
            return false;
        }

        return true;
    },

    /**
     * Sync localStorage to Supabase (for migration)
     */
    async syncFromLocalStorage(): Promise<void> {
        const saved = localStorage.getItem('edupulse_courses_registry');
        if (!saved) return;

        const localCourses: Course[] = JSON.parse(saved);

        for (const course of localCourses) {
            await this.create(course);
        }

        console.log(`Synced ${localCourses.length} courses to Supabase`);
    }
};
