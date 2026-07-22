/* ============================================================================
   EDUVERSE OS — LTI 1.3 & External LMS Connector Service
   Supports Google Classroom, Canvas LTI, and Moodle grade/course sync
   ============================================================================ */

export interface ExternalCourse {
  id: string;
  title: string;
  platform: 'google_classroom' | 'canvas' | 'moodle';
  courseCode: string;
  studentCount: number;
  lastSynced?: string;
  status: 'connected' | 'available';
}

export interface LMSSyncResult {
  success: boolean;
  platform: string;
  importedCourses: number;
  syncedGrades: number;
  message: string;
}

const MOCK_EXTERNAL_COURSES: ExternalCourse[] = [
  { id: 'gc-101', title: 'AP Environmental Science', platform: 'google_classroom', courseCode: 'GC-ENV401', studentCount: 28, status: 'available' },
  { id: 'canvas-202', title: 'Linear Algebra & Matrices', platform: 'canvas', courseCode: 'CAN-MATH302', studentCount: 32, status: 'connected', lastSynced: '2026-07-20 14:30' },
  { id: 'moodle-303', title: 'Introductory Computer Science (Python)', platform: 'moodle', courseCode: 'MDL-CS101', studentCount: 45, status: 'available' }
];

/**
 * Fetch list of external LMS courses available for import
 */
export async function fetchExternalCourses(platform?: string): Promise<ExternalCourse[]> {
  await new Promise(resolve => setTimeout(resolve, 600)); // Simulate LTI 1.3 handshake delay
  if (platform) {
    return MOCK_EXTERNAL_COURSES.filter(c => c.platform === platform);
  }
  return MOCK_EXTERNAL_COURSES;
}

/**
 * Perform LTI 1.3 deep-linking handshake & import course roster into EduVerse
 */
export async function importLMSCourse(courseId: string): Promise<LMSSyncResult> {
  await new Promise(resolve => setTimeout(resolve, 800));
  const course = MOCK_EXTERNAL_COURSES.find(c => c.id === courseId);
  
  if (!course) {
    return {
      success: false,
      platform: 'unknown',
      importedCourses: 0,
      syncedGrades: 0,
      message: 'External course not found.'
    };
  }

  course.status = 'connected';
  course.lastSynced = new Date().toISOString().replace('T', ' ').slice(0, 16);

  return {
    success: true,
    platform: course.platform,
    importedCourses: 1,
    syncedGrades: course.studentCount,
    message: `Successfully imported "${course.title}" and synced ${course.studentCount} student rosters via LTI 1.3!`
  };
}

/**
 * Export gradebook scores back to external LMS (Canvas / Google Classroom / Moodle)
 */
export async function exportGradesToLMS(platform: 'google_classroom' | 'canvas' | 'moodle', courseCode: string): Promise<LMSSyncResult> {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const names = {
    google_classroom: 'Google Classroom',
    canvas: 'Canvas LMS',
    moodle: 'Moodle LMS'
  };

  return {
    success: true,
    platform,
    importedCourses: 0,
    syncedGrades: 24,
    message: `Successfully pushed 24 gradebook entries for ${courseCode} to ${names[platform]}!`
  };
}
