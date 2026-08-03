'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Users, Activity, Terminal, Shield, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { exportToCsv } from '@/lib/export-csv';

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
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);

    const totalCount = auditLogs.length;
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
    const page = Math.min(currentPage, totalPages);
    const startIndex = (page - 1) * pageSize;
    const currentLogs = auditLogs.slice(startIndex, startIndex + pageSize);

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
                <div className="flex items-center justify-between">
                    <h3 className="text-[15px] font-bold text-ink flex items-center gap-2">
                        <Terminal size={17} className="text-muted" /> Log Aktivitas
                        Sistem (Audit Logs)
                    </h3>
                    <button
                        onClick={() =>
                            exportToCsv(
                                `audit_logs_${new Date().toISOString().split('T')[0]}.csv`,
                                [
                                    { key: 'created_at', label: 'Waktu' },
                                    { key: 'user_name', label: 'Pengguna' },
                                    { key: 'action', label: 'Aksi / Aktivitas' },
                                    { key: 'ip_address', label: 'Alamat IP' },
                                ],
                                auditLogs as unknown as Record<string, unknown>[],
                            )
                        }
                        disabled={auditLogs.length === 0}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-surface text-[12px] font-semibold text-ink hover:bg-surface2 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                        <Download size={14} /> Ekspor CSV
                    </button>
                </div>
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
                                    currentLogs.map((log) => (
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

                    {!auditLoading && totalCount > 0 && (
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border bg-surface2/40 px-4 py-3 text-[12px] text-muted">
                            <div className="flex items-center gap-2">
                                <span>Baris per halaman:</span>
                                <select
                                    value={pageSize}
                                    onChange={(e) => {
                                        setPageSize(Number(e.target.value));
                                        setCurrentPage(1);
                                    }}
                                    className="rounded border border-border bg-surface px-2 py-1 text-[12px] text-ink focus:outline-none focus:ring-1 focus:ring-iris-500"
                                >
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                    <option value={50}>50</option>
                                </select>
                                <span className="ml-2">
                                    Menampilkan {startIndex + 1}–
                                    {Math.min(startIndex + pageSize, totalCount)}{' '}
                                    dari {totalCount} log
                                </span>
                            </div>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() =>
                                        setCurrentPage((p) => Math.max(1, p - 1))
                                    }
                                    disabled={page === 1}
                                    className="flex items-center justify-center size-7 rounded border border-border bg-surface text-ink hover:bg-surface2 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                    title="Halaman Sebelumnya"
                                >
                                    <ChevronLeft size={15} />
                                </button>
                                <span className="px-2 font-medium text-ink">
                                    Halaman {page} dari {totalPages}
                                </span>
                                <button
                                    onClick={() =>
                                        setCurrentPage((p) =>
                                            Math.min(totalPages, p + 1),
                                        )
                                    }
                                    disabled={page === totalPages}
                                    className="flex items-center justify-center size-7 rounded border border-border bg-surface text-ink hover:bg-surface2 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                    title="Halaman Selanjutnya"
                                >
                                    <ChevronRight size={15} />
                                </button>
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </>
    );
}
