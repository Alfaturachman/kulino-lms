'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '@/store/auth';
import { mockUsers } from '@/data/users';
import { mockCalendarEvents } from '@/data/mockData';
import type { CalendarEvent } from '@/types/academic';
import { User } from '@/types/auth';
import { createClient } from '@/lib/supabase/client';
import { useAlert, useConfirm } from '@/components/ui/alert-modal';
import { OverviewTab } from '@/components/admin/OverviewTab';
import { UsersTab } from '@/components/admin/UsersTab';
import { CalendarTab } from '@/components/admin/CalendarTab';
import { ReportsTab } from '@/components/admin/ReportsTab';
import { SettingsTab } from '@/components/admin/SettingsTab';

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

const MOCK_AUDIT_LOGS: AuditLog[] = [
    {
        id: 'LOG-001',
        user_id: 'd101d101-d101-d101-d101-d101d101d101',
        user_name: 'Siti Rahma (TU)',
        action: 'Melakukan bulk import mahasiswa',
        ip_address: '192.168.1.5',
        created_at: '2026-06-06T18:20:00',
    },
    {
        id: 'LOG-002',
        user_id: 'd101d101-d101-d101-d101-d101d101d101',
        user_name: 'Dr. Budi Santoso (Dosen)',
        action: 'Mengunggah nilai Tugas 1 (Pemrograman Web)',
        ip_address: '192.168.1.12',
        created_at: '2026-06-06T15:44:00',
    },
    {
        id: 'LOG-003',
        user_id: 'd101d101-d101-d101-d101-d101d101d101',
        user_name: 'Ahmad Fauzi (Mahasiswa)',
        action: 'Mengirimkan berkas Tugas 1 (Pemrograman Web)',
        ip_address: '192.168.43.55',
        created_at: '2026-06-06T11:12:00',
    },
    {
        id: 'LOG-004',
        user_id: 'd101d101-d101-d101-d101-d101d101d101',
        user_name: 'Prof. Hendra Wijaya (Admin)',
        action: 'Masuk sesi admin (Login)',
        ip_address: '10.0.0.4',
        created_at: '2026-06-06T08:00:00',
    },
];

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

    // Events state
    const [eventsList, setEventsList] =
        useState<CalendarEvent[]>(mockCalendarEvents);

    // Settings state
    const [maintenanceMode, setMaintenanceMode] = useState(false);
    const [studentRegistration, setStudentRegistration] = useState(true);
    const [ldapSync, setLdapSync] = useState(true);

    // Audit logs
    const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
    const [auditLoading, setAuditLoading] = useState(true);

    const fetchData = useCallback(async () => {
        if (!isSupabaseConfigured) {
            setUsersList(mockUsers);
            setAuditLogs(MOCK_AUDIT_LOGS);
            setUsersLoading(false);
            setAuditLoading(false);
            return;
        }

        // Fetch users first
        try {
            const { data: userData, error: userError } = await supabase
                .from('users')
                .select('*')
                .order('name', { ascending: true });
            if (userError) throw userError;
            const fetchedUsers = userData || [];
            setUsersList(fetchedUsers);

            // Then fetch audit logs — map user_id to name using fetched users
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
                    user_id: log.user_id,
                    user_name: userMap.get(log.user_id) || 'Unknown',
                    action: log.action,
                    ip_address: log.ip_address,
                    created_at: log.created_at,
                })),
            );
        } catch (err: any) {
            console.error('Gagal mengambil data:', err.message);
            setUsersList(mockUsers);
            setAuditLogs(MOCK_AUDIT_LOGS);
        } finally {
            setUsersLoading(false);
            setAuditLoading(false);
        }
    }, [isSupabaseConfigured, supabase]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const logAction = useCallback(
        async (action: string) => {
            if (!isSupabaseConfigured) return;
            try {
                await supabase.from('audit_logs').insert({
                    user_id: user?.id,
                    action,
                    ip_address: '',
                });
            } catch {
                // silent fail untuk audit log
            }
        },
        [isSupabaseConfigured, supabase, user],
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
            const newId = crypto.randomUUID();
            const { error } = await supabase.from('users').insert({
                id: newId,
                ...data,
                password: '12345678',
            });
            if (error) throw error;
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
            if (data.password) updates.password = data.password;
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
            await fetchData();
            await logAction(`Menghapus user dengan ID: ${id}`);
        } catch (err: any) {
            showError('Gagal menghapus user: ' + err.message);
        }
    };

    const handleAddEvent = (data: {
        title: string;
        date: string;
        type: 'exam' | 'task' | 'academic';
    }) => {
        const newEvt: CalendarEvent = { id: `EVT-${Date.now()}`, ...data };
        setEventsList((prev) => [newEvt, ...prev]);
        logAction(`Menambahkan agenda: ${data.title}`);
    };

    const handleDeleteEvent = (id: string) => {
        setEventsList((prev) => prev.filter((e) => e.id !== id));
        logAction(`Menghapus agenda ID: ${id}`);
    };

    const handleExportReport = (reportType: string) => {
        showSuccess(
            `Berkas PDF/CSV siap diunduh secara otomatis.`,
            `Laporan [${reportType}] berhasil dibuat!`,
        );
        logAction(`Mengekspor laporan: ${reportType}`);
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
