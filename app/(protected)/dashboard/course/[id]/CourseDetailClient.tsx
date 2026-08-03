'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/store/auth';
import type { Submission, Discussion } from '@/types/academic';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
    ArrowLeft,
    Video,
    FileText,
    Link2,
    ExternalLink,
    Download,
    Calendar,
    CheckCircle2,
    AlertCircle,
    MessageSquare,
    Send,
    PlusCircle,
    User,
    GraduationCap,
    ChevronDown,
    ChevronUp,
    Clock,
    MapPin,
    Layers,
    BookOpen,
} from 'lucide-react';

interface CourseDetailClientProps {
    courseId: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dbCourse?: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dbModules?: any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dbAssignments?: any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dbSubmissions?: any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dbDiscussions?: any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dbQuizzes?: any[];
}

const getNextSubId = () => `SUB-${Date.now()}`;
const getNextDiscussionId = () => `DIS-${Date.now()}`;
const getNextReplyId = () => `RPY-${Date.now()}`;

const isVirtualMeetingUrl = (url: string) => {
    if (!url) return false;
    const u = url.toLowerCase();
    return u.includes('meet.google.com') || 
           u.includes('zoom.us') || 
           u.includes('meet.jit.si') || 
           u.includes('webex.com') || 
           u.includes('teams.microsoft.com');
};

const mockQuizzes = [
  {
    id: 'quiz-1',
    title: 'Kuis Evaluasi 1: Konsep Dasar HTML & CSS',
    type: 'quiz',
    durationMin: 15,
    // eslint-disable-next-line react-hooks/purity
    openAt: new Date(Date.now() - 3600000).toISOString(),
    // eslint-disable-next-line react-hooks/purity
    closeAt: new Date(Date.now() + 86400000).toISOString(),
    isPublished: true,
    questions: [
      {
        id: 'q1',
        content: 'Manakah tag HTML yang benar untuk membuat heading tingkat pertama?',
        type: 'mcq',
        orderNo: 1,
        options: [
          { id: 'q1-o1', optionText: '<heading>', isCorrect: false },
          { id: 'q1-o2', optionText: '<h6>', isCorrect: false },
          { id: 'q1-o3', optionText: '<h1>', isCorrect: true },
          { id: 'q1-o4', optionText: '<head>', isCorrect: false }
        ]
      },
      {
        id: 'q2',
        content: 'Properti CSS apa yang digunakan untuk mengubah warna teks dari sebuah elemen?',
        type: 'mcq',
        orderNo: 2,
        options: [
          { id: 'q2-o1', optionText: 'text-color', isCorrect: false },
          { id: 'q2-o2', optionText: 'color', isCorrect: true },
          { id: 'q2-o3', optionText: 'font-color', isCorrect: false },
          { id: 'q2-o4', optionText: 'fgcolor', isCorrect: false }
        ]
      },
      {
        id: 'q3',
        content: 'Bagaimana cara menambahkan komentar dalam file CSS?',
        type: 'mcq',
        orderNo: 3,
        options: [
          { id: 'q3-o1', optionText: '// ini komentar', isCorrect: false },
          { id: 'q3-o2', optionText: '/* ini komentar */', isCorrect: true },
          { id: 'q3-o3', optionText: '\' ini komentar', isCorrect: false },
          { id: 'q3-o4', optionText: '<!-- ini komentar -->', isCorrect: false }
        ]
      }
    ],
    attempts: []
  }
];

export default function CourseDetailClient({
    courseId,
    dbCourse,
    dbModules,
    dbAssignments,
    dbSubmissions,
    dbDiscussions,
    dbQuizzes,
}: CourseDetailClientProps) {
    const router = useRouter();
    const course = dbCourse || null;
    const { user } = useAuthStore();
    const supabase = createClient();
    const isSupabaseConfigured =
        !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
        process.env.NEXT_PUBLIC_SUPABASE_URL.startsWith('http');

    // States
    const [activeSubTab, setActiveSubTab] = useState<
        'materi' | 'tugas' | 'kuis' | 'diskusi' | 'nilai'
    >('materi');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [quizzesList, setQuizzesList] = useState<any[]>(
        dbQuizzes || mockQuizzes
    );
    const [activeQuizId, setActiveQuizId] = useState<string | null>(null);
    const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
    const [quizTimeRemaining, setQuizTimeRemaining] = useState<number>(0);
    const [quizWarnings, setQuizWarnings] = useState<number>(0);
    const [isSubmittingQuiz, setIsSubmittingQuiz] = useState<boolean>(false);
    const [expandedWeeks, setExpandedWeeks] = useState<Record<number, boolean>>(
        {
            1: true,
            2: true,
            3: false,
            4: false,
        },
    );

    // Selected assignment for view / upload
    const [selectedAsmId, setSelectedAsmId] = useState<string | null>(null);
    const [uploadFile, setUploadFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [submissionsList, setSubmissionsList] = useState<Submission[]>(
        dbSubmissions || [],
    );

    // Discussions
    const [discussions, setDiscussions] = useState<Discussion[]>(
        dbDiscussions || [],
    );
    const [newDiscussionTitle, setNewDiscussionTitle] = useState('');
    const [newDiscussionContent, setNewDiscussionContent] = useState('');
    const [showAddDiscussion, setShowAddDiscussion] = useState(false);
    const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});



    const submitQuizResults = async (quizId: string, isAuto: boolean) => {
        setIsSubmittingQuiz(true);
        const quizObj = quizzesList.find(q => q.id === quizId);
        if (!quizObj) return;

        let correctCount = 0;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        quizObj.questions.forEach((q: any) => {
            const selectedOptId = quizAnswers[q.id];
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const correctOpt = q.options?.find((opt: any) => opt.isCorrect);
            if (selectedOptId && correctOpt && selectedOptId === correctOpt.id) {
                correctCount++;
            }
        });

        const score = parseFloat(((correctCount / quizObj.questions.length) * 100).toFixed(2));
        const startedKey = `quiz_start_${quizId}_${user?.id || 'guest'}`;
        // eslint-disable-next-line react-hooks/purity
        const startedAtStr = localStorage.getItem(startedKey) || Date.now().toString();
        const startedAt = new Date(parseInt(startedAtStr)).toISOString();
        const submittedAt = new Date().toISOString();

        if (isSupabaseConfigured && user) {
            try {
                const { data, error } = await supabase
                    .from('quiz_attempts')
                    .insert({
                        quiz_id: quizId,
                        student_id: user.id,
                        started_at: startedAt,
                        submitted_at: submittedAt,
                        score: score,
                        answers: quizAnswers
                    })
                    .select()
                    .single();

                if (error) throw error;

                setQuizzesList(prev => prev.map(q => {
                    if (q.id === quizId) {
                        return {
                            ...q,
                            attempts: [
                                ...(q.attempts || []),
                                {
                                    id: data.id,
                                    startedAt: data.started_at,
                                    submittedAt: data.submitted_at,
                                    score: data.score,
                                    answers: data.answers
                                }
                            ]
                        };
                    }
                    return q;
                }));
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (err: any) {
                alert('Gagal mengunggah hasil kuis: ' + err.message);
            }
        } else {
            const mockAttempt = {
                // eslint-disable-next-line react-hooks/purity
                id: `att-${Date.now()}`,
                startedAt,
                submittedAt,
                score,
                answers: quizAnswers
            };
            setQuizzesList(prev => prev.map(q => {
                if (q.id === quizId) {
                    return {
                        ...q,
                        attempts: [
                            ...(q.attempts || []),
                            mockAttempt
                        ]
                    };
                }
                return q;
            }));
        }

        localStorage.removeItem(startedKey);
        setActiveQuizId(null);
        setIsSubmittingQuiz(false);

        alert(`Ujian selesai! Skor Anda: ${score} / 100. ${quizWarnings > 0 ? `\nTercatat ${quizWarnings} kali indikasi keluar/berpindah tab.` : ''}`);
    };

    // CBT Timer countdown logic
    useEffect(() => {
        if (typeof window !== 'undefined') {
            quizzesList.forEach(q => {
                const key = `quiz_start_${q.id}_${user?.id || 'guest'}`;
                const start = localStorage.getItem(key);
                if (start) {
                    // eslint-disable-next-line react-hooks/purity
                    const elapsed = Math.floor((Date.now() - parseInt(start)) / 1000);
                    if (elapsed < q.durationMin * 60) {
                        setActiveQuizId(q.id);
                        setQuizTimeRemaining(q.durationMin * 60 - elapsed);
                    } else {
                        localStorage.removeItem(key);
                    }
                }
            });
        }
    }, [quizzesList, user]);

    // We'll write the active quiz timer in an effect
    useEffect(() => {
        if (!activeQuizId) return;
        const interval = setInterval(() => {
            const key = `quiz_start_${activeQuizId}_${user?.id || 'guest'}`;
            const start = localStorage.getItem(key);
            if (start) {
                // eslint-disable-next-line react-hooks/purity
                const elapsed = Math.floor((Date.now() - parseInt(start)) / 1000);
                const quizObj = quizzesList.find(q => q.id === activeQuizId);
                if (quizObj) {
                    const remaining = quizObj.durationMin * 60 - elapsed;
                    if (remaining <= 0) {
                        setQuizTimeRemaining(0);
                        clearInterval(interval);
                        submitQuizResults(activeQuizId, true);
                    } else {
                        setQuizTimeRemaining(remaining);
                    }
                }
            }
        }, 1000);
        return () => clearInterval(interval);
            // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeQuizId, quizzesList, user]);

    // Fraud check
    useEffect(() => {
        if (!activeQuizId) return;
        const handleVisibilityChange = () => {
            if (document.hidden) {
                setQuizWarnings((prev) => {
                    const newWarnings = prev + 1;
                    alert(`PERINGATAN KECURANGAN [Peringatan ${newWarnings}]: Dilarang berpindah tab browser selama ujian! Tindakan kecurangan akan dicatat dan dilaporkan.`);
                    return newWarnings;
                });
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [activeQuizId]);

    const handleStartQuiz = (quizId: string) => {
        const quizObj = quizzesList.find(q => q.id === quizId);
        if (!quizObj) return;

        const confirmStart = confirm(`Apakah Anda yakin ingin memulai kuis "${quizObj.title}"?\nWaktu pengerjaan: ${quizObj.durationMin} menit. Waktu akan terus berjalan meskipun halaman ditutup atau di-refresh.`);
        if (!confirmStart) return;

        setActiveQuizId(quizId);
        setQuizAnswers({});
        setQuizWarnings(0);
        setQuizTimeRemaining(quizObj.durationMin * 60);

        const key = `quiz_start_${quizId}_${user?.id || 'guest'}`;
        // eslint-disable-next-line react-hooks/purity
        localStorage.setItem(key, Date.now().toString());
    };

    const handleManualSubmitQuiz = (quizId: string) => {
        const confirmSubmit = confirm("Apakah Anda yakin ingin mengumpulkan kuis sekarang?");
        if (!confirmSubmit) return;
        submitQuizResults(quizId, false);
    };

    if (!course) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <AlertCircle size={48} className="text-danger mb-4" />
                <h2 className="text-xl font-bold text-ink">
                    Mata Kuliah Tidak Ditemukan
                </h2>
                <p className="text-muted mt-2">
                    ID mata kuliah &apos;{courseId}&apos; tidak terdaftar dalam
                    sistem KULINO.
                </p>
                <Link href="/dashboard" className="mt-6">
                    <Button>Kembali ke Dashboard</Button>
                </Link>
            </div>
        );
    }

    const courseAssignments = dbAssignments || [];

    const courseModules = dbModules || [];

    const toggleWeek = (weekNo: number) => {
        setExpandedWeeks((prev) => ({ ...prev, [weekNo]: !prev[weekNo] }));
    };

    // Handle mock submission file selection
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setUploadFile(e.target.files[0]);
        }
    };

    // Get download URL from Supabase Storage or fallback
    const getFileDownloadUrl = (path: string) => {
        if (!path) return '#';
        if (path.startsWith('http://') || path.startsWith('https://')) return path;
        if (isSupabaseConfigured) {
            const { data } = supabase.storage.from('submissions').getPublicUrl(path);
            return data?.publicUrl || '#';
        }
        return '#';
    };

    // Handle file upload to Supabase Storage and submit assignment
    const handleSubmitAssignment = async (assignmentId: string) => {
        if (!uploadFile) return;
        setUploading(true);
        setUploadProgress(10);

        for (let p = 20; p <= 100; p += 20) {
            await new Promise((r) => setTimeout(r, 100));
            setUploadProgress(p);
        }

        if (isSupabaseConfigured && user) {
            try {
                // Find existing submissions to decide version
                const existing = submissionsList.filter(
                    (sub) => sub.assignmentId === assignmentId && sub.studentId === user.id
                );
                const version = existing.length + 1;

                // Upload to Supabase Storage bucket 'submissions'
                let fileUrlPath = uploadFile.name;
                try {
                    const fileExt = uploadFile.name.split('.').pop();
                    // eslint-disable-next-line react-hooks/purity
                    const filePath = `${user.id}/${assignmentId}_v${version}_${Date.now()}.${fileExt}`;
                    
                    const { data: uploadData, error: uploadError } = await supabase.storage
                        .from('submissions')
                        .upload(filePath, uploadFile, {
                            cacheControl: '3600',
                            upsert: true
                        });
                        
                    if (uploadError) {
                        console.warn("Storage bucket 'submissions' mungkin belum diinisialisasi. Error:", uploadError.message);
                    } else if (uploadData) {
                        fileUrlPath = uploadData.path; // Simpan path storage
                    }
                } catch (storageErr) {
                    console.warn("Gagal unggah ke Supabase Storage, fallback ke nama berkas:", storageErr);
                }

                const { data, error } = await supabase
                    .from("submissions")
                    .insert({
                        assignment_id: assignmentId,
                        student_id: user.id,
                        file_url: fileUrlPath,
                        submitted_at: new Date().toISOString(),
                        is_late: false,
                        version: version,
                    })
                    .select()
                    .single();

                if (error) throw error;

                const newSub: Submission = {
                    id: data.id,
                    assignmentId,
                    studentId: user.id,
                    studentName: user.name || "Mahasiswa",
                    fileUrl: fileUrlPath,
                    submittedAt: data.submitted_at,
                    isLate: data.is_late,
                    version: data.version,
                };
                setSubmissionsList((prev) => [newSub, ...prev]);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (err: any) {
                alert("Gagal menyerahkan tugas: " + err.message);
                setUploading(false);
                return;
            }
        } else {
            const newSub: Submission = {
                id: getNextSubId(),
                assignmentId,
                studentId: 'STU-001',
                studentName: 'Ahmad Fauzi',
                fileUrl: uploadFile.name,
                submittedAt: new Date().toISOString(),
                isLate: false,
                version: 1,
            };
            setSubmissionsList((prev) => [newSub, ...prev]);
        }

        setUploading(false);
        setUploadFile(null);
        setUploadProgress(0);
    };

    // Add Discussion Thread
    const handleCreateDiscussion = async () => {
        if (!newDiscussionTitle || !newDiscussionContent) return;

        if (isSupabaseConfigured && user) {
            try {
                const { data, error } = await supabase
                    .from("discussions")
                    .insert({
                        class_id: courseId,
                        author_id: user.id,
                        title: newDiscussionTitle,
                        content: newDiscussionContent,
                        date: new Date().toISOString(),
                    })
                    .select()
                    .single();

                if (error) throw error;

                const newThread: Discussion = {
                    id: data.id,
                    courseId,
                    title: data.title,
                    content: data.content,
                    authorName: user.name || "Ahmad Fauzi",
                    repliesCount: 0,
                    date: data.date,
                    replies: [],
                };
                setDiscussions((prev) => [newThread, ...prev]);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (err: any) {
                alert("Gagal membuat diskusi: " + err.message);
                return;
            }
        } else {
            const newThread: Discussion = {
                id: getNextDiscussionId(),
                courseId,
                title: newDiscussionTitle,
                content: newDiscussionContent,
                authorName: 'Ahmad Fauzi',
                repliesCount: 0,
                date: new Date().toISOString(),
                replies: [],
            };
            setDiscussions((prev) => [newThread, ...prev]);
        }

        setNewDiscussionTitle('');
        setNewDiscussionContent('');
        setShowAddDiscussion(false);
    };

    // Add Discussion Reply
    const handleAddReply = async (discussionId: string) => {
        const replyText = replyInputs[discussionId];
        if (!replyText) return;

        if (isSupabaseConfigured && user) {
            try {
                const { data, error } = await supabase
                    .from("discussion_replies")
                    .insert({
                        discussion_id: discussionId,
                        author_id: user.id,
                        content: replyText,
                        date: new Date().toISOString(),
                    })
                    .select()
                    .single();

                if (error) throw error;

                setDiscussions((prev) =>
                    prev.map((disc) => {
                        if (disc.id === discussionId) {
                            return {
                                ...disc,
                                repliesCount: disc.repliesCount + 1,
                                replies: [
                                    ...disc.replies,
                                    {
                                        id: data.id,
                                        authorName: user.name || "Mahasiswa",
                                        content: replyText,
                                        date: data.date,
                                    },
                                ],
                            };
                        }
                        return disc;
                    })
                );
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (err: any) {
                alert("Gagal mengirim tanggapan: " + err.message);
                return;
            }
        } else {
            setDiscussions((prev) =>
                prev.map((disc) => {
                    if (disc.id === discussionId) {
                        return {
                            ...disc,
                            repliesCount: disc.repliesCount + 1,
                            replies: [
                                ...disc.replies,
                                {
                                    id: getNextReplyId(),
                                    authorName: 'Ahmad Fauzi',
                                    content: replyText,
                                    date: new Date().toISOString(),
                                },
                            ],
                        };
                    }
                    return disc;
                })
            );
        }

        setReplyInputs((prev) => ({ ...prev, [discussionId]: '' }));
    };

    return (
        <div className="space-y-6">
            {/* Back button and path */}
            <div className="flex items-center justify-between">
                <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 text-[13px] font-semibold text-muted hover:text-ink transition-colors cursor-pointer"
                >
                    <ArrowLeft size={16} /> Kembali ke Dashboard
                </Link>
                <span className="text-[11px] font-mono text-muted uppercase tracking-wider">
                    Kode MK: {course.code}
                </span>
            </div>

            {/* Course Header Banner */}
            <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 hover:shadow-xs transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-2">
                        <span className="inline-block rounded-full bg-iris-50 px-2.5 py-0.5 text-[11px] font-semibold text-iris-800">
                            {course.semester}
                        </span>
                        <h1 className="text-xl font-bold tracking-tight text-ink md:text-2xl">
                            {course.name}
                        </h1>
                        <p className="text-[13px] text-muted max-w-2xl leading-relaxed">
                            {course.description}
                        </p>
                    </div>
                    <div className="shrink-0 flex items-center gap-3">
                        <div className="text-center bg-surface2 border border-border px-4 py-2 rounded-xl">
                            <span className="block text-2xl font-bold text-iris-600">
                                {course.sks}
                            </span>
                            <span className="text-[10px] uppercase font-bold text-muted tracking-wider">
                                SKS
                            </span>
                        </div>
                        <div className="text-center bg-surface2 border border-border px-4 py-2 rounded-xl">
                            <span className="block text-2xl font-bold text-ink">
                                {course.class_name}
                            </span>
                            <span className="text-[10px] uppercase font-bold text-muted tracking-wider">
                                Kelas
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Grid: Left Tabs Content (70%) & Right Course Info (30%) */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Left Column (Main Tabs & Content) */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Sub Navigation Tabs */}
                    <div className="flex border-b border-border gap-1 overflow-x-auto pb-px">
                        {(
                            [
                                { id: 'materi', label: 'Materi Kuliah' },
                                { id: 'tugas', label: 'Tugas' },
                                { id: 'kuis', label: 'Kuis & CBT' },
                                { id: 'diskusi', label: 'Forum Diskusi' },
                                { id: 'nilai', label: 'Penilaian' },
                            ] as const
                        ).map((tab) => {
                            const isActive = activeSubTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveSubTab(tab.id)}
                                    className={`text-[13px] font-semibold px-4 py-2.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                                        isActive
                                            ? 'border-iris-500 text-iris-800'
                                            : 'border-transparent text-muted hover:text-ink hover:border-border'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* -------------------- TAB CONTENT: MATERI -------------------- */}
                    {activeSubTab === 'materi' && (
                        <div className="space-y-4">
                            <h2 className="text-[15px] font-bold text-ink">
                                Timeline Pembelajaran Mingguan
                            </h2>

                            <div className="space-y-3">
                                {Array.from({ length: 14 }).map((_, idx) => {
                                    const weekNo = idx + 1;
                                    const isExpanded = expandedWeeks[weekNo];
                                    const weekModules = courseModules.filter(
                                        (m) => m.weekNo === weekNo,
                                    );

                                    return (
                                        <Card
                                            key={weekNo}
                                            className="overflow-hidden"
                                        >
                                            {/* Week Accordion Header */}
                                            <button
                                                onClick={() =>
                                                    toggleWeek(weekNo)
                                                }
                                                className="flex w-full items-center justify-between p-4 bg-surface2/30 hover:bg-surface2/60 transition-colors cursor-pointer text-left"
                                            >
                                                <div>
                                                    <span className="text-[13px] font-bold text-ink">
                                                        Minggu ke-{weekNo}
                                                    </span>
                                                    <span className="text-[11px] text-muted block mt-0.5">
                                                        {weekNo === 8
                                                            ? 'Evaluasi Tengah Semester (UTS)'
                                                            : weekNo === 15
                                                              ? 'Evaluasi Akhir Semester (UAS)'
                                                              : `${weekModules.length} materi pembelajaran`}
                                                    </span>
                                                </div>
                                                {isExpanded ? (
                                                    <ChevronUp
                                                        size={16}
                                                        className="text-muted"
                                                    />
                                                ) : (
                                                    <ChevronDown
                                                        size={16}
                                                        className="text-muted"
                                                    />
                                                )}
                                            </button>

                                            {/* Week Accordion Content */}
                                            {isExpanded && (
                                                <div className="p-4 border-t border-border/50 bg-white space-y-4">
                                                    {/* 1. KELAS VIRTUAL (VIRTUAL MEETINGS) */}
                                                    {weekModules.filter(m => m.type === 'link' && isVirtualMeetingUrl(m.contentUrl)).length > 0 && (
                                                        <div className="space-y-2 pb-2 border-b border-border/40">
                                                            <h4 className="text-[11px] font-bold uppercase tracking-wider text-iris-600 flex items-center gap-1.5">
                                                                <span className="relative flex h-2 w-2">
                                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                                                </span>
                                                                Tatap Muka Daring (Live Class)
                                                            </h4>
                                                            {weekModules.filter(m => m.type === 'link' && isVirtualMeetingUrl(m.contentUrl)).map((mod) => (
                                                                <div key={mod.id} className="flex items-center justify-between bg-surface2/50 border border-iris-100 p-3 rounded-xl gap-3">
                                                                    <div className="flex items-start gap-2.5">
                                                                        <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                                                                            <Video size={18} />
                                                                        </div>
                                                                        <div>
                                                                            <h5 className="text-[12px] font-bold text-ink leading-tight">{mod.title}</h5>
                                                                            <p className="text-[10px] text-muted leading-tight mt-0.5">{mod.description || 'Kelas Tatap Muka Online'}</p>
                                                                        </div>
                                                                    </div>
                                                                    <a href={mod.contentUrl} target="_blank" rel="noopener noreferrer">
                                                                        <Button size="sm" className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] gap-1 shrink-0 shadow-sm cursor-pointer">
                                                                            Gabung Pertemuan <ExternalLink size={12} />
                                                                        </Button>
                                                                    </a>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {/* 2. BAHAN AJAR (ACADEMIC MATERIALS) */}
                                                    <div>
                                                        <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted mb-2">Bahan & Materi Pembelajaran</h4>
                                                        {weekModules.filter(m => !(m.type === 'link' && isVirtualMeetingUrl(m.contentUrl))).length > 0 ? (
                                                            <div className="divide-y divide-border/40">
                                                                {weekModules.filter(m => !(m.type === 'link' && isVirtualMeetingUrl(m.contentUrl))).map((mod) => (
                                                                    <div
                                                                        key={mod.id}
                                                                        className="py-3.5 first:pt-0 last:pb-0 space-y-2"
                                                                    >
                                                                        <div className="flex items-start justify-between gap-3">
                                                                            <div className="flex items-start gap-3">
                                                                                <div
                                                                                    className={`mt-0.5 p-1.5 rounded-lg shrink-0 ${
                                                                                        mod.type ===
                                                                                        'video'
                                                                                            ? 'bg-red-50 text-red-600'
                                                                                            : mod.type ===
                                                                                                'pdf'
                                                                                              ? 'bg-amber-50 text-amber-600'
                                                                                              : mod.type ===
                                                                                                  'ppt'
                                                                                                ? 'bg-orange-50 text-orange-600'
                                                                                                : 'bg-iris-50 text-iris-600'
                                                                                    }`}
                                                                                >
                                                                                    {mod.type ===
                                                                                    'video' ? (
                                                                                        <Video
                                                                                            size={
                                                                                                16
                                                                                            }
                                                                                        />
                                                                                    ) : mod.type ===
                                                                                      'pdf' ? (
                                                                                        <FileText
                                                                                            size={
                                                                                                16
                                                                                            }
                                                                                        />
                                                                                    ) : mod.type ===
                                                                                      'ppt' ? (
                                                                                        <FileText
                                                                                            size={
                                                                                                16
                                                                                            }
                                                                                        />
                                                                                    ) : (
                                                                                        <Link2
                                                                                            size={
                                                                                                16
                                                                                            }
                                                                                        />
                                                                                    )}
                                                                                </div>
                                                                                <div>
                                                                                    <h4 className="text-[13px] font-bold text-ink leading-snug">
                                                                                        {
                                                                                            mod.title
                                                                                        }
                                                                                    </h4>
                                                                                    <p className="text-[11px] text-muted leading-relaxed mt-0.5">
                                                                                        {
                                                                                            mod.description
                                                                                        }
                                                                                    </p>
                                                                                </div>
                                                                            </div>

                                                                            <a
                                                                                href={
                                                                                    mod.contentUrl
                                                                                }
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                            >
                                                                                <Button
                                                                                    variant="ghost"
                                                                                    size="sm"
                                                                                    className="h-8 text-muted gap-1 text-[11px] hover:text-ink"
                                                                                >
                                                                                    Buka{' '}
                                                                                    <ExternalLink
                                                                                        size={
                                                                                            12
                                                                                        }
                                                                                    />
                                                                                </Button>
                                                                            </a>
                                                                        </div>

                                                                        {/* Video Player Embed Preview for YouTube videos */}
                                                                        {mod.type ===
                                                                            'video' &&
                                                                            mod.contentUrl.includes(
                                                                                'youtube',
                                                                            ) && (
                                                                                <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-border mt-2 shadow-xs">
                                                                                    <iframe
                                                                                        src={
                                                                                            mod.contentUrl
                                                                                        }
                                                                                        title={
                                                                                            mod.title
                                                                                        }
                                                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                                                        allowFullScreen
                                                                                        className="absolute inset-0 size-full border-0"
                                                                                    ></iframe>
                                                                                </div>
                                                                            )}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <p className="text-center py-4 text-muted text-[12px]">
                                                                Belum ada materi pembelajaran untuk minggu ini.
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </Card>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* -------------------- TAB CONTENT: TUGAS -------------------- */}
                    {activeSubTab === 'tugas' && (
                        <div className="space-y-4">
                            <h2 className="text-[15px] font-bold text-ink">
                                Daftar Tugas Perkuliahan
                            </h2>

                            <div className="space-y-3">
                                {courseAssignments.length > 0 ? (
                                    courseAssignments.map((asm) => {
                                        const isSelected =
                                            selectedAsmId === asm.id;
                                        const submission = submissionsList.find(
                                            (sub) =>
                                                sub.assignmentId === asm.id &&
                                                (sub.studentId === 'STU-001' || sub.studentId === user?.id),
                                        );
                                        const hasSubmitted = !!submission;
                                        const dl = new Date(asm.deadline);

                                        return (
                                            <Card
                                                key={asm.id}
                                                className="overflow-hidden"
                                            >
                                                <div
                                                    onClick={() =>
                                                        setSelectedAsmId(
                                                            isSelected
                                                                ? null
                                                                : asm.id,
                                                        )
                                                    }
                                                    className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 cursor-pointer hover:bg-surface2/30 transition-colors"
                                                >
                                                    <div>
                                                        <h3 className="text-[13px] font-bold text-ink leading-snug">
                                                            {asm.title}
                                                        </h3>
                                                        <span className="text-[11px] text-muted flex items-center gap-1.5 mt-1">
                                                            <Calendar
                                                                size={12}
                                                            />
                                                            Deadline:{' '}
                                                            {dl.toLocaleDateString(
                                                                'id-ID',
                                                                {
                                                                    day: 'numeric',
                                                                    month: 'short',
                                                                    hour: '2-digit',
                                                                    minute: '2-digit',
                                                                },
                                                            )}{' '}
                                                            WIB
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center gap-2 self-start sm:self-center">
                                                        <span className="text-[10px] text-muted font-semibold bg-surface2 border border-border px-2 py-0.5 rounded-full">
                                                            Bobot{' '}
                                                            {asm.weightPct}%
                                                        </span>
                                                        {hasSubmitted ? (
                                                            <Badge variant="green">
                                                                Diserahkan
                                                            </Badge>
                                                        ) : (
                                                            <Badge variant="red">
                                                                Belum Dikumpul
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>

                                                {isSelected && (
                                                    <div className="p-5 border-t border-border bg-surface2/20 space-y-4">
                                                        <div className="text-[13px] text-ink2 leading-relaxed whitespace-pre-line bg-white border border-border/80 p-4 rounded-xl">
                                                            {asm.description}
                                                        </div>

                                                        {/* Details Table */}
                                                        <div className="grid grid-cols-2 gap-4 text-[12px] bg-surface2 p-3 rounded-lg border border-border">
                                                            <div>
                                                                <span className="text-muted block">
                                                                    Format File
                                                                </span>
                                                                <span className="font-semibold text-ink uppercase">
                                                                    {asm.allowedFormats.join(
                                                                        ', ',
                                                                    )}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <span className="text-muted block">
                                                                    Ukuran
                                                                    Maksimal
                                                                </span>
                                                                <span className="font-semibold text-ink">
                                                                    {
                                                                        asm.maxSizeMb
                                                                    }{' '}
                                                                    MB
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* Submit Form Area */}
                                                        <div className="border-t border-border/80 pt-4 space-y-3">
                                                            <h4 className="text-[12px] font-bold text-ink uppercase tracking-wider">
                                                                Status
                                                                Pengumpulan
                                                            </h4>

                                                            {hasSubmitted ? (
                                                                <div className="space-y-3">
                                                                    <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-100 p-4 rounded-xl text-emerald-800">
                                                                        <CheckCircle2
                                                                            size={
                                                                                18
                                                                            }
                                                                            className="text-success mt-0.5 shrink-0"
                                                                        />
                                                                        <div className="text-[13px]">
                                                                            <p className="font-bold">
                                                                                Tugas
                                                                                berhasil
                                                                                diserahkan
                                                                            </p>
                                                                            <p className="text-[11px] opacity-90 mt-0.5">
                                                                                File:{' '}
                                                                                <a
                                                                                    href={getFileDownloadUrl(submission.fileUrl)}
                                                                                    target="_blank"
                                                                                    rel="noopener noreferrer"
                                                                                    className="underline font-mono text-emerald-800 hover:text-emerald-950 hover:font-bold transition-all"
                                                                                >
                                                                                    {submission.fileUrl.split('/').pop()}
                                                                                </a>
                                                                            </p>
                                                                            <p className="text-[11px] opacity-90 mt-0.5">
                                                                                Tanggal:{' '}
                                                                                {new Date(
                                                                                    submission.submittedAt,
                                                                                ).toLocaleDateString(
                                                                                    'id-ID',
                                                                                    {
                                                                                        day: 'numeric',
                                                                                        month: 'long',
                                                                                        hour: '2-digit',
                                                                                        minute: '2-digit',
                                                                                    },
                                                                                )}{' '}
                                                                                WIB
                                                                            </p>
                                                                        </div>
                                                                    </div>

                                                                    {submission.grade !==
                                                                        undefined && (
                                                                        <div className="bg-iris-50/50 border border-iris-100 p-4 rounded-xl space-y-2">
                                                                            <div className="flex items-center justify-between">
                                                                                <span className="text-[12px] font-bold text-iris-800 flex items-center gap-1.5">
                                                                                    <GraduationCap
                                                                                        size={
                                                                                            16
                                                                                        }
                                                                                    />{' '}
                                                                                    Penilaian
                                                                                    Dosen
                                                                                </span>
                                                                                <span className="text-lg font-black text-iris-600">
                                                                                    {
                                                                                        submission.grade
                                                                                    }
                                                                                    /100
                                                                                </span>
                                                                            </div>
                                                                            {submission.feedback && (
                                                                                <p className="text-[12px] text-ink2 bg-white/60 p-2.5 rounded-lg border border-border">
                                                                                    &ldquo;
                                                                                    {
                                                                                        submission.feedback
                                                                                    }
                                                                                    &rdquo;
                                                                                </p>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ) : (
                                                                <div className="space-y-3">
                                                                    <div className="flex flex-col gap-1.5">
                                                                        <Label
                                                                            htmlFor={`file-${asm.id}`}
                                                                            className="text-[12px]"
                                                                        >
                                                                            Pilih
                                                                            File
                                                                            Tugas
                                                                        </Label>
                                                                        <Input
                                                                            id={`file-${asm.id}`}
                                                                            type="file"
                                                                            onChange={
                                                                                handleFileChange
                                                                            }
                                                                            disabled={
                                                                                uploading
                                                                            }
                                                                            className="bg-white"
                                                                        />
                                                                        {uploadFile && (
                                                                            <p className="text-[11px] text-muted">
                                                                                File
                                                                                terpilih:{' '}
                                                                                <span className="font-mono text-ink font-semibold">
                                                                                    {
                                                                                        uploadFile.name
                                                                                    }
                                                                                </span>{' '}
                                                                                (
                                                                                {(
                                                                                    uploadFile.size /
                                                                                    (1024 *
                                                                                        1024)
                                                                                ).toFixed(
                                                                                    2,
                                                                                )}{' '}
                                                                                MB)
                                                                            </p>
                                                                        )}
                                                                    </div>

                                                                    {uploading && (
                                                                        <div className="space-y-1.5">
                                                                            <div className="h-2 w-full bg-border rounded-full overflow-hidden">
                                                                                <div
                                                                                    className="h-full bg-iris-500 rounded-full transition-all duration-300"
                                                                                    style={{
                                                                                        width: `${uploadProgress}%`,
                                                                                    }}
                                                                                ></div>
                                                                            </div>
                                                                            <p className="text-[10px] text-center text-muted font-bold">
                                                                                Mengunggah...{' '}
                                                                                {
                                                                                    uploadProgress
                                                                                }
                                                                                %
                                                                            </p>
                                                                        </div>
                                                                    )}

                                                                    <Button
                                                                        onClick={() =>
                                                                            handleSubmitAssignment(
                                                                                asm.id,
                                                                            )
                                                                        }
                                                                        disabled={
                                                                            !uploadFile ||
                                                                            uploading
                                                                        }
                                                                        className="w-full sm:w-auto cursor-pointer"
                                                                    >
                                                                        Unggah &
                                                                        Serahkan
                                                                        Tugas
                                                                    </Button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </Card>
                                        );
                                    })
                                ) : (
                                    <div className="py-8 text-center text-muted text-[13px]">
                                        Tidak ada tugas terdaftar.
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* -------------------- TAB CONTENT: KUIS & CBT -------------------- */}
                    {activeSubTab === 'kuis' && (
                        <div className="space-y-4">
                            {activeQuizId ? (
                                <Card className="p-6 border-iris-200 shadow-md relative overflow-hidden space-y-6 bg-white">
                                    <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-border/80 pb-4 mb-4 flex items-center justify-between z-10">
                                        <div>
                                            <span className="text-[10px] uppercase font-bold text-iris-600 tracking-widest bg-iris-50 px-2 py-0.5 rounded">
                                                Ujian Sedang Berlangsung (CBT Mode)
                                            </span>
                                            <h3 className="text-base font-bold text-ink mt-1">
                                                {quizzesList.find((q) => q.id === activeQuizId)?.title}
                                            </h3>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            {quizWarnings > 0 && (
                                                <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full text-amber-700 animate-pulse">
                                                    <AlertCircle size={14} />
                                                    <span className="text-[11px] font-bold">Kecurangan: {quizWarnings}x</span>
                                                </div>
                                            )}

                                            <div className="flex items-center gap-1.5 bg-rose-50 border border-rose-100 text-rose-700 px-3.5 py-1.5 rounded-xl font-mono text-[14px] font-bold">
                                                <Clock size={16} className="text-rose-600 animate-spin" style={{ animationDuration: '4s' }} />
                                                <span>
                                                    {Math.floor(quizTimeRemaining / 60)}:
                                                    {String(quizTimeRemaining % 60).padStart(2, '0')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-amber-50/50 border border-amber-100 p-3.5 rounded-xl flex items-start gap-2.5 text-[11px] text-amber-800 leading-relaxed">
                                        <AlertCircle size={16} className="shrink-0 text-amber-600 mt-0.5" />
                                        <div>
                                            <p className="font-bold uppercase tracking-wider">Peraturan Ujian Mandiri & Anti-Curang</p>
                                            <p className="mt-0.5">Sistem ini mendeteksi aktivitas tab-switching (berpindah tab/browser). Melakukan tindakan tersebut akan dicatat sebagai indikasi pelanggaran oleh sistem dan dosen pengampu.</p>
                                        </div>
                                    </div>

                                    <div className="space-y-6 pt-2">
                                        {quizzesList
                                            .find((q) => q.id === activeQuizId)
                                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                            ?.questions?.map((q: any, idx: number) => (
                                                <div key={q.id} className="p-4 rounded-xl border border-border bg-surface2/30 space-y-3">
                                                    <div className="flex items-start gap-2">
                                                        <span className="font-bold text-[13px] text-iris-600 bg-white border border-border px-2 py-0.5 rounded-md h-fit shrink-0">
                                                            No. {idx + 1}
                                                        </span>
                                                        <p className="text-[13px] font-semibold text-ink leading-relaxed pt-0.5">
                                                            {q.content}
                                                        </p>
                                                    </div>

                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pl-9">
                                                        {q.options?.map((opt: { id: string; optionText?: string; isCorrect?: boolean }) => {
                                                            const isChecked = quizAnswers[q.id] === opt.id;
                                                            return (
                                                                <label
                                                                    key={opt.id}
                                                                    className={`flex items-center gap-3 p-3 rounded-lg border text-[12px] font-medium transition-all cursor-pointer ${
                                                                        isChecked
                                                                            ? 'bg-iris-50/50 border-iris-300 text-iris-950 font-semibold'
                                                                            : 'bg-white border-border hover:bg-surface2/50 text-ink2'
                                                                    }`}
                                                                >
                                                                    <input
                                                                        type="radio"
                                                                        name={`question-${q.id}`}
                                                                        value={opt.id}
                                                                        checked={isChecked}
                                                                        onChange={() => setQuizAnswers((prev) => ({ ...prev, [q.id]: opt.id }))}
                                                                        className="text-iris-600 focus:ring-iris-500/20"
                                                                    />
                                                                    <span>{opt.optionText}</span>
                                                                </label>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            ))}
                                    </div>

                                    <div className="flex items-center justify-end border-t border-border pt-4 mt-6 gap-3">
                                        <Button
                                            onClick={() => {
                                                if (confirm('Batal mengerjakan kuis? Semua progres saat ini akan hilang.')) {
                                                    const key = `quiz_start_${activeQuizId}_${user?.id || 'guest'}`;
                                                    localStorage.removeItem(key);
                                                    setActiveQuizId(null);
                                                }
                                            }}
                                            variant="ghost"
                                            className="text-muted text-[12px] cursor-pointer"
                                        >
                                            Batalkan
                                        </Button>
                                        <Button
                                            onClick={() => handleManualSubmitQuiz(activeQuizId)}
                                            disabled={isSubmittingQuiz}
                                            className="bg-iris-600 hover:bg-iris-700 text-white font-bold text-[12px] px-6 gap-1.5 cursor-pointer"
                                        >
                                            Kumpulkan & Selesai
                                        </Button>
                                    </div>
                                </Card>
                            ) : (
                                <div className="space-y-4">
                                    <h2 className="text-[15px] font-bold text-ink">
                                        Daftar Kuis & Ujian Aktif
                                    </h2>

                                    <div className="space-y-3">
                                        {quizzesList.map((quiz) => {
                                            const isAttempted = quiz.attempts && quiz.attempts.length > 0;
                                            const latestAttempt = isAttempted ? quiz.attempts[quiz.attempts.length - 1] : null;
                                            const openTime = new Date(quiz.openAt);
                                            const closeTime = new Date(quiz.closeAt);
                                            const now = new Date();
                                            const isOpen = now >= openTime && now <= closeTime;

                                            return (
                                                <Card key={quiz.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white">
                                                    <div className="space-y-1.5">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <span className="text-[10px] uppercase font-extrabold tracking-wider text-iris-600 bg-iris-50 px-2 py-0.5 rounded">
                                                                {quiz.type === 'quiz' ? 'Kuis Mingguan' : quiz.type === 'uts' ? 'UTS' : 'UAS'}
                                                            </span>
                                                             {isAttempted ? (
                                                                <Badge variant="green" className="text-[9px] py-0.5 font-bold">
                                                                    Selesai Dikerjakan
                                                                </Badge>
                                                            ) : isOpen ? (
                                                                <Badge variant="blue" className="text-[9px] py-0.5 font-bold">
                                                                    Dapat Dikerjakan
                                                                </Badge>
                                                            ) : (
                                                                <Badge variant="gray" className="text-[9px] py-0.5 font-bold">
                                                                    Ditutup
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <h3 className="text-[14px] font-bold text-ink leading-snug">{quiz.title}</h3>
                                                        <div className="flex flex-col gap-1 text-[11px] text-muted">
                                                            <p className="flex items-center gap-1.5">
                                                                <Clock size={12} /> Durasi: {quiz.durationMin} Menit &bull; {quiz.questions?.length || 0} Soal Pilihan Ganda
                                                            </p>
                                                            <p className="flex items-center gap-1.5">
                                                                <Calendar size={12} /> Dibuka: {openTime.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })} WIB s/d {closeTime.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })} WIB
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-3 shrink-0 self-start md:self-center">
                                                        {isAttempted ? (
                                                            <div className="text-right">
                                                                <span className="block text-[10px] text-muted uppercase font-bold tracking-wider">Nilai Anda</span>
                                                                <span className="text-lg font-black text-emerald-600">{latestAttempt.score} <span className="text-[10px] text-muted font-normal">/ 100</span></span>
                                                            </div>
                                                        ) : isOpen ? (
                                                            <Button
                                                                onClick={() => handleStartQuiz(quiz.id)}
                                                                className="bg-iris-600 hover:bg-iris-700 text-white font-bold text-[12px] gap-1 cursor-pointer"
                                                            >
                                                                Mulai Ujian
                                                            </Button>
                                                        ) : (
                                                            <Button disabled variant="secondary" className="text-[11px] font-bold">
                                                                Waktu Habis
                                                            </Button>
                                                        )}
                                                    </div>
                                                </Card>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* -------------------- TAB CONTENT: DISKUSI -------------------- */}
                    {activeSubTab === 'diskusi' && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-[15px] font-bold text-ink">
                                    Forum Diskusi Kelas
                                </h2>
                                <Button
                                    onClick={() =>
                                        setShowAddDiscussion(!showAddDiscussion)
                                    }
                                    variant="ghost"
                                    className="text-iris-600 gap-1 text-[12px] h-9 cursor-pointer"
                                >
                                    <PlusCircle size={16} /> Buat Diskusi Baru
                                </Button>
                            </div>

                            {/* Add Discussion Form */}
                            {showAddDiscussion && (
                                <Card className="p-5 space-y-3 bg-iris-50/20 border-iris-100">
                                    <h3 className="text-[13px] font-bold text-ink">
                                        Mulai Diskusi Baru
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="space-y-1">
                                            <Label htmlFor="disc-title">
                                                Judul Diskusi
                                            </Label>
                                            <Input
                                                id="disc-title"
                                                placeholder="Contoh: Pertanyaan tentang Tugas 1"
                                                value={newDiscussionTitle}
                                                onChange={(e) =>
                                                    setNewDiscussionTitle(
                                                        e.target.value,
                                                    )
                                                }
                                                className="bg-white"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label htmlFor="disc-content">
                                                Isi Pertanyaan / Topik
                                            </Label>
                                            <Textarea
                                                id="disc-content"
                                                placeholder="Tulis detail topik diskusi Anda di sini..."
                                                value={newDiscussionContent}
                                                onChange={(e) =>
                                                    setNewDiscussionContent(
                                                        e.target.value,
                                                    )
                                                }
                                                className="bg-white min-h-[100px]"
                                            />
                                        </div>
                                        <div className="flex items-center gap-2 pt-2 justify-end">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                    setShowAddDiscussion(false)
                                                }
                                            >
                                                Batal
                                            </Button>
                                            <Button
                                                size="sm"
                                                onClick={handleCreateDiscussion}
                                            >
                                                Kirim Thread
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            )}

                            {/* Discussions List */}
                            <div className="space-y-4">
                                {discussions.length > 0 ? (
                                    discussions.map((disc) => (
                                        <Card
                                            key={disc.id}
                                            className="p-5 space-y-4"
                                        >
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[11px] font-semibold text-iris-600 bg-iris-50 px-2.5 py-0.5 rounded-full">
                                                        {disc.authorName}
                                                    </span>
                                                    <span className="text-[10px] text-muted">
                                                        {new Date(
                                                            disc.date,
                                                        ).toLocaleDateString(
                                                            'id-ID',
                                                            {
                                                                day: 'numeric',
                                                                month: 'short',
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                            },
                                                        )}{' '}
                                                        WIB
                                                    </span>
                                                </div>
                                                <h3 className="text-[14px] font-bold text-ink leading-snug">
                                                    {disc.title}
                                                </h3>
                                                <p className="text-[12px] text-ink2 leading-relaxed">
                                                    {disc.content}
                                                </p>
                                            </div>

                                            {/* Replies Section */}
                                            <div className="border-t border-border/60 pt-4 space-y-3">
                                                <h4 className="text-[11px] font-bold text-ink uppercase tracking-wider flex items-center gap-1.5">
                                                    <MessageSquare
                                                        size={13}
                                                        className="text-muted"
                                                    />{' '}
                                                    Tanggapan (
                                                    {disc.replies.length})
                                                </h4>

                                                {disc.replies.length > 0 && (
                                                    <div className="space-y-3 bg-surface2/30 p-3 rounded-xl border border-border/50">
                                                        {disc.replies.map(
                                                            (reply) => (
                                                                <div
                                                                    key={
                                                                        reply.id
                                                                    }
                                                                    className="text-[12px] space-y-1 pb-3 last:pb-0 border-b last:border-0 border-border/40"
                                                                >
                                                                    <div className="flex items-center justify-between">
                                                                        <span className="font-bold text-ink">
                                                                            {
                                                                                reply.authorName
                                                                            }
                                                                        </span>
                                                                        <span className="text-[10px] text-muted">
                                                                            {new Date(
                                                                                reply.date,
                                                                            ).toLocaleDateString(
                                                                                'id-ID',
                                                                                {
                                                                                    day: 'numeric',
                                                                                    month: 'short',
                                                                                    hour: '2-digit',
                                                                                    minute: '2-digit',
                                                                                },
                                                                            )}
                                                                        </span>
                                                                    </div>
                                                                    <p className="text-ink2 leading-relaxed">
                                                                        {
                                                                            reply.content
                                                                        }
                                                                    </p>
                                                                </div>
                                                            ),
                                                        )}
                                                    </div>
                                                )}

                                                {/* Reply Form */}
                                                <div className="flex gap-2">
                                                    <Input
                                                        placeholder="Tulis tanggapan Anda..."
                                                        value={
                                                            replyInputs[
                                                                disc.id
                                                            ] || ''
                                                        }
                                                        onChange={(e) =>
                                                            setReplyInputs(
                                                                (prev) => ({
                                                                    ...prev,
                                                                    [disc.id]:
                                                                        e.target
                                                                            .value,
                                                                }),
                                                            )
                                                        }
                                                        className="bg-white text-[12px] h-9"
                                                    />
                                                    <Button
                                                        size="sm"
                                                        onClick={() =>
                                                            handleAddReply(
                                                                disc.id,
                                                            )
                                                        }
                                                        className="h-9 w-9 p-0 flex items-center justify-center shrink-0"
                                                    >
                                                        <Send size={14} />
                                                    </Button>
                                                </div>
                                            </div>
                                        </Card>
                                    ))
                                ) : (
                                    <div className="py-8 text-center text-muted text-[13px]">
                                        Belum ada topik diskusi. Jadilah yang
                                        pertama bertanya!
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* -------------------- TAB CONTENT: NILAI -------------------- */}
                    {activeSubTab === 'nilai' && (
                        <Card className="p-5 space-y-5">
                            <h2 className="text-[14px] font-bold text-ink uppercase tracking-wider">
                                Rincian Penilaian
                            </h2>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-[13px] border-collapse">
                                    <thead>
                                        <tr className="border-b border-border text-muted font-semibold">
                                            <th className="pb-3 pr-4">
                                                Komponen Penilaian
                                            </th>
                                            <th className="pb-3 pr-4 text-center">
                                                Bobot
                                            </th>
                                            <th className="pb-3 pr-4 text-center">
                                                Nilai Uji
                                            </th>
                                            <th className="pb-3 text-right">
                                                Nilai Kontribusi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/60">
                                        {[
                                            {
                                                name: 'Rata-rata Tugas',
                                                weight: '40%',
                                                score: 90,
                                                contribution: 36.0,
                                            },
                                            {
                                                name: 'Ujian Tengah Semester (UTS)',
                                                weight: '25%',
                                                score: 80,
                                                contribution: 20.0,
                                            },
                                            {
                                                name: 'Ujian Akhir Semester (UAS)',
                                                weight: '25%',
                                                score: 85,
                                                contribution: 21.25,
                                            },
                                            {
                                                name: 'Partisipasi & Kehadiran',
                                                weight: '10%',
                                                score: 95,
                                                contribution: 9.5,
                                            },
                                        ].map((item, idx) => (
                                            <tr key={idx}>
                                                <td className="py-3.5 pr-4 font-semibold text-ink">
                                                    {item.name}
                                                </td>
                                                <td className="py-3.5 pr-4 text-center text-muted">
                                                    {item.weight}
                                                </td>
                                                <td className="py-3.5 pr-4 text-center font-bold text-ink">
                                                    {item.score}
                                                </td>
                                                <td className="py-3.5 text-right font-mono font-semibold text-muted">
                                                    +
                                                    {item.contribution.toFixed(
                                                        2,
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="border-t border-border pt-4 flex items-center justify-between">
                                <div>
                                    <span className="text-[10px] uppercase font-bold text-muted tracking-wider">
                                        Akumulasi Nilai
                                    </span>
                                    <p className="text-xl font-bold text-ink">
                                        86.75 / 100
                                    </p>
                                </div>
                                <div>
                                    <span className="text-[10px] uppercase font-bold text-muted tracking-wider block text-right">
                                        Predikat Huruf
                                    </span>
                                    <span className="inline-block rounded-full bg-success/15 px-3.5 py-1 text-[13px] font-black text-success mt-0.5">
                                        A (Lulus Sangat Memuaskan)
                                    </span>
                                </div>
                            </div>
                        </Card>
                    )}
                </div>

                {/* Right Column (Course Info Sidebar) */}
                <div className="space-y-6">
                    {/* Informasi Jadwal & Ruangan */}
                    <Card className="p-5 space-y-4">
                        <h3 className="text-[13px] font-bold text-ink uppercase tracking-wider pb-2 border-b border-border/80">
                            Informasi Perkuliahan
                        </h3>
                        <div className="space-y-3.5">
                            {/* Kelompok MK */}
                            <div className="flex items-start gap-3">
                                <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
                                    <Layers size={16} />
                                </div>
                                <div>
                                    <span className="block text-[10px] font-bold text-muted uppercase tracking-wider">
                                        Kelompok MK
                                    </span>
                                    <span className="text-[13px] font-bold text-ink">
                                        {course.kelompok_mk ||
                                            'Wajib Program Studi'}
                                    </span>
                                </div>
                            </div>

                            {/* SKS Breakdown */}
                            <div className="flex items-start gap-3">
                                <div className="flex size-8 items-center justify-center rounded-lg bg-sky-50 text-sky-600 shrink-0">
                                    <BookOpen size={16} />
                                </div>
                                <div>
                                    <span className="block text-[10px] font-bold text-muted uppercase tracking-wider">
                                        Satuan Kredit Semester (SKS)
                                    </span>
                                    <span className="text-[13px] font-bold text-ink">
                                        {course.sks} SKS
                                        <span className="text-muted font-normal text-[12px] ml-1.5">
                                            ({course.teori || 0} Teori,{' '}
                                            {course.praktek || 0} Praktek)
                                        </span>
                                    </span>
                                </div>
                            </div>

                            {/* Jadwal Pelaksanaan */}
                            <div className="flex items-start gap-3">
                                <div className="flex size-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600 shrink-0">
                                    <Clock size={16} />
                                </div>
                                <div>
                                    <span className="block text-[10px] font-bold text-muted uppercase tracking-wider">
                                        Jadwal Kuliah
                                    </span>
                                    <span className="text-[13px] font-bold text-ink capitalize">
                                        {course.day_of_week || 'Senin'},{' '}
                                        {course.start_time?.substring(0, 5) ||
                                            '08:00'}{' '}
                                        -{' '}
                                        {course.end_time?.substring(0, 5) ||
                                            '10:30'}{' '}
                                        WIB
                                    </span>
                                </div>
                            </div>

                            {/* Ruangan */}
                            <div className="flex items-start gap-3">
                                <div className="flex size-8 items-center justify-center rounded-lg bg-rose-50 text-rose-600 shrink-0">
                                    <MapPin size={16} />
                                </div>
                                <div>
                                    <span className="block text-[10px] font-bold text-muted uppercase tracking-wider">
                                        Ruang Kelas
                                    </span>
                                    <span className="text-[13px] font-bold text-ink">
                                        {course.room || 'Ruang H.4.1'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Lecturer Contact Info */}
                    <Card className="p-5 space-y-4">
                        <h3 className="text-[13px] font-bold text-ink uppercase tracking-wider pb-2 border-b border-border/80">
                            Dosen Pengampu
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="flex size-10 items-center justify-center rounded-full bg-iris-50 text-iris-600 font-bold shrink-0">
                                    {course.lecturer.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="text-[13px] font-bold text-ink leading-tight">
                                        {course.lecturer}
                                    </h4>
                                    <span className="text-[10px] text-muted">
                                        NIP. 198501012010011001
                                    </span>
                                </div>
                            </div>
                            <div className="text-[12px] space-y-1.5 text-muted pt-2 border-t border-border/60">
                                <p>
                                    Email:{' '}
                                    <span className="text-ink">
                                        budi.santoso@dsn.dinus.ac.id
                                    </span>
                                </p>
                                <p>
                                    Telepon:{' '}
                                    <span className="text-ink">
                                        08123456780
                                    </span>
                                </p>
                                <p>
                                    Ruang:{' '}
                                    <span className="text-ink">
                                        Gedung H Lantai 2 (H.2.3)
                                    </span>
                                </p>
                            </div>
                        </div>
                    </Card>

                    {/* Academic Communication Links */}
                    <Card className="p-5 space-y-4">
                        <h3 className="text-[13px] font-bold text-ink uppercase tracking-wider pb-2 border-b border-border/80">
                            Media & Pembelajaran
                        </h3>
                        <div className="space-y-2.5">
                            <a
                                href="https://zoom.us/j/123456789"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block"
                            >
                                <Button
                                    className="w-full gap-2 justify-center bg-iris-600 hover:bg-iris-700 cursor-pointer"
                                    size="md"
                                >
                                    <Video size={16} /> Masuk Meeting Zoom
                                </Button>
                            </a>
                            <button className="w-full flex items-center justify-between rounded-lg border border-border px-3 py-2 text-[12px] font-semibold text-ink hover:bg-surface2 transition-colors cursor-pointer text-left">
                                <span className="flex items-center gap-2">
                                    <FileText
                                        size={15}
                                        className="text-muted"
                                    />{' '}
                                    Rencana Pembelajaran (RPS)
                                </span>
                                <Download size={14} className="text-muted" />
                            </button>
                        </div>
                    </Card>

                    {/* Class Representative Info */}
                    <Card className="p-5 space-y-4">
                        <h3 className="text-[13px] font-bold text-ink uppercase tracking-wider pb-2 border-b border-border/80">
                            Komisaris Tingkat (Komting)
                        </h3>
                        <div className="flex items-center gap-3">
                            <div className="flex size-8 items-center justify-center rounded-full bg-surface2 border border-border text-muted shrink-0">
                                <User size={15} />
                            </div>
                            <div>
                                <h4 className="text-[12px] font-bold text-ink leading-tight">
                                    Reza Ramadhan
                                </h4>
                                <p className="text-[10px] text-muted mt-0.5">
                                    HP: 0896-1234-5678
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
