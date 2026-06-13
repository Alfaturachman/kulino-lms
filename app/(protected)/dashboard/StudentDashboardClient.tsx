'use client';

import { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth';
import { mockCourses } from '@/data/courses';
import {
    mockAssignments,
    mockCalendarEvents,
    mockAnnouncements,
    mockSubmissions,
} from '@/data/mockData';
import { Card } from '@/components/ui/card';

const courseCardThemes = [
    // Theme 1: Emerald Checkerboard
    {
        bannerClass: 'bg-emerald-600',
        bannerStyle: {
            backgroundImage:
                'linear-gradient(45deg, rgba(255,255,255,0.06) 25%, transparent 25%), linear-gradient(-45deg, rgba(255,255,255,0.06) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.06) 75%), linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.06) 75%)',
            backgroundSize: '24px 24px',
            backgroundPosition: '0 0, 0 12px, 12px -12px, -12px 0',
        },
    },
    // Theme 2: Pink Hexagons / Dots
    {
        bannerClass: 'bg-rose-500',
        bannerStyle: {
            backgroundImage:
                'radial-gradient(circle, rgba(255,255,255,0.08) 20%, transparent 20%), radial-gradient(circle, rgba(255,255,255,0.12) 20%, transparent 20%)',
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 10px 10px',
        },
    },
    // Theme 3: Blue Intersecting Circles
    {
        bannerClass: 'bg-sky-600',
        bannerStyle: {
            backgroundImage:
                'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.12) 30%, transparent 30%), radial-gradient(circle at 0 0, rgba(255,255,255,0.1) 40%, transparent 40%), radial-gradient(circle at 100% 100%, rgba(255,255,255,0.1) 40%, transparent 40%)',
            backgroundSize: '32px 32px',
        },
    },
    // Theme 4: Purple Diagonals
    {
        bannerClass: 'bg-violet-600',
        bannerStyle: {
            backgroundImage:
                'repeating-linear-gradient(45deg, rgba(255,255,255,0.06), rgba(255,255,255,0.06) 10px, transparent 10px, transparent 20px)',
        },
    },
    // Theme 5: Teal Triangles
    {
        bannerClass: 'bg-teal-600',
        bannerStyle: {
            backgroundImage:
                'linear-gradient(135deg, rgba(255,255,255,0.08) 25%, transparent 25%), linear-gradient(225deg, rgba(255,255,255,0.08) 25%, transparent 25%), linear-gradient(45deg, rgba(255,255,255,0.08) 25%, transparent 25%), linear-gradient(315deg, rgba(255,255,255,0.08) 25%, transparent 25%)',
            backgroundSize: '24px 24px',
            backgroundPosition: '0 0, 0 12px, 12px -12px, -12px 0',
        },
    },
    // Theme 6: Grey Polygons
    {
        bannerClass: 'bg-slate-600',
        bannerStyle: {
            backgroundImage:
                'linear-gradient(30deg, rgba(255,255,255,0.05) 12%, transparent 12.5%, transparent 87%, rgba(255,255,255,0.05) 87.5%, rgba(255,255,255,0.05)), linear-gradient(150deg, rgba(255,255,255,0.05) 12%, transparent 12.5%, transparent 87%, rgba(255,255,255,0.05) 87.5%, rgba(255,255,255,0.05))',
            backgroundSize: '20px 35px',
        },
    },
];
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    BookOpen,
    Calendar as CalendarIcon,
    GraduationCap,
    Megaphone,
    Clock,
    ArrowRight,
    Search,
    CheckCircle,
    FileText,
    TrendingUp,
} from 'lucide-react';

interface StudentDashboardClientProps {
    initialTab: string;
    dbUser?: any;
    dbCourses?: any[];
    dbAnnouncements?: any[];
    dbCalendarEvents?: any[];
    dbAssignments?: any[];
    dbSubmissions?: any[];
}

export default function StudentDashboardClient({
    initialTab,
    dbUser,
    dbCourses,
    dbAnnouncements,
    dbCalendarEvents,
    dbAssignments,
    dbSubmissions,
}: StudentDashboardClientProps) {
    const { user: localUser } = useAuthStore();
    const activeUser = dbUser || localUser;

    const coursesToUse =
        dbCourses && dbCourses.length > 0 ? dbCourses : mockCourses;
    const announcementsToUse =
        dbAnnouncements && dbAnnouncements.length > 0
            ? dbAnnouncements
            : mockAnnouncements;
    const calendarEventsToUse =
        dbCalendarEvents && dbCalendarEvents.length > 0
            ? dbCalendarEvents
            : mockCalendarEvents;
    const assignmentsToUse =
        dbAssignments && dbAssignments.length > 0
            ? dbAssignments
            : mockAssignments;
    const submissionsToUse =
        dbSubmissions && dbSubmissions.length > 0
            ? dbSubmissions
            : mockSubmissions;

    const [searchTerm, setSearchTerm] = useState('');
    const [courseFilter, setCourseFilter] = useState<
        'all' | 'active' | 'completed'
    >('active');

    // Fallback for user name/nim
    const studentName = activeUser?.name || 'Ahmad Fauzi';
    const studentNim = activeUser?.nim_nip || '220102001';

    // Filter courses based on status and search query
    const filteredCourses = coursesToUse.filter((course) => {
        const matchesSearch =
            course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.code.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter =
            courseFilter === 'all' || course.status === courseFilter;
        return matchesSearch && matchesFilter;
    });

    // Calculate stats
    const totalCourses = coursesToUse.length;
    const activeCoursesCount = coursesToUse.filter(
        (c) => c.status === 'active',
    ).length;
    const completedCoursesCount = coursesToUse.filter(
        (c) => c.status === 'completed',
    ).length;

    // Calculate GPA approximation from grades
    const mockGpa = '3.84';

    // Check how many assignments are pending (no graded submission yet)
    const pendingAssignmentsCount = assignmentsToUse.filter((asm) => {
        const hasSub = submissionsToUse.some(
            (sub) =>
                sub.assignmentId === asm.id &&
                sub.studentId === (activeUser?.id || 'STU-001'),
        );
        return !hasSub;
    }).length;

    return (
        <div className="space-y-6">
            {/* Page Header / Welcome Banner */}
            {initialTab === 'overview' && (
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-iris-800 to-iris-600 p-6 text-white md:p-8">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                    <div className="relative z-10 space-y-2">
                        <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-[11px] font-semibold tracking-wide uppercase text-white/95">
                            Semester Ganjil 2025/2026
                        </span>
                        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                            Selamat datang kembali, {studentName}!
                        </h1>
                        <p className="text-[13px] text-white/80 md:text-[14px]">
                            NIM: {studentNim} {''} &bull; Program Studi Teknik
                            Informatika &bull; Universitas Dian Nuswantoro
                        </p>
                    </div>
                </div>
            )}

            {/* Grid: Overview Stats */}
            {initialTab === 'overview' && (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <Card className="flex flex-col justify-between p-5">
                        <span className="text-[12px] font-medium text-muted">
                            Kelas Aktif
                        </span>
                        <div className="mt-2 flex items-baseline justify-between">
                            <span className="text-2xl font-bold text-ink">
                                {activeCoursesCount}
                            </span>
                            <BookOpen size={20} className="text-iris-500" />
                        </div>
                        <span className="mt-1 text-[10px] text-muted">
                            {completedCoursesCount} Kelas Selesai
                        </span>
                    </Card>
                    <Card className="flex flex-col justify-between p-5">
                        <span className="text-[12px] font-medium text-muted">
                            IPK Terakhir
                        </span>
                        <div className="mt-2 flex items-baseline justify-between">
                            <span className="text-2xl font-bold text-ink">
                                {mockGpa}
                            </span>
                            <GraduationCap size={20} className="text-success" />
                        </div>
                        <span className="mt-1 text-[10px] text-muted">
                            Skala Maksimum 4.00
                        </span>
                    </Card>
                    <Card className="flex flex-col justify-between p-5">
                        <span className="text-[12px] font-medium text-muted">
                            Tugas Pending
                        </span>
                        <div className="mt-2 flex items-baseline justify-between">
                            <span className="text-2xl font-bold text-ink">
                                {pendingAssignmentsCount}
                            </span>
                            <Clock size={20} className="text-warning" />
                        </div>
                        <span className="mt-1 text-[10px] text-muted">
                            Butuh diserahkan
                        </span>
                    </Card>
                    <Card className="flex flex-col justify-between p-5">
                        <span className="text-[12px] font-medium text-muted">
                            Pengumuman
                        </span>
                        <div className="mt-2 flex items-baseline justify-between">
                            <span className="text-2xl font-bold text-ink">
                                {announcementsToUse.length}
                            </span>
                            <Megaphone size={20} className="text-accent" />
                        </div>
                        <span className="mt-1 text-[10px] text-muted">
                            Info dosen pengampu
                        </span>
                    </Card>
                </div>
            )}

            {/* Main Tab Routing */}
            {/* -------------------- TAB: OVERVIEW -------------------- */}
            {initialTab === 'overview' && (
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Active Courses (Left 2 columns) */}
                    <div className="space-y-4 lg:col-span-2">
                        <div className="flex items-center justify-between">
                            <h2 className="text-[16px] font-semibold text-ink">
                                Mata Kuliah Semester Ini
                            </h2>
                            <Link href="/dashboard?tab=courses">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-iris-600 gap-1 hover:text-iris-800"
                                >
                                    Lihat Semua <ArrowRight size={14} />
                                </Button>
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {coursesToUse
                                .filter((c) => c.status === 'active')
                                .slice(0, 4)
                                .map((course, idx) => {
                                    const IconComponent =
                                        course.icon || BookOpen;
                                    // Hardcoded progress simulation for student
                                    const progress =
                                        course.id === 'CS-101' ||
                                        course.id ===
                                            'c101c101-c101-c101-c101-c101c101c101'
                                            ? 45
                                            : course.id === 'CS-102' ||
                                                course.id ===
                                                    'c102c102-c102-c102-c102-c102c102c102'
                                              ? 30
                                              : course.id === 'CS-103' ||
                                                  course.id ===
                                                      'c103c103-c103-c103-c103-c103c103c103'
                                                ? 65
                                                : 15;
                                    const theme =
                                        courseCardThemes[
                                            idx % courseCardThemes.length
                                        ];

                                    return (
                                        <Link
                                            key={course.id}
                                            href={`/dashboard/course/${course.id}`}
                                        >
                                            <Card className="group flex flex-col justify-between min-h-52 p-0 overflow-hidden hover:border-iris-200 cursor-pointer transition-all duration-300 shadow-xs hover:shadow-md bg-surface border border-border rounded-xl">
                                                {/* Vector Banner */}
                                                <div
                                                    className={cn(
                                                        'h-24 w-full relative p-4 flex flex-col justify-between text-white select-none',
                                                        theme.bannerClass,
                                                    )}
                                                    style={theme.bannerStyle}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex size-8 items-center justify-center rounded-lg bg-white/20 backdrop-blur-xs text-white">
                                                            <IconComponent
                                                                size={16}
                                                            />
                                                        </div>
                                                        <Badge className="bg-white/20 text-white border-0 backdrop-blur-xs text-[10px] font-semibold">
                                                            {course.code}
                                                        </Badge>
                                                    </div>

                                                    {/* Progress inside Banner */}
                                                    <div className="space-y-1">
                                                        <div className="flex items-center justify-between text-[10px] font-semibold text-white/90">
                                                            <span>
                                                                Progress Belajar
                                                            </span>
                                                            <span>
                                                                {progress}%
                                                            </span>
                                                        </div>
                                                        <div className="h-1.5 w-full bg-white/30 rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-white rounded-full transition-all duration-500"
                                                                style={{
                                                                    width: `${progress}%`,
                                                                }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Bottom Information */}
                                                <div className="p-4 flex-1 flex flex-col justify-between">
                                                    <div>
                                                        <span className="text-[10px] font-mono text-muted uppercase tracking-wider">
                                                            {course.semester ||
                                                                'Ganjil 2025/2026'}{' '}
                                                            &bull; {course.sks}{' '}
                                                            SKS
                                                        </span>
                                                        <h3 className="text-[14px] font-bold text-ink group-hover:text-iris-600 transition-colors line-clamp-2 mt-1 leading-snug">
                                                            {course.name}
                                                        </h3>
                                                    </div>
                                                    <p className="text-[11px] text-muted line-clamp-1 mt-2">
                                                        {course.lecturer}
                                                    </p>
                                                </div>
                                            </Card>
                                        </Link>
                                    );
                                })}
                        </div>
                    </div>

                    {/* Sidebar Area: Task Deadlines & Recent Info (Right 1 column) */}
                    <div className="space-y-6">
                        {/* Upcoming Deadlines */}
                        <div className="space-y-4">
                            <h2 className="text-[16px] font-semibold text-ink">
                                Tenggat Waktu Terdekat
                            </h2>
                            <Card className="divide-y divide-border/60 overflow-hidden">
                                {assignmentsToUse.length > 0 ? (
                                    assignmentsToUse.slice(0, 3).map((asm) => {
                                        const isSubmitted =
                                            submissionsToUse.some(
                                                (sub) =>
                                                    sub.assignmentId ===
                                                        asm.id &&
                                                    sub.studentId ===
                                                        (activeUser?.id ||
                                                            'STU-001'),
                                            );
                                        const deadlineDate = new Date(
                                            asm.deadline,
                                        );
                                        const daysRemaining = Math.ceil(
                                            (deadlineDate.getTime() -
                                                new Date().getTime()) /
                                                (1000 * 60 * 60 * 24),
                                        );

                                        return (
                                            <div
                                                key={asm.id}
                                                className="py-2 flex items-start justify-between gap-3 hover:bg-surface2/40 transition-colors"
                                            >
                                                <div className="space-y-1">
                                                    <p className="text-[12px] font-bold text-ink line-clamp-1">
                                                        {asm.title}
                                                    </p>
                                                    <span className="text-[10px] text-muted flex items-center gap-1.5">
                                                        <Clock size={12} />
                                                        {deadlineDate.toLocaleDateString(
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
                                                {isSubmitted ? (
                                                    <Badge variant="green">
                                                        Diserahkan
                                                    </Badge>
                                                ) : daysRemaining <= 3 ? (
                                                    <Badge variant="red">
                                                        {daysRemaining} hari
                                                        lagi
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="warn">
                                                        {daysRemaining} hari
                                                        lagi
                                                    </Badge>
                                                )}
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="p-6 text-center text-muted text-[13px]">
                                        Tidak ada tugas terdekat.
                                    </div>
                                )}
                            </Card>
                        </div>

                        {/* Recent Announcement */}
                        <div className="space-y-4">
                            <h2 className="text-[16px] font-semibold text-ink">
                                Pengumuman Terbaru
                            </h2>
                            <Card className="p-4 space-y-3">
                                {announcementsToUse.slice(0, 1).map((ann) => (
                                    <div key={ann.id} className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-semibold text-iris-600 bg-iris-50 px-2 py-0.5 rounded-full">
                                                {ann.lecturerName}
                                            </span>
                                            <span className="text-[10px] text-muted">
                                                {new Date(
                                                    ann.date,
                                                ).toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                })}
                                            </span>
                                        </div>
                                        <h4 className="text-[13px] font-bold text-ink leading-snug">
                                            {ann.title}
                                        </h4>
                                        <p className="text-[11px] text-muted leading-relaxed line-clamp-3">
                                            {ann.content}
                                        </p>
                                        <Link href="/dashboard?tab=announcements">
                                            <span className="inline-flex items-center gap-1 mt-2 text-[11px] font-semibold text-iris-600 hover:text-iris-800 transition-colors cursor-pointer">
                                                Baca selengkapnya{' '}
                                                <ArrowRight size={12} />
                                            </span>
                                        </Link>
                                    </div>
                                ))}
                            </Card>
                        </div>
                    </div>
                </div>
            )}

            {/* -------------------- TAB: COURSES -------------------- */}
            {initialTab === 'courses' && (
                <div className="space-y-6">
                    {/* Toolbar */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-surface border border-border p-4 rounded-xl">
                        <div className="flex items-center gap-2 bg-surface2 border border-border rounded-lg px-3 py-1.5 w-full sm:max-w-xs">
                            <Search size={16} className="text-muted shrink-0" />
                            <input
                                type="text"
                                placeholder="Cari kode atau nama kelas..."
                                className="bg-transparent border-0 outline-none text-[13px] text-ink placeholder:text-muted w-full"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center gap-1 border border-border bg-surface2 rounded-lg p-0.5">
                            {(['all', 'active', 'completed'] as const).map(
                                (filter) => (
                                    <button
                                        key={filter}
                                        onClick={() => setCourseFilter(filter)}
                                        className={`text-[12px] font-semibold px-3 py-1 rounded-md transition-colors cursor-pointer capitalize ${
                                            courseFilter === filter
                                                ? 'bg-white text-ink shadow-xs'
                                                : 'text-muted hover:text-ink'
                                        }`}
                                    >
                                        {filter === 'active'
                                            ? 'Aktif'
                                            : filter === 'completed'
                                              ? 'Selesai'
                                              : 'Semua'}
                                    </button>
                                ),
                            )}
                        </div>
                    </div>

                    {/* Courses Grid */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                        {filteredCourses.length > 0 ? (
                            filteredCourses.map((course, idx) => {
                                const IconComponent = course.icon || BookOpen;
                                const progress =
                                    course.status === 'completed'
                                        ? 100
                                        : course.id === 'CS-101' ||
                                            course.id ===
                                                'c101c101-c101-c101-c101-c101c101c101'
                                          ? 45
                                          : course.id === 'CS-102' ||
                                              course.id ===
                                                  'c102c102-c102-c102-c102-c102c102c102'
                                            ? 30
                                            : course.id === 'CS-103' ||
                                                course.id ===
                                                    'c103c103-c103-c103-c103-c103c103c103'
                                              ? 65
                                              : 15;
                                const theme =
                                    courseCardThemes[
                                        idx % courseCardThemes.length
                                    ];

                                return (
                                    <Link
                                        key={course.id}
                                        href={`/dashboard/course/${course.id}`}
                                    >
                                        <Card className="group flex flex-col justify-between min-h-52 p-0 overflow-hidden hover:border-iris-200 cursor-pointer transition-all duration-300 shadow-xs hover:shadow-md bg-surface border border-border rounded-xl">
                                            {/* Vector Banner */}
                                            <div
                                                className={cn(
                                                    'h-24 w-full relative p-4 flex flex-col justify-between text-white select-none',
                                                    theme.bannerClass,
                                                )}
                                                style={theme.bannerStyle}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex size-8 items-center justify-center rounded-lg bg-white/20 backdrop-blur-xs text-white">
                                                        <IconComponent
                                                            size={16}
                                                        />
                                                    </div>
                                                    <Badge
                                                        variant={
                                                            course.status ===
                                                            'completed'
                                                                ? 'green'
                                                                : 'blue'
                                                        }
                                                        className="bg-white/20 text-white border-0 backdrop-blur-xs"
                                                    >
                                                        {course.status ===
                                                        'completed'
                                                            ? 'Selesai'
                                                            : 'Aktif'}
                                                    </Badge>
                                                </div>

                                                {/* Progress inside Banner */}
                                                <div className="space-y-1">
                                                    <div className="flex items-center justify-between text-[10px] font-semibold text-white/90">
                                                        <span>
                                                            Progress Belajar
                                                        </span>
                                                        <span>{progress}%</span>
                                                    </div>
                                                    <div className="h-1.5 w-full bg-white/30 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-white rounded-full transition-all duration-500"
                                                            style={{
                                                                width: `${progress}%`,
                                                            }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Bottom Information */}
                                            <div className="p-4 flex-1 flex flex-col justify-between">
                                                <div>
                                                    <span className="text-[10px] font-mono text-muted uppercase tracking-wider">
                                                        {course.code} &bull;{' '}
                                                        {course.sks} SKS
                                                    </span>
                                                    <h3 className="text-[14px] font-bold text-ink group-hover:text-iris-600 transition-colors line-clamp-2 mt-1 leading-snug">
                                                        {course.name}
                                                    </h3>
                                                </div>
                                                <p className="text-[11px] text-muted line-clamp-1 mt-2">
                                                    {course.lecturer}
                                                </p>
                                            </div>
                                        </Card>
                                    </Link>
                                );
                            })
                        ) : (
                            <div className="col-span-full py-12 flex flex-col items-center justify-center text-center">
                                <BookOpen
                                    size={40}
                                    className="text-muted/60 mb-2"
                                />
                                <h3 className="text-[14px] font-bold text-ink">
                                    Tidak ada kelas ditemukan
                                </h3>
                                <p className="text-[12px] text-muted max-w-xs mt-1">
                                    Coba sesuaikan kata kunci pencarian atau
                                    filter status Anda.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* -------------------- TAB: GRADES -------------------- */}
            {initialTab === 'grades' && (
                <div className="space-y-6">
                    <Card className="p-6">
                        <h2 className="text-[16px] font-bold text-ink mb-4">
                            Rekapitulasi Nilai Akademik
                        </h2>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-[13px] border-collapse">
                                <thead>
                                    <tr className="border-b border-border text-muted font-semibold">
                                        <th className="pb-3 pr-4">Kode MK</th>
                                        <th className="pb-3 pr-4">
                                            Mata Kuliah
                                        </th>
                                        <th className="pb-3 pr-4 text-center">
                                            SKS
                                        </th>
                                        <th className="pb-3 pr-4 text-center">
                                            Tugas (40%)
                                        </th>
                                        <th className="pb-3 pr-4 text-center">
                                            UTS (25%)
                                        </th>
                                        <th className="pb-3 pr-4 text-center">
                                            UAS (25%)
                                        </th>
                                        <th className="pb-3 pr-4 text-center">
                                            Partisipasi (10%)
                                        </th>
                                        <th className="pb-3 text-right">
                                            Nilai Akhir
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/60">
                                    {/* We render courses with simulated grade components */}
                                    {[
                                        {
                                            code: 'TI301',
                                            name: 'Pemrograman Web',
                                            sks: 3,
                                            tugas: 90,
                                            uts: 80,
                                            uas: 85,
                                            part: 95,
                                            final: 'A',
                                        },
                                        {
                                            code: 'TI202',
                                            name: 'Basis Data',
                                            sks: 3,
                                            tugas: 85,
                                            uts: 78,
                                            uas: 80,
                                            part: 90,
                                            final: 'AB',
                                        },
                                        {
                                            code: 'TI203',
                                            name: 'Struktur Data & Algoritma',
                                            sks: 4,
                                            tugas: 95,
                                            uts: 92,
                                            uas: 88,
                                            part: 100,
                                            final: 'A',
                                        },
                                        {
                                            code: 'TI304',
                                            name: 'Jaringan Komputer',
                                            sks: 3,
                                            tugas: 75,
                                            uts: 70,
                                            uas: 72,
                                            part: 85,
                                            final: 'B',
                                        },
                                        {
                                            code: 'TI107',
                                            name: 'Matematika Diskrit',
                                            sks: 3,
                                            tugas: 92,
                                            uts: 85,
                                            uas: 90,
                                            part: 90,
                                            final: 'A',
                                        },
                                    ].map((grade, idx) => (
                                        <tr
                                            key={idx}
                                            className="hover:bg-surface2/30 transition-colors"
                                        >
                                            <td className="py-3.5 pr-4 font-mono text-[12px] font-semibold text-muted">
                                                {grade.code}
                                            </td>
                                            <td className="py-3.5 pr-4 font-bold text-ink">
                                                {grade.name}
                                            </td>
                                            <td className="py-3.5 pr-4 text-center">
                                                {grade.sks}
                                            </td>
                                            <td className="py-3.5 pr-4 text-center text-muted">
                                                {grade.tugas}
                                            </td>
                                            <td className="py-3.5 pr-4 text-center text-muted">
                                                {grade.uts}
                                            </td>
                                            <td className="py-3.5 pr-4 text-center text-muted">
                                                {grade.uas}
                                            </td>
                                            <td className="py-3.5 pr-4 text-center text-muted">
                                                {grade.part}
                                            </td>
                                            <td className="py-3.5 text-right font-bold text-iris-600">
                                                <span className="rounded-md bg-iris-50 px-2.5 py-1 text-[12px]">
                                                    {grade.final}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-border pt-6">
                            {/* Card 1: Total SKS */}
                            <div className="relative overflow-hidden rounded-xl border border-border bg-surface2/40 p-4 flex items-center gap-4 transition-all duration-300 hover:border-slate-300 hover:shadow-xs">
                                <div className="flex size-12 items-center justify-center rounded-xl bg-slate-100 text-slate-600 shrink-0">
                                    <BookOpen size={22} />
                                </div>
                                <div className="space-y-0.5">
                                    <span className="text-[10px] text-muted font-bold uppercase tracking-wider block">
                                        Total SKS Diambil
                                    </span>
                                    <p className="text-2xl font-extrabold text-ink leading-tight">
                                        16{' '}
                                        <span className="text-xs font-semibold text-muted ml-0.5">
                                            SKS
                                        </span>
                                    </p>
                                </div>
                            </div>

                            {/* Card 2: IPS */}
                            <div className="relative overflow-hidden rounded-xl border border-emerald-100 bg-emerald-50/30 p-4 flex items-center gap-4 transition-all duration-300 hover:border-emerald-200 hover:shadow-xs">
                                <div className="flex size-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 shrink-0">
                                    <TrendingUp size={22} />
                                </div>
                                <div className="space-y-0.5">
                                    <span className="text-[10px] text-muted font-bold uppercase tracking-wider block">
                                        IPS (Semester Ini)
                                    </span>
                                    <p className="text-2xl font-extrabold text-emerald-600 leading-tight">
                                        3.84
                                    </p>
                                    <span className="text-[10px] text-emerald-600/80 font-medium block">
                                        Sangat Memuaskan
                                    </span>
                                </div>
                            </div>

                            {/* Card 3: IPK */}
                            <div className="relative overflow-hidden rounded-xl border border-iris-100 bg-iris-50/30 p-4 flex items-center gap-4 transition-all duration-300 hover:border-iris-200 hover:shadow-xs">
                                <div className="flex size-12 items-center justify-center rounded-xl bg-iris-100 text-iris-600 shrink-0">
                                    <GraduationCap size={22} />
                                </div>
                                <div className="space-y-0.5">
                                    <span className="text-[10px] text-muted font-bold uppercase tracking-wider block">
                                        IPK Kumulatif
                                    </span>
                                    <p className="text-2xl font-extrabold text-iris-600 leading-tight">
                                        3.82
                                    </p>
                                    <span className="text-[10px] text-iris-600/80 font-semibold block">
                                        Dengan Pujian (Cum Laude)
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            )}

            {/* -------------------- TAB: CALENDAR -------------------- */}
            {initialTab === 'calendar' && (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {/* Main events list */}
                    <div className="md:col-span-2 space-y-4">
                        <Card className="border border-border bg-surface rounded-md px-5 py-4 divide-y divide-border/60 overflow-hidden">
                            <div className="pb-3">
                                <h2 className="text-[16px] font-bold text-ink">
                                    Agenda Semester Ganjil 2025/2026
                                </h2>
                            </div>
                            {calendarEventsToUse.map((evt) => {
                                const date = new Date(evt.date);
                                const isTask = evt.type === 'task';
                                const isExam = evt.type === 'exam';

                                return (
                                    <div
                                        key={evt.id}
                                        className="py-3 flex items-center justify-between gap-4 hover:bg-surface2/30 transition-colors"
                                    >
                                        <div className="flex items-start gap-4">
                                            {/* Styled date badge */}
                                            <div className="flex flex-col items-center justify-center size-12 rounded-xl bg-surface2 border border-border text-center shrink-0">
                                                <span className="text-[10px] uppercase font-bold text-muted leading-none">
                                                    {date.toLocaleDateString(
                                                        'id-ID',
                                                        { month: 'short' },
                                                    )}
                                                </span>
                                                <span className="text-[16px] font-bold text-ink leading-tight mt-0.5">
                                                    {date.getDate()}
                                                </span>
                                            </div>
                                            <div className="space-y-1">
                                                <h4 className="text-[13px] font-bold text-ink leading-snug">
                                                    {evt.title}
                                                </h4>
                                                <p className="text-[11px] text-muted">
                                                    Pukul{' '}
                                                    {date.toLocaleTimeString(
                                                        'id-ID',
                                                        {
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        },
                                                    )}{' '}
                                                    WIB
                                                </p>
                                            </div>
                                        </div>

                                        <Badge
                                            variant={
                                                isExam
                                                    ? 'red'
                                                    : isTask
                                                      ? 'warn'
                                                      : 'blue'
                                            }
                                        >
                                            {isExam
                                                ? 'Ujian'
                                                : isTask
                                                  ? 'Tugas'
                                                  : 'Akademik'}
                                        </Badge>
                                    </div>
                                );
                            })}
                        </Card>
                    </div>

                    {/* Simple Visual Calendar Sidebar */}
                    <Card className="p-5 h-fit space-y-4">
                        <h3 className="text-[13px] font-bold text-ink">
                            Juni 2026
                        </h3>
                        <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-muted">
                            {['S', 'S', 'R', 'K', 'J', 'S', 'M'].map(
                                (day, idx) => (
                                    <div key={idx} className="py-1">
                                        {day}
                                    </div>
                                ),
                            )}
                            {/* Calendar Grid Mockup */}
                            {Array.from({ length: 30 }).map((_, i) => {
                                const dayNo = i + 1;
                                const isDeadline =
                                    dayNo === 12 ||
                                    dayNo === 15 ||
                                    dayNo === 18;
                                return (
                                    <div
                                        key={i}
                                        className={`py-1.5 rounded-lg flex items-center justify-center font-medium relative ${
                                            dayNo === 6
                                                ? 'bg-iris-500 text-white font-bold'
                                                : isDeadline
                                                  ? 'text-warning-600 bg-warning/10 font-bold'
                                                  : 'text-ink hover:bg-surface2'
                                        }`}
                                    >
                                        {dayNo}
                                        {isDeadline && (
                                            <span className="absolute bottom-0.5 size-1 rounded-full bg-warning"></span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                        <div className="border-t border-border pt-4 text-[11px] space-y-2">
                            <div className="flex items-center gap-2">
                                <span className="size-2 rounded-full bg-iris-500"></span>
                                <span className="text-muted">Hari Ini</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="size-2 rounded-full bg-warning"></span>
                                <span className="text-muted">
                                    Batas Pengumpulan Tugas
                                </span>
                            </div>
                        </div>
                    </Card>
                </div>
            )}

            {/* -------------------- TAB: ANNOUNCEMENTS -------------------- */}
            {initialTab === 'announcements' && (
                <Card className="border border-border bg-surface rounded-md px-5 py-4 divide-y divide-border/60 overflow-hidden">
                    <div className="pb-3 flex items-center justify-between">
                        <h2 className="text-[16px] font-bold text-ink">
                            Pengumuman Akademik & Kelas
                        </h2>
                    </div>

                    <div className="divide-y divide-border/60">
                        {announcementsToUse.map((ann) => (
                            <div
                                key={ann.id}
                                className="py-5 first:pt-4 last:pb-0 space-y-3"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                    <div className="flex items-center gap-2.5">
                                        <span className="flex size-8 items-center justify-center rounded-full bg-iris-50 text-[12px] font-bold text-iris-600">
                                            {ann.lecturerName.charAt(0)}
                                        </span>
                                        <div>
                                            <h4 className="text-[13px] font-bold text-ink">
                                                {ann.lecturerName}
                                            </h4>
                                            <p className="text-[10px] text-muted">
                                                Dosen Pengampu
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-[11px] text-muted sm:self-start">
                                        {new Date(ann.date).toLocaleDateString(
                                            'id-ID',
                                            {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            },
                                        )}{' '}
                                        WIB
                                    </span>
                                </div>

                                <div className="border-t border-border/60 pt-3 space-y-2">
                                    <h3 className="text-[15px] font-bold text-ink leading-snug">
                                        {ann.title}
                                    </h3>
                                    <p className="text-[13px] text-ink2 leading-relaxed whitespace-pre-line">
                                        {ann.content}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            )}
        </div>
    );
}
