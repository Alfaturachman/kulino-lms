import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import CourseDetailClient from './CourseDetailClient';

export default async function CourseDetailPage(props: {
    params: Promise<{ id: string }>;
}) {
    const params = await props.params;
    const courseId = params.id;

    const supabase = await createClient();
    const {
        data: { user: authUser },
    } = await supabase.auth.getUser();

    let dbCourse = undefined;
    let dbModules = undefined;
    let dbAssignments = undefined;
    let dbSubmissions = undefined;

    if (authUser) {
        try {
            // Fetch course details
            const { data: course } = await supabase
                .from('courses')
                .select('*, users(name)')
                .eq('id', courseId)
                .single();

            if (course) {
                dbCourse = {
                    id: course.id,
                    name: course.name,
                    code: course.code,
                    class_name: course.class_name,
                    semester: course.semester,
                    sks: course.sks,
                    lecturer: course.users?.name || 'Dr. Budi Santoso',
                    description: course.description,
                    status: course.status,
                };
            }

            // Fetch modules for this course
            const { data: modules } = await supabase
                .from('modules')
                .select('*')
                .eq('course_id', courseId)
                .order('week_no', { ascending: true });

            if (modules) {
                dbModules = modules.map((m: any) => ({
                    id: m.id,
                    courseId: m.course_id,
                    title: m.title,
                    weekNo: m.week_no,
                    type: m.type,
                    contentUrl: m.content_url,
                    description: m.description,
                    isPublished: m.is_published,
                }));
            }

            // Fetch assignments for this course
            const { data: assignments } = await supabase
                .from('assignments')
                .select('*')
                .eq('course_id', courseId);

            if (assignments) {
                dbAssignments = assignments.map((a: any) => ({
                    id: a.id,
                    courseId: a.course_id,
                    title: a.title,
                    description: a.description,
                    deadline: a.deadline,
                    weightPct: a.weight_pct,
                    allowedFormats: a.allowed_formats,
                    maxSizeMb: a.max_size_mb,
                }));
            }

            // Fetch submissions for this student and course
            const { data: submissions } = await supabase
                .from('submissions')
                .select('*, assignments!inner(course_id)')
                .eq('student_id', authUser.id)
                .eq('assignments.course_id', courseId);

            if (submissions) {
                dbSubmissions = submissions.map((s: any) => ({
                    id: s.id,
                    assignmentId: s.assignment_id,
                    studentId: s.student_id,
                    fileUrl: s.file_url,
                    submittedAt: s.submitted_at,
                    isLate: s.is_late,
                    version: s.version,
                    grade: s.grade,
                    feedback: s.feedback,
                    gradedAt: s.graded_at,
                }));
            }
        } catch (err) {
            console.error(
                'Gagal mengambil data detail course dari Supabase:',
                err,
            );
        }
    }

    return (
        <Suspense
            fallback={
                <div className="flex h-[50vh] items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-iris-500 border-t-transparent"></div>
                </div>
            }
        >
            <CourseDetailClient
                courseId={courseId}
                dbCourse={dbCourse}
                dbModules={dbModules}
                dbAssignments={dbAssignments}
                dbSubmissions={dbSubmissions}
            />
        </Suspense>
    );
}
