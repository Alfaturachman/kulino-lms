'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '@/store/auth';
import type { CalendarEvent } from '@/types/academic';
import { Course } from '@/types/course';
import { User } from '@/types/auth';
import { createClient } from '@/lib/supabase/client';
import { useAlert, useConfirm } from '@/components/ui/alert-modal';
import { OverviewTab } from '@/components/admin/OverviewTab';
import { UsersTab } from '@/components/admin/UsersTab';
import { CoursesTab } from '@/components/admin/CoursesTab';
import { CalendarTab } from '@/components/admin/CalendarTab';
import { ReportsTab } from '@/components/admin/ReportsTab';
import { SettingsTab } from '@/components/admin/SettingsTab';
import { createUserInAuth, updateUserPasswordInAuth } from './actions';
import { BookOpen } from 'lucide-react';

interface AdminDashboardClientProps {
    initialTab: string;
}

interface AuditLog {
    id: string;
    user_id: string;
    user_name: string;
    action: string;
    ip_address: string | null;
    created_at: string;
}

export default function AdminDashboardClient({
    initialTab,
}: AdminDashboardClientProps) {
    const { user } = useAuthStore();
    const adminName = user?.name || 'Prof. Hendra Wijaya';
    const { showError, showSuccess, AlertDialog } = useAlert();
    const { showConfirm, ConfirmDialog } = useConfirm();

    const supabase = createClient();
    const isSupabaseConfigured =
        !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
        process.env.NEXT_PUBLIC_SUPABASE_URL.startsWith('http');

    // Users state
    const [usersList, setUsersList] = useState<User[]>([]);
    const [usersLoading, setUsersLoading] = useState(true);

    // Courses state
    const [coursesList, setCoursesList] = useState<Course[]>([]);
    const [coursesPage, setCoursesPage] = useState(1);
    const [coursesSearchQuery, setCoursesSearchQuery] = useState('');
    const [coursesTotalCount, setCoursesTotalCount] = useState(0);
    const [coursesLoading, setCoursesLoading] = useState(false);
    const coursesPageSize = 10;

    // Students search & loading states
    const [studentsSearchQuery, setStudentsSearchQuery] = useState('');
    const [studentsLoading, setStudentsLoading] = useState(false);
    const [enrollmentStudents, setEnrollmentStudents] = useState<User[]>([]);

    const [enrollments, setEnrollments] = useState<
        {
            courseId: string;
            studentId: string;
            studentName: string;
            nim: string;
        }[]
    >([]);

    // Events state
    const [eventsList, setEventsList] = useState<CalendarEvent[]>([]);

    // Settings state
    const [maintenanceMode, setMaintenanceMode] = useState(false);
    const [studentRegistration, setStudentRegistration] = useState(true);
    const [ldapSync, setLdapSync] = useState(true);

    // Audit logs
    const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
    const [auditLoading, setAuditLoading] = useState(true);

    const fetchData = useCallback(async () => {
        if (!isSupabaseConfigured) {
            setUsersList([]);
            setEnrollments([]);
            setEventsList([]);
            setAuditLogs([]);
            setUsersLoading(false);
            setAuditLoading(false);
            return;
        }

        try {
            // Fetch users
            const { data: userData, error: userError } = await supabase
                .from('users')
                .select('*')
                .order('name', { ascending: true });
            if (userError) throw userError;
            const fetchedUsers = userData || [];
            setUsersList(fetchedUsers);

            // Fetch enrollments — join with users for name & nim
            const { data: enrollmentData, error: enrollmentError } =
                await supabase
                    .from('enrollments')
                    .select(
                        `
                    id,
                    class_id,
                    student_id,
                    users (
                        name,
                        nim_nip
                    )
                `,
                    )
                    .eq('status', 'active');
            if (enrollmentError) throw enrollmentError;
            setEnrollments(
                (enrollmentData || []).map((enr: any) => ({
                    courseId: enr.class_id,
                    studentId: enr.student_id,
                    studentName: enr.users?.name || '',
                    nim: enr.users?.nim_nip || '-',
                })),
            );

            // Fetch calendar events
            const { data: eventData, error: eventError } = await supabase
                .from('calendar_events')
                .select('*')
                .order('date', { ascending: true });
            if (eventError) throw eventError;
            setEventsList(
                (eventData || []).map((evt: any) => ({
                    id: evt.id,
                    title: evt.title,
                    date: evt.date,
                    type: evt.type,
                    courseId: evt.class_id || undefined,
                })),
            );

            // Fetch audit logs
            const { data: logData, error: logError } = await supabase
                .from('audit_logs')
                .select('*')
                .order('created_at', { ascending: false });
            if (logError) throw logError;
            const userMap = new Map(
                fetchedUsers.map((u: User) => [u.id, u.name]),
            );
            setAuditLogs(
                (logData || []).map((log: any) => ({
                    id: log.id,
                    user_id: log.user_id || '',
                    user_name:
                        log.user_name || userMap.get(log.user_id) || 'Unknown',
                    action: log.action,
                    ip_address: log.ip_address,
                    created_at: log.created_at,
                })),
            );
        } catch (err: any) {
            console.error('Gagal mengambil data:', err.message);
        } finally {
            setUsersLoading(false);
            setAuditLoading(false);
        }
    }, [isSupabaseConfigured, supabase]);

    // Fetch classes/courses page
    const fetchCoursesPage = useCallback(
        async (page: number, search: string) => {
            if (!isSupabaseConfigured) {
                setCoursesList([]);
                setCoursesTotalCount(0);
                return;
            }
            setCoursesLoading(true);
            try {
                const from = (page - 1) * coursesPageSize;
                const to = from + coursesPageSize - 1;

                let query = supabase.from('classes').select(
                    `
                        id,
                        class_name,
                        semester,
                        status,
                        courses!inner (
                            id,
                            name,
                            code,
                            sks,
                            teori,
                            praktek,
                            description
                        ),
                        users (
                            name
                        )
                        `,
                    { count: 'exact' },
                );

                if (search.trim()) {
                    const s = `%${search.trim()}%`;
                    query = query.or(
                        `class_name.ilike.${s},courses.name.ilike.${s},courses.code.ilike.${s}`,
                    );
                }

                const { data, error, count } = await query
                    .order('created_at', { ascending: false })
                    .range(from, to);

                if (error) throw error;

                setCoursesList(
                    (data || []).map((cls: any) => ({
                        id: cls.id,
                        name: cls.courses?.name || '',
                        code: cls.courses?.code || '',
                        class_name: cls.class_name,
                        semester: cls.semester,
                        sks: cls.courses?.sks || 0,
                        teori: cls.courses?.teori,
                        praktek: cls.courses?.praktek,
                        lecturer: cls.users?.name || '-',
                        description: cls.courses?.description || '',
                        status: cls.status,
                        icon: BookOpen,
                    })),
                );
                setCoursesTotalCount(count || 0);
            } catch (err: any) {
                console.error('Gagal mengambil data kelas:', err.message);
            } finally {
                setCoursesLoading(false);
            }
        },
        [isSupabaseConfigured, supabase],
    );

    // Fetch students list for enrollment search
    const fetchStudents = useCallback(
        async (search: string) => {
            if (!isSupabaseConfigured) {
                setEnrollmentStudents(
                    usersList.filter((u) => u.role === 'mahasiswa'),
                );
                return;
            }
            setStudentsLoading(true);
            try {
                let query = supabase
                    .from('users')
                    .select('id, name, email, nim_nip, role')
                    .eq('role', 'mahasiswa')
                    .order('name', { ascending: true })
                    .limit(50);

                if (search.trim()) {
                    const s = `%${search.trim()}%`;
                    query = query.or(`name.ilike.${s},nim_nip.ilike.${s}`);
                }

                const { data, error } = await query;
                if (error) throw error;

                setEnrollmentStudents(data || []);
            } catch (err: any) {
                console.error('Gagal mengambil data mahasiswa:', err.message);
            } finally {
                setStudentsLoading(false);
            }
        },
        [isSupabaseConfigured, supabase, usersList],
    );

    // Initial load
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Load classes dynamically when page/search query changes
    useEffect(() => {
        fetchCoursesPage(coursesPage, coursesSearchQuery);
    }, [coursesPage, coursesSearchQuery, fetchCoursesPage]);

    // Load students dynamically when search query changes
    useEffect(() => {
        fetchStudents(studentsSearchQuery);
    }, [studentsSearchQuery, fetchStudents]);

    const logAction = useCallback(
        async (action: string) => {
            if (!isSupabaseConfigured) return;
            try {
                const adminUser = usersList.find((u) => u.id === user?.id);
                await supabase.from('audit_logs').insert({
                    user_name: adminUser?.name || user?.name || 'Admin',
                    action,
                    ip_address: '',
                });
            } catch {
                // silent fail untuk audit log
            }
        },
        [isSupabaseConfigured, supabase, user, usersList],
    );

    // Stats
    const totalUsersCount = usersList.length;
    const mahasiswaCount = usersList.filter(
        (u) => u.role === 'mahasiswa',
    ).length;
    const dosenCount = usersList.filter((u) => u.role === 'dosen').length;
    const staffCount = usersList.filter(
        (u) => u.role === 'tu' || u.role === 'admin',
    ).length;

    const handleAddUser = async (data: {
        name: string;
        email: string;
        role: User['role'];
        nim_nip: string;
    }) => {
        if (!isSupabaseConfigured) {
            const newUser: User = {
                id: `${data.role.toUpperCase()}-${Date.now()}`,
                ...data,
            };
            setUsersList((prev) => [newUser, ...prev]);
            return;
        }
        try {
            await createUserInAuth(data);
            await fetchData();
            await logAction(
                `Mendaftarkan user baru: ${data.name} (${data.email})`,
            );
        } catch (err: any) {
            showError('Gagal mendaftarkan user: ' + err.message);
        }
    };

    const handleUpdateUser = async (
        id: string,
        data: {
            name: string;
            email: string;
            role: User['role'];
            nim_nip: string;
            password?: string;
        },
    ) => {
        if (!isSupabaseConfigured) {
            setUsersList((prev) =>
                prev.map((u) => (u.id === id ? { ...u, ...data } : u)),
            );
            return;
        }
        try {
            const updates: Record<string, any> = {
                name: data.name,
                email: data.email,
                role: data.role,
                nim_nip: data.nim_nip,
            };
            if (data.password && data.password.trim().length >= 6) {
                await updateUserPasswordInAuth(id, data.password.trim());
            }
            const { error } = await supabase
                .from('users')
                .update(updates)
                .eq('id', id);
            if (error) throw error;
            await fetchData();
            await logAction(
                `Memperbarui data user: ${data.name} (${data.email})`,
            );
        } catch (err: any) {
            showError('Gagal memperbarui user: ' + err.message);
        }
    };

    const handleDeleteUser = async (id: string) => {
        const userToDelete = usersList.find((u) => u.id === id);
        const userIdentifier = userToDelete
            ? `${userToDelete.name} (${userToDelete.email})`
            : `ID: ${id}`;

        if (!isSupabaseConfigured) {
            setUsersList((prev) => prev.filter((u) => u.id !== id));
            return;
        }
        try {
            const { error } = await supabase
                .from('users')
                .delete()
                .eq('id', id);
            if (error) throw error;
            await logAction(`Menghapus user: ${userIdentifier}`);
            await fetchData();
        } catch (err: any) {
            showError('Gagal menghapus user: ' + err.message);
        }
    };

    const handleAddEvent = async (data: {
        title: string;
        date: string;
        type: 'exam' | 'task' | 'academic';
    }) => {
        if (!isSupabaseConfigured) {
            const newEvt: CalendarEvent = { id: `EVT-${Date.now()}`, ...data };
            setEventsList((prev) => [newEvt, ...prev]);
            return;
        }
        try {
            const { error } = await supabase.from('calendar_events').insert({
                title: data.title,
                date: data.date,
                type: data.type,
            });
            if (error) throw error;
            await logAction(`Menambahkan agenda: ${data.title}`);
            await fetchData();
        } catch (err: any) {
            showError('Gagal menambahkan agenda: ' + err.message);
        }
    };

    const handleDeleteEvent = async (id: string) => {
        const eventToDelete = eventsList.find((e) => e.id === id);
        const eventTitle = eventToDelete ? eventToDelete.title : `ID: ${id}`;

        if (!isSupabaseConfigured) {
            setEventsList((prev) => prev.filter((e) => e.id !== id));
            return;
        }
        try {
            const { error } = await supabase
                .from('calendar_events')
                .delete()
                .eq('id', id);
            if (error) throw error;
            await logAction(`Menghapus agenda: ${eventTitle}`);
            await fetchData();
        } catch (err: any) {
            showError('Gagal menghapus agenda: ' + err.message);
        }
    };

    const handleExportReport = (reportType: string) => {
        showSuccess(
            `Berkas PDF/CSV siap diunduh secara otomatis.`,
            `Laporan [${reportType}] berhasil dibuat!`,
        );
        logAction(`Mengekspor laporan: ${reportType}`);
    };

    const handleAddCourse = async (data: {
        name: string;
        code: string;
        class_name: string;
        sks: number;
        lecturer: string;
    }) => {
        if (!isSupabaseConfigured) {
            const newCourse: Course = {
                id: `CS-${Date.now()}`,
                name: data.name,
                code: data.code,
                class_name: data.class_name,
                semester: 'Ganjil 2025/2026',
                sks: data.sks,
                teori: Math.min(data.sks, 2),
                praktek: Math.max(data.sks - 2, 0),
                lecturer: data.lecturer,
                description: `Mata kuliah ${data.name} kelas ${data.class_name} semester Ganjil.`,
                status: 'active',
                icon: BookOpen,
            };
            setCoursesList((prev) => [newCourse, ...prev]);
            return;
        }
        try {
            const lecturerUser = usersList.find(
                (u) =>
                    u.name.toLowerCase() === data.lecturer.toLowerCase() &&
                    u.role === 'dosen',
            );
            if (!lecturerUser) {
                showError('Dosen dengan nama tersebut tidak ditemukan');
                return;
            }

            const { data: existingCourse } = await supabase
                .from('courses')
                .select('id')
                .eq('code', data.code)
                .single();

            let courseId: string;
            if (existingCourse) {
                courseId = existingCourse.id;
            } else {
                const { data: kurikulum } = await supabase
                    .from('kurikulum')
                    .select('id')
                    .eq('is_active', true)
                    .limit(1)
                    .single();

                const { data: newCourse, error: courseError } = await supabase
                    .from('courses')
                    .insert({
                        name: data.name,
                        code: data.code,
                        sks: data.sks,
                        teori: Math.min(data.sks, 2),
                        praktek: Math.max(data.sks - 2, 0),
                        kurikulum_id: kurikulum?.id || null,
                        description: `Mata kuliah ${data.name}`,
                    })
                    .select('id')
                    .single();
                if (courseError) throw courseError;
                courseId = newCourse.id;
            }

            const { error: classError } = await supabase
                .from('classes')
                .insert({
                    course_id: courseId,
                    class_name: data.class_name,
                    semester: 'Ganjil 2025/2026',
                    lecturer_id: lecturerUser.id,
                    status: 'active',
                });
            if (classError) throw classError;

            await logAction(
                `Menambahkan kelas baru: ${data.name} (${data.code})`,
            );
            setCoursesPage(1);
            await fetchCoursesPage(1, coursesSearchQuery);
        } catch (err: any) {
            showError('Gagal menambahkan kelas: ' + err.message);
        }
    };

    const handleDeleteCourse = async (id: string) => {
        const courseToDelete = coursesList.find((c) => c.id === id);
        const courseName = courseToDelete
            ? `${courseToDelete.name} (${courseToDelete.class_name})`
            : `ID: ${id}`;

        if (!isSupabaseConfigured) {
            setCoursesList((prev) => prev.filter((c) => c.id !== id));
            setEnrollments((prev) => prev.filter((e) => e.courseId !== id));
            return;
        }
        try {
            const { error } = await supabase
                .from('classes')
                .delete()
                .eq('id', id);
            if (error) throw error;
            await logAction(`Menghapus kelas: ${courseName}`);
            await fetchCoursesPage(coursesPage, coursesSearchQuery);
        } catch (err: any) {
            showError('Gagal menghapus kelas: ' + err.message);
        }
    };

    const handleEnrollStudent = async (courseId: string, studentId: string) => {
        const student = usersList.find((u) => u.id === studentId);
        if (!student) return;

        const course = coursesList.find((c) => c.id === courseId);
        const courseName = course
            ? `${course.name} (${course.class_name})`
            : courseId;

        if (!isSupabaseConfigured) {
            setEnrollments((prev) => [
                ...prev,
                {
                    courseId,
                    studentId,
                    studentName: student.name,
                    nim: student.nim_nip || '-',
                },
            ]);
            return;
        }
        try {
            const { error } = await supabase.from('enrollments').insert({
                student_id: studentId,
                class_id: courseId,
                status: 'active',
            });
            if (error) throw error;
            await logAction(
                `Mendaftarkan mahasiswa ${student.name} ke kelas ${courseName}`,
            );
            await fetchData();
        } catch (err: any) {
            showError('Gagal mendaftarkan mahasiswa: ' + err.message);
        }
    };

    const handleUnenrollStudent = async (
        courseId: string,
        studentId: string,
    ) => {
        const student = usersList.find((u) => u.id === studentId);
        const course = coursesList.find((c) => c.id === courseId);
        const studentName = student ? student.name : studentId;
        const courseName = course
            ? `${course.name} (${course.class_name})`
            : courseId;

        if (!isSupabaseConfigured) {
            setEnrollments((prev) =>
                prev.filter(
                    (e) =>
                        !(e.courseId === courseId && e.studentId === studentId),
                ),
            );
            return;
        }
        try {
            const { error } = await supabase
                .from('enrollments')
                .delete()
                .match({ student_id: studentId, class_id: courseId });
            if (error) throw error;
            await logAction(
                `Mengeluarkan mahasiswa ${studentName} dari kelas ${courseName}`,
            );
            await fetchData();
        } catch (err: any) {
            showError('Gagal mengeluarkan mahasiswa: ' + err.message);
        }
    };

    return (
        <div className="space-y-6">
            {AlertDialog}
            {ConfirmDialog}

            {initialTab === 'overview' && (
                <OverviewTab
                    adminName={adminName}
                    totalUsersCount={totalUsersCount}
                    mahasiswaCount={mahasiswaCount}
                    dosenCount={dosenCount}
                    staffCount={staffCount}
                    studentRegistration={studentRegistration}
                    auditLogs={auditLogs}
                    auditLoading={auditLoading}
                />
            )}

            {initialTab === 'courses' && (
                <CoursesTab
                    courses={coursesList}
                    students={enrollmentStudents}
                    enrollments={enrollments}
                    onAddCourse={handleAddCourse}
                    onDeleteCourse={handleDeleteCourse}
                    onEnrollStudent={handleEnrollStudent}
                    onUnenrollStudent={handleUnenrollStudent}
                    showSuccess={showSuccess}
                    showConfirm={showConfirm}
                    coursesTotalCount={coursesTotalCount}
                    coursesCurrentPage={coursesPage}
                    coursesPageSize={coursesPageSize}
                    onCoursesPageChange={setCoursesPage}
                    coursesLoading={coursesLoading}
                    initialCourseSearch={coursesSearchQuery}
                    onCourseSearchChange={setCoursesSearchQuery}
                    studentsLoading={studentsLoading}
                    onStudentSearchChange={setStudentsSearchQuery}
                />
            )}

            {initialTab === 'users' && (
                <UsersTab
                    usersList={usersList}
                    usersLoading={usersLoading}
                    currentUserId={user?.id}
                    showError={showError}
                    showSuccess={showSuccess}
                    showConfirm={showConfirm}
                    onAddUser={handleAddUser}
                    onUpdateUser={handleUpdateUser}
                    onDeleteUser={handleDeleteUser}
                />
            )}

            {initialTab === 'calendar' && (
                <CalendarTab
                    eventsList={eventsList}
                    onAddEvent={handleAddEvent}
                    onDeleteEvent={handleDeleteEvent}
                />
            )}

            {initialTab === 'reports' && (
                <ReportsTab onExport={handleExportReport} />
            )}

            {initialTab === 'settings' && (
                <SettingsTab
                    maintenanceMode={maintenanceMode}
                    studentRegistration={studentRegistration}
                    ldapSync={ldapSync}
                    onChangeMaintenance={setMaintenanceMode}
                    onChangeRegistration={setStudentRegistration}
                    onChangeLdap={setLdapSync}
                />
            )}
        </div>
    );
}
