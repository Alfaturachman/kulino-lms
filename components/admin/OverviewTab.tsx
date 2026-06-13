'use client';

import { Card } from '@/components/ui/card';
import { Users, Activity, Terminal, Shield } from 'lucide-react';

interface AuditLog {
    id: string;
    user_id: string;
    user_name: string;
    action: string;
    ip_address: string | null;
    created_at: string;
}

interface OverviewTabProps {
    adminName: string;
    totalUsersCount: number;
    mahasiswaCount: number;
    dosenCount: number;
    staffCount: number;
    studentRegistration: boolean;
    auditLogs: AuditLog[];
    auditLoading: boolean;
}

function formatDate(dateStr: string) {
    try {
        const d = new Date(dateStr);
        return d.toLocaleString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    } catch {
        return dateStr;
    }
}

export function OverviewTab({
    adminName,
    totalUsersCount,
    mahasiswaCount,
    dosenCount,
    staffCount,
    studentRegistration,
    auditLogs,
    auditLoading,
}: OverviewTabProps) {
    return (
        <>
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
                        <span className="text-2xl font-bold text-ink">12%</span>
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

            <div className="space-y-4">
                <h3 className="text-[15px] font-bold text-ink flex items-center gap-2">
                    <Terminal size={17} className="text-muted" /> Log Aktivitas
                    Sistem (Audit Logs)
                </h3>
                <Card className="overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-[12px] border-collapse">
                            <thead>
                                <tr className="border-b border-border text-muted font-bold bg-surface2/60">
                                    <th className="p-3">Waktu</th>
                                    <th className="p-3">Pengguna</th>
                                    <th className="p-3">Aksi / Aktivitas</th>
                                    <th className="p-3 text-right">
                                        Alamat IP
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/60 font-mono">
                                {auditLoading ? (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="p-6 text-center text-[13px] text-muted"
                                        >
                                            Memuat log aktivitas...
                                        </td>
                                    </tr>
                                ) : auditLogs.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="p-6 text-center text-[13px] text-muted"
                                        >
                                            Belum ada aktivitas tercatat.
                                        </td>
                                    </tr>
                                ) : (
                                    auditLogs.map((log) => (
                                        <tr
                                            key={log.id}
                                            className="hover:bg-surface2/30"
                                        >
                                            <td className="p-3 text-muted">
                                                {formatDate(log.created_at)}
                                            </td>
                                            <td className="p-3 text-ink font-semibold">
                                                {log.user_name}
                                            </td>
                                            <td className="p-3 text-ink2">
                                                {log.action}
                                            </td>
                                            <td className="p-3 text-right text-muted">
                                                {log.ip_address || '-'}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </>
    );
}
