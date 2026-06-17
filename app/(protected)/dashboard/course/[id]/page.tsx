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
    let dbDiscussions = undefined;

    if (authUser) {
        try {
            // Fetch class and course details
            const { data: clsData } = await supabase
                .from('classes')
                .select(
                    `
                    id,
                    class_name,
                    semester,
                    status,
                    day_of_week,
                    start_time,
                    end_time,
                    room,
                    courses (
                        id,
                        name,
                        code,
                        sks,
                        teori,
                        praktek,
                        kelompok_mk,
                        description
                    ),
                    users (
                        name
                    )
                `,
                )
                .eq('id', courseId)
                .single();

            if (clsData) {
                const cls = clsData as any;
                const c = Array.isArray(cls.courses)
                    ? cls.courses[0]
                    : cls.courses;
                const u = Array.isArray(cls.users) ? cls.users[0] : cls.users;
                dbCourse = {
                    id: cls.id,
                    name: c?.name || '',
                    code: c?.code || '',
                    class_name: cls.class_name,
                    semester: cls.semester,
                    sks: c?.sks || 0,
                    teori: c?.teori || 0,
                    praktek: c?.praktek || 0,
                    kelompok_mk: c?.kelompok_mk || 'Wajib Program Studi',
                    day_of_week: cls.day_of_week || 'Senin',
                    start_time: cls.start_time || '08:00:00',
                    end_time: cls.end_time || '10:30:00',
                    room: cls.room || 'Ruang H.4.1',
                    lecturer: u?.name || 'Dr. Budi Santoso',
                    description: c?.description || '',
                    status: cls.status,
                };
            }

            // Fetch modules for this class
            const { data: modules } = await supabase
                .from('modules')
                .select('*')
                .eq('class_id', courseId)
                .order('week_no', { ascending: true });

            if (modules) {
                dbModules = modules.map((m: any) => ({
                    id: m.id,
                    courseId: m.class_id,
                    title: m.title,
                    weekNo: m.week_no,
                    type: m.type,
                    contentUrl: m.content_url,
                    description: m.description,
                    isPublished: m.is_published,
                }));
            }

            // Fetch assignments for this class
            const { data: assignments } = await supabase
                .from('assignments')
                .select('*')
                .eq('class_id', courseId);

            if (assignments) {
                dbAssignments = assignments.map((a: any) => ({
                    id: a.id,
                    courseId: a.class_id,
                    title: a.title,
                    description: a.description,
                    deadline: a.deadline,
                    weightPct: a.weight_pct,
                    allowedFormats: a.allowed_formats,
                    maxSizeMb: a.max_size_mb,
                }));
            }

            // Fetch submissions for this student and class
            const { data: submissions } = await supabase
                .from('submissions')
                .select('*, assignments!inner(class_id)')
                .eq('student_id', authUser.id)
                .eq('assignments.class_id', courseId);

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
            // Fetch discussions for this class
            const { data: discussions } = await supabase
                .from('discussions')
                .select('*')
                .eq('class_id', courseId)
                .order('created_at', { ascending: false });

            if (discussions) {
                dbDiscussions = discussions.map((d: any) => ({
                    id: d.id,
                    courseId: d.class_id,
                    title: d.title,
                    content: d.content,
                    authorName: d.author_name,
                    repliesCount: d.replies_count || 0,
                    date: d.created_at,
                    replies: d.replies || [],
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
                dbDiscussions={dbDiscussions}
            />
        </Suspense>
    );
}
