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
    let dbQuizzes = undefined;

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
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
                .select(
                    `
                    id,
                    class_id,
                    author_id,
                    title,
                    content,
                    date,
                    users (
                        name
                    )
                `,
                )
                .eq('class_id', courseId)
                .order('date', { ascending: false });

            if (discussions && discussions.length > 0) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const discussionIds = discussions.map((d: any) => d.id);
                const { data: replies } = await supabase
                    .from('discussion_replies')
                    .select(
                        `
                        id,
                        discussion_id,
                        author_id,
                        content,
                        date,
                        users (
                            name
                        )
                    `,
                    )
                    .in('discussion_id', discussionIds)
                    .order('date', { ascending: true });

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                dbDiscussions = discussions.map((d: any) => {
                    const discReplies = (replies || [])
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        .filter((r: any) => r.discussion_id === d.id)
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        .map((r: any) => ({
                            id: r.id,
                            authorName: r.users?.name || 'Ahmad Fauzi',
                            content: r.content,
                            date: r.date,
                        }));
                    return {
                        id: d.id,
                        courseId: d.class_id,
                        title: d.title,
                        content: d.content,
                        authorName: d.users?.name || 'Ahmad Fauzi',
                        repliesCount: discReplies.length,
                        date: d.date,
                        replies: discReplies,
                    };
                });
            } else {
                dbDiscussions = [];
            }

            // Fetch quizzes for this class
            const { data: quizzes } = await supabase
                .from('quizzes')
                .select(`
                    id,
                    title,
                    type,
                    duration_min,
                    open_at,
                    close_at,
                    is_published,
                    questions (
                        id,
                        content,
                        type,
                        order_no,
                        question_options (
                            id,
                            option_text,
                            is_correct
                        )
                    ),
                    quiz_attempts (
                        id,
                        student_id,
                        started_at,
                        submitted_at,
                        score,
                        answers
                    )
                `)
                .eq('class_id', courseId)
                .eq('is_published', true);

            if (quizzes) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                dbQuizzes = quizzes.map((q: any) => {
                    const studentAttempts = (q.quiz_attempts || [])
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        .filter((att: any) => att.student_id === authUser.id)
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        .map((att: any) => ({
                            id: att.id,
                            startedAt: att.started_at,
                            submittedAt: att.submitted_at,
                            score: att.score,
                            answers: att.answers
                        }));

                    return {
                        id: q.id,
                        title: q.title,
                        type: q.type,
                        durationMin: q.duration_min,
                        openAt: q.open_at,
                        closeAt: q.close_at,
                        isPublished: q.is_published,
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        questions: (q.questions || []).map((qst: any) => ({
                            id: qst.id,
                            content: qst.content,
                            type: qst.type,
                            orderNo: qst.order_no,
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            options: (qst.question_options || []).map((opt: any) => ({
                                id: opt.id,
                                optionText: opt.option_text,
                                isCorrect: opt.is_correct
                            }))
                        })),
                        attempts: studentAttempts
                    };
                });
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
                dbQuizzes={dbQuizzes}
            />
        </Suspense>
    );
}
