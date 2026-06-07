'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/auth';
import { mockUsers } from '@/data/users';
import { mockCalendarEvents } from '@/data/mockData';
import type { CalendarEvent } from '@/types/academic';
import { User, Role } from '@/types/auth';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Users,
    Shield,
    Activity,
    Calendar as CalendarIcon,
    Plus,
    Trash,
    Search,
    CheckCircle,
    FileText,
    AlertCircle,
    Settings,
    Terminal,
    Download,
    Info,
} from 'lucide-react';

interface AdminDashboardClientProps {
    initialTab: string;
}

interface AuditLog {
    id: string;
    timestamp: string;
    user: string;
    action: string;
    ip: string;
}

export default function AdminDashboardClient({
    initialTab,
}: AdminDashboardClientProps) {
    const { user } = useAuthStore();
    const adminName = user?.name || 'Prof. Hendra Wijaya';

    // System Users state CRUD
    const [usersList, setUsersList] = useState<User[]>([
        ...mockUsers,
        {
            id: 'STU-002',
            name: 'Citra Kirana',
            email: 'citra@mhs.dinus.ac.id',
            role: 'mahasiswa',
            nim_nip: '220102002',
        },
        {
            id: 'STU-003',
            name: 'Bima Sakti',
            email: 'bima@mhs.dinus.ac.id',
            role: 'mahasiswa',
            nim_nip: '220102005',
        },
        {
            id: 'STU-004',
            name: 'Dewi Ayu',
            email: 'dewi@mhs.dinus.ac.id',
            role: 'mahasiswa',
            nim_nip: '220102078',
        },
        {
            id: 'STU-005',
            name: 'Galih Prasetya',
            email: 'galih@mhs.dinus.ac.id',
            role: 'mahasiswa',
            nim_nip: '220102044',
        },
    ]);

    // System events calendar CRUD
    const [eventsList, setEventsList] =
        useState<CalendarEvent[]>(mockCalendarEvents);

    // Search/Filters
    const [userSearch, setUserSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState<Role | 'all'>('all');

    // User form states
    const [showAddUser, setShowAddUser] = useState(false);
    const [uName, setUName] = useState('');
    const [uEmail, setUEmail] = useState('');
    const [uRole, setURole] = useState<Role>('mahasiswa');
    const [uNimNip, setUNimNip] = useState('');
    const [uPhone, setUPhone] = useState('');
    const [userSuccessMessage, setUserSuccessMessage] = useState('');

    // Calendar form states
    const [evtTitle, setEvtTitle] = useState('');
    const [evtDate, setEvtDate] = useState('2026-07-01T08:00');
    const [evtType, setEvtType] = useState<'exam' | 'task' | 'academic'>(
        'academic',
    );
    const [evtSuccessMessage, setEvtSuccessMessage] = useState('');

    // Audit Logs mock list
    const [auditLogs] = useState<AuditLog[]>([
        {
            id: 'LOG-001',
            timestamp: '2026-06-06 18:20',
            user: 'Siti Rahma (TU)',
            action: 'Melakukan bulk import mahasiswa',
            ip: '192.168.1.5',
        },
        {
            id: 'LOG-002',
            timestamp: '2026-06-06 15:44',
            user: 'Dr. Budi Santoso (Dosen)',
            action: 'Mengunggah nilai Tugas 1 (Pemrograman Web)',
            ip: '192.168.1.12',
        },
        {
            id: 'LOG-003',
            timestamp: '2026-06-06 11:12',
            user: 'Ahmad Fauzi (Mahasiswa)',
            action: 'Mengirimkan berkas Tugas 1 (Pemrograman Web)',
            ip: '192.168.43.55',
        },
        {
            id: 'LOG-004',
            timestamp: '2026-06-06 08:00',
            user: 'Prof. Hendra Wijaya (Admin)',
            action: 'Masuk sesi admin (Login)',
            ip: '10.0.0.4',
        },
    ]);

    // System Settings states
    const [maintenanceMode, setMaintenanceMode] = useState(false);
    const [studentRegistration, setStudentRegistration] = useState(true);
    const [ldapSync, setLdapSync] = useState(true);

    // Stats
    const totalUsersCount = usersList.length;
    const mahasiswaCount = usersList.filter(
        (u) => u.role === 'mahasiswa',
    ).length;
    const dosenCount = usersList.filter((u) => u.role === 'dosen').length;
    const staffCount = usersList.filter(
        (u) => u.role === 'tu' || u.role === 'admin',
    ).length;

    const handleAddUser = (e: React.FormEvent) => {
        e.preventDefault();
        if (!uName || !uEmail || !uNimNip) return;

        const newUser: User = {
            id: `${uRole.toUpperCase()}-${Date.now()}`,
            name: uName,
            email: uEmail,
            role: uRole,
            nim_nip: uNimNip,
            phone: uPhone,
        };

        setUsersList((prev) => [newUser, ...prev]);
        setUName('');
        setUEmail('');
        setUNimNip('');
        setUPhone('');
        setUserSuccessMessage(`Registrasi akun untuk ${uName} berhasil!`);
        setTimeout(() => setUserSuccessMessage(''), 3000);
    };

    const handleAddEvent = (e: React.FormEvent) => {
        e.preventDefault();
        if (!evtTitle) return;

        const newEvt: CalendarEvent = {
            id: `EVT-${Date.now()}`,
            title: evtTitle,
            date: new Date(evtDate).toISOString(),
            type: evtType,
        };

        setEventsList((prev) => [newEvt, ...prev]);
        setEvtTitle('');
        setEvtSuccessMessage(
            'Agenda baru berhasil didaftarkan di kalender akademik!',
        );
        setTimeout(() => setEvtSuccessMessage(''), 3000);
    };

    const handleDeleteUser = (id: string) => {
        if (confirm('Apakah Anda yakin ingin menghapus akun pengguna ini?')) {
            setUsersList((prev) => prev.filter((u) => u.id !== id));
        }
    };

    const handleDeleteEvent = (id: string) => {
        setEventsList((prev) => prev.filter((e) => e.id !== id));
    };

    // Export reports mockup download
    const handleExportReport = (reportType: string) => {
        alert(
            `Laporan [${reportType}] berhasil dibuat!\nBerkas PDF/CSV siap diunduh secara otomatis.`,
        );
    };

    return (
        <div className="space-y-6">
            {/* Welcome Header */}
            {initialTab === 'overview' && (
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-iris-800 to-iris-600 p-6 text-white md:p-8">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                    <div className="relative z-10 space-y-2">
                        <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-[11px] font-semibold tracking-wide uppercase text-white/95">
                            Super Admin Console
                        </span>
                        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                            Selamat datang kembali, {adminName}!
                        </h1>
                        <p className="text-[13px] text-white/80 md:text-[14px]">
                            NIP: 197503121999031003 &bull; Administrator Utama
                            &bull; Universitas Dian Nuswantoro
                        </p>
                    </div>
                </div>
            )}

            {/* Stats row */}
            {initialTab === 'overview' && (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <Card className="flex flex-col justify-between p-5">
                        <span className="text-[12px] font-medium text-muted">
                            Total Pengguna
                        </span>
                        <div className="mt-2 flex items-baseline justify-between">
                            <span className="text-2xl font-bold text-ink">
                                {totalUsersCount}
                            </span>
                            <Users size={20} className="text-iris-500" />
                        </div>
                        <span className="mt-1 text-[10px] text-muted">
                            {mahasiswaCount} Mhs, {dosenCount} Dsn, {staffCount}{' '}
                            Staff
                        </span>
                    </Card>
                    <Card className="flex flex-col justify-between p-5">
                        <span className="text-[12px] font-medium text-muted">
                            Sesi Aktif
                        </span>
                        <div className="mt-2 flex items-baseline justify-between">
                            <span className="text-2xl font-bold text-success">
                                24
                            </span>
                            <Activity size={20} className="text-success" />
                        </div>
                        <span className="mt-1 text-[10px] text-muted">
                            Real-time di server
                        </span>
                    </Card>
                    <Card className="flex flex-col justify-between p-5">
                        <span className="text-[12px] font-medium text-muted">
                            Beban Sistem
                        </span>
                        <div className="mt-2 flex items-baseline justify-between">
                            <span className="text-2xl font-bold text-ink">
                                12%
                            </span>
                            <Terminal size={20} className="text-muted" />
                        </div>
                        <span className="mt-1 text-[10px] text-muted">
                            CPU & RAM status: Sehat
                        </span>
                    </Card>
                    <Card className="flex flex-col justify-between p-5">
                        <span className="text-[12px] font-medium text-muted">
                            Registrasi Akses
                        </span>
                        <div className="mt-2 flex items-baseline justify-between">
                            <span className="text-2xl font-bold text-ink">
                                {studentRegistration ? 'Buka' : 'Tutup'}
                            </span>
                            <Shield size={20} className="text-accent" />
                        </div>
                        <span className="mt-1 text-[10px] text-muted">
                            Status pendaftaran mandiri
                        </span>
                    </Card>
                </div>
            )}

            {/* Tab: Overview (System Audit Logs) */}
            {initialTab === 'overview' && (
                <div className="space-y-4">
                    <h3 className="text-[15px] font-bold text-ink flex items-center gap-2">
                        <Terminal size={17} className="text-muted" /> Log
                        Aktivitas Sistem (Audit Logs)
                    </h3>

                    <Card className="overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-[12px] border-collapse">
                                <thead>
                                    <tr className="border-b border-border text-muted font-bold bg-surface2/60">
                                        <th className="p-3">Waktu</th>
                                        <th className="p-3">Pengguna</th>
                                        <th className="p-3">
                                            Aksi / Aktivitas
                                        </th>
                                        <th className="p-3 text-right">
                                            Alamat IP
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/60 font-mono">
                                    {auditLogs.map((log) => (
                                        <tr
                                            key={log.id}
                                            className="hover:bg-surface2/30"
                                        >
                                            <td className="p-3 text-muted">
                                                {log.timestamp}
                                            </td>
                                            <td className="p-3 text-ink font-semibold">
                                                {log.user}
                                            </td>
                                            <td className="p-3 text-ink2">
                                                {log.action}
                                            </td>
                                            <td className="p-3 text-right text-muted">
                                                {log.ip}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            )}

            {/* Tab: Users CRUD */}
            {initialTab === 'users' && (
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* User Table (Left 2 columns) */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <h3 className="text-[15px] font-bold text-ink">
                                Seluruh Pengguna Sistem
                            </h3>

                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-2 bg-surface border border-border rounded-lg px-3 py-1.5 w-48">
                                    <Search
                                        size={14}
                                        className="text-muted shrink-0"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Cari user..."
                                        className="bg-transparent border-0 outline-none text-[12px] text-ink placeholder:text-muted w-full"
                                        value={userSearch}
                                        onChange={(e) =>
                                            setUserSearch(e.target.value)
                                        }
                                    />
                                </div>

                                <select
                                    value={roleFilter}
                                    onChange={(e) =>
                                        setRoleFilter(
                                            e.target.value as Role | 'all',
                                        )
                                    }
                                    className="h-9 border border-border rounded-lg px-2 text-[12px] bg-white outline-none"
                                >
                                    <option value="all">Semua Peran</option>
                                    <option value="mahasiswa">Mahasiswa</option>
                                    <option value="dosen">Dosen</option>
                                    <option value="tu">Tata Usaha</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                        </div>

                        <Card className="overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-[12px] border-collapse">
                                    <thead>
                                        <tr className="border-b border-border text-muted font-bold bg-surface2/60">
                                            <th className="p-3">
                                                Nama Lengkap
                                            </th>
                                            <th className="p-3">Email</th>
                                            <th className="p-3">Role</th>
                                            <th className="p-3">NIM / NIP</th>
                                            <th className="p-3 text-right">
                                                Tindakan
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/60">
                                        {usersList
                                            .filter((u) => {
                                                const matchesSearch =
                                                    u.name
                                                        .toLowerCase()
                                                        .includes(
                                                            userSearch.toLowerCase(),
                                                        ) ||
                                                    u.email
                                                        .toLowerCase()
                                                        .includes(
                                                            userSearch.toLowerCase(),
                                                        );
                                                const matchesRole =
                                                    roleFilter === 'all' ||
                                                    u.role === roleFilter;
                                                return (
                                                    matchesSearch && matchesRole
                                                );
                                            })
                                            .map((u) => (
                                                <tr
                                                    key={u.id}
                                                    className="hover:bg-surface2/30"
                                                >
                                                    <td className="p-3 font-bold text-ink">
                                                        {u.name}
                                                    </td>
                                                    <td className="p-3 text-ink2">
                                                        {u.email}
                                                    </td>
                                                    <td className="p-3">
                                                        <Badge
                                                            variant={
                                                                u.role ===
                                                                'admin'
                                                                    ? 'red'
                                                                    : u.role ===
                                                                        'dosen'
                                                                      ? 'blue'
                                                                      : u.role ===
                                                                          'tu'
                                                                        ? 'purple'
                                                                        : 'gray'
                                                            }
                                                        >
                                                            {u.role}
                                                        </Badge>
                                                    </td>
                                                    <td className="p-3 font-mono text-muted">
                                                        {u.nim_nip || '-'}
                                                    </td>
                                                    <td className="p-3 text-right">
                                                        {u.id !== user?.id ? (
                                                            <button
                                                                onClick={() =>
                                                                    handleDeleteUser(
                                                                        u.id,
                                                                    )
                                                                }
                                                                className="text-danger hover:underline font-bold text-[11px] cursor-pointer"
                                                            >
                                                                Hapus
                                                            </button>
                                                        ) : (
                                                            <span className="text-[10px] text-muted italic">
                                                                Self (Sesi
                                                                Aktif)
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </div>

                    {/* Add User (Right 1 column) */}
                    <Card className="p-5 h-fit space-y-4">
                        <h3 className="text-[13px] font-bold text-ink uppercase tracking-wider pb-2 border-b border-border">
                            Daftarkan Pengguna Baru
                        </h3>

                        {userSuccessMessage && (
                            <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-3 rounded-lg text-[12px] flex items-center gap-2">
                                <CheckCircle
                                    size={16}
                                    className="text-success"
                                />{' '}
                                {userSuccessMessage}
                            </div>
                        )}

                        <form onSubmit={handleAddUser} className="space-y-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="u-name">Nama Lengkap</Label>
                                <Input
                                    id="u-name"
                                    placeholder="Contoh: Prof. Dr. Ir. Gunawan"
                                    value={uName}
                                    onChange={(e) => setUName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="u-email">Email Utama</Label>
                                <Input
                                    id="u-email"
                                    type="email"
                                    placeholder="gunawan@dsn.dinus.ac.id"
                                    value={uEmail}
                                    onChange={(e) => setUEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <Label htmlFor="u-role">Peran (Role)</Label>
                                    <select
                                        id="u-role"
                                        value={uRole}
                                        onChange={(e) =>
                                            setURole(e.target.value as Role)
                                        }
                                        className="w-full h-10 border border-border rounded-lg px-3 py-2 text-[13px] bg-white outline-none focus:border-iris-500 focus:ring-3 focus:ring-iris-500/10"
                                    >
                                        <option value="mahasiswa">
                                            Mahasiswa
                                        </option>
                                        <option value="dosen">Dosen</option>
                                        <option value="tu">Tata Usaha</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="u-nim">NIM / NIP</Label>
                                    <Input
                                        id="u-nim"
                                        placeholder="198001012010..."
                                        value={uNimNip}
                                        onChange={(e) =>
                                            setUNimNip(e.target.value)
                                        }
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="u-phone">No Telepon</Label>
                                <Input
                                    id="u-phone"
                                    placeholder="081234567..."
                                    value={uPhone}
                                    onChange={(e) => setUPhone(e.target.value)}
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full gap-2 cursor-pointer"
                            >
                                <Plus size={15} /> Daftarkan Akun
                            </Button>
                        </form>
                    </Card>
                </div>
            )}

            {/* Tab: Calendar events CRUD */}
            {initialTab === 'calendar' && (
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Calendar events list */}
                    <div className="lg:col-span-2 space-y-4">
                        <h3 className="text-[15px] font-bold text-ink">
                            Kalender Akademik Terdaftar
                        </h3>

                        <Card className="overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-[12px] border-collapse">
                                    <thead>
                                        <tr className="border-b border-border text-muted font-bold bg-surface2/60">
                                            <th className="p-3">Tanggal</th>
                                            <th className="p-3">
                                                Nama Agenda / Kegiatan
                                            </th>
                                            <th className="p-3">Tipe</th>
                                            <th className="p-3 text-right">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/60">
                                        {eventsList.map((evt) => {
                                            const date = new Date(evt.date);
                                            return (
                                                <tr
                                                    key={evt.id}
                                                    className="hover:bg-surface2/30"
                                                >
                                                    <td className="p-3 font-mono font-semibold">
                                                        {date.toLocaleDateString(
                                                            'id-ID',
                                                            {
                                                                day: 'numeric',
                                                                month: 'long',
                                                                year: 'numeric',
                                                            },
                                                        )}
                                                    </td>
                                                    <td className="p-3 font-bold text-ink">
                                                        {evt.title}
                                                    </td>
                                                    <td className="p-3">
                                                        <Badge
                                                            variant={
                                                                evt.type ===
                                                                'exam'
                                                                    ? 'red'
                                                                    : evt.type ===
                                                                        'task'
                                                                      ? 'warn'
                                                                      : 'blue'
                                                            }
                                                        >
                                                            {evt.type}
                                                        </Badge>
                                                    </td>
                                                    <td className="p-3 text-right">
                                                        <button
                                                            onClick={() =>
                                                                handleDeleteEvent(
                                                                    evt.id,
                                                                )
                                                            }
                                                            className="text-danger hover:underline font-bold text-[11px] cursor-pointer"
                                                        >
                                                            Hapus
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </div>

                    {/* Add event form */}
                    <Card className="p-5 h-fit space-y-4">
                        <h3 className="text-[13px] font-bold text-ink uppercase tracking-wider pb-2 border-b border-border">
                            Tambah Agenda Akademik
                        </h3>

                        {evtSuccessMessage && (
                            <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-3 rounded-lg text-[12px] flex items-center gap-2">
                                <CheckCircle
                                    size={16}
                                    className="text-success"
                                />{' '}
                                {evtSuccessMessage}
                            </div>
                        )}

                        <form onSubmit={handleAddEvent} className="space-y-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="evt-name">Nama Agenda</Label>
                                <Input
                                    id="evt-name"
                                    placeholder="Contoh: Rapat Dosen Semester Genap"
                                    value={evtTitle}
                                    onChange={(e) =>
                                        setEvtTitle(e.target.value)
                                    }
                                    required
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="evt-type">Tipe Agenda</Label>
                                <select
                                    id="evt-type"
                                    value={evtType}
                                    onChange={(e) =>
                                        setEvtType(
                                            e.target.value as
                                                | 'exam'
                                                | 'task'
                                                | 'academic',
                                        )
                                    }
                                    className="w-full h-10 border border-border rounded-lg px-3 py-2 text-[13px] bg-white outline-none focus:border-iris-500 focus:ring-3 focus:ring-iris-500/10"
                                >
                                    <option value="academic">Akademik</option>
                                    <option value="exam">
                                        Ujian (UTS/UAS)
                                    </option>
                                    <option value="task">
                                        Batas Pengumpulan (Tenggat)
                                    </option>
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="evt-date">
                                    Waktu Pelaksanaan
                                </Label>
                                <Input
                                    id="evt-date"
                                    type="datetime-local"
                                    value={evtDate}
                                    onChange={(e) => setEvtDate(e.target.value)}
                                    required
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full gap-2 cursor-pointer"
                            >
                                <Plus size={15} /> Daftarkan Agenda
                            </Button>
                        </form>
                    </Card>
                </div>
            )}

            {/* Tab: Reports */}
            {initialTab === 'reports' && (
                <div className="space-y-6">
                    <h3 className="text-[15px] font-bold text-ink">
                        Pusat Laporan Akademik
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="p-6 space-y-4 flex flex-col justify-between">
                            <div>
                                <h4 className="text-[14px] font-bold text-ink leading-snug flex items-center gap-2">
                                    <FileText
                                        size={18}
                                        className="text-iris-500"
                                    />{' '}
                                    Laporan Indeks Nilai Mahasiswa (Gradebook)
                                </h4>
                                <p className="text-[12px] text-muted leading-relaxed mt-2">
                                    Ekspor rekapitulasi nilai mahasiswa di
                                    seluruh mata kuliah semester ini dalam
                                    format berkas PDF terstruktur untuk
                                    keperluan arsip fakultas.
                                </p>
                            </div>
                            <Button
                                onClick={() => handleExportReport('Gradebook')}
                                className="gap-2 w-full mt-4 cursor-pointer"
                            >
                                <Download size={14} /> Generate & Ekspor Laporan
                            </Button>
                        </Card>

                        <Card className="p-6 space-y-4 flex flex-col justify-between">
                            <div>
                                <h4 className="text-[14px] font-bold text-ink leading-snug flex items-center gap-2">
                                    <Activity
                                        size={18}
                                        className="text-success"
                                    />{' '}
                                    Laporan Statistik Penggunaan Server
                                </h4>
                                <p className="text-[12px] text-muted leading-relaxed mt-2">
                                    Unduh ringkasan log engagement mahasiswa,
                                    durasi sesi rata-rata, dan statistik lalu
                                    lintas request server KULINO.
                                </p>
                            </div>
                            <Button
                                onClick={() =>
                                    handleExportReport('Statistik Server')
                                }
                                className="gap-2 w-full mt-4 cursor-pointer"
                            >
                                <Download size={14} /> Generate & Ekspor Laporan
                            </Button>
                        </Card>
                    </div>
                </div>
            )}

            {/* Tab: Settings */}
            {initialTab === 'settings' && (
                <Card className="p-6 space-y-6">
                    <h3 className="text-[15px] font-bold text-ink border-b border-border pb-3">
                        Pengaturan Konfigurasi Sistem
                    </h3>

                    <div className="space-y-6">
                        {/* Setting item 1 */}
                        <div className="flex items-start justify-between gap-4">
                            <div className="space-y-1">
                                <Label className="text-[13px] font-bold text-ink">
                                    Mode Pemeliharaan (Maintenance Mode)
                                </Label>
                                <p className="text-[11px] text-muted max-w-lg leading-relaxed">
                                    Jika diaktifkan, pengguna umum (mahasiswa,
                                    dosen, TU) tidak dapat mengakses portal
                                    kuliner kecuali user dengan peran Super
                                    Admin.
                                </p>
                            </div>
                            <input
                                type="checkbox"
                                checked={maintenanceMode}
                                onChange={(e) =>
                                    setMaintenanceMode(e.target.checked)
                                }
                                className="size-5 text-iris-600 rounded border-border focus:ring-iris-500 cursor-pointer"
                            />
                        </div>

                        {/* Setting item 2 */}
                        <div className="flex items-start justify-between gap-4 border-t border-border pt-6">
                            <div className="space-y-1">
                                <Label className="text-[13px] font-bold text-ink">
                                    Pendaftaran Mandiri Mahasiswa
                                    (Self-Registration)
                                </Label>
                                <p className="text-[11px] text-muted max-w-lg leading-relaxed">
                                    Izinkan pengguna tamu untuk mendaftarkan
                                    akun baru secara mandiri melalui rute
                                    `/register`.
                                </p>
                            </div>
                            <input
                                type="checkbox"
                                checked={studentRegistration}
                                onChange={(e) =>
                                    setStudentRegistration(e.target.checked)
                                }
                                className="size-5 text-iris-600 rounded border-border focus:ring-iris-500 cursor-pointer"
                            />
                        </div>

                        {/* Setting item 3 */}
                        <div className="flex items-start justify-between gap-4 border-t border-border pt-6">
                            <div className="space-y-1">
                                <Label className="text-[13px] font-bold text-ink">
                                    Sinkronisasi Server LDAP Udinus
                                </Label>
                                <p className="text-[11px] text-muted max-w-lg leading-relaxed">
                                    Sinkronisasikan kredensial user, program
                                    studi, dan KRS secara berkala dengan server
                                    database pusat Universitas Dian Nuswantoro.
                                </p>
                            </div>
                            <input
                                type="checkbox"
                                checked={ldapSync}
                                onChange={(e) => setLdapSync(e.target.checked)}
                                className="size-5 text-iris-600 rounded border-border focus:ring-iris-500 cursor-pointer"
                            />
                        </div>
                    </div>
                </Card>
            )}
        </div>
    );
}
