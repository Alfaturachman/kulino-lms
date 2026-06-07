'use client';

import { useState } from 'react';
import { GraduationCap, Presentation, Building2, CheckCircle2 } from 'lucide-react';

const tabsData = [
    {
        id: 'mahasiswa',
        label: 'Mahasiswa',
        icon: GraduationCap,
        title: 'Dashboard Mahasiswa',
        desc: 'Antarmuka terpusat untuk mengakses kelas, melacak progres materi mingguan, dan melihat umpan balik nilai secara instan.',
        features: [
            'Progres perkuliahan visual mingguan',
            'Daftar tugas mendatang dengan pengingat tenggat',
            'Grafik tren keaktifan akademik',
            'Unggah berkas tugas dengan aman dan terenkripsi'
        ],
        preview: {
            title: 'Analisis Algoritma - A11.4302',
            sub: 'Minggu 8: Dynamic Programming',
            progress: 75,
            tasks: [
                { name: 'Tugas Mandiri 3', date: 'Hari Ini, 23:59', status: 'Selesai' },
                { name: 'Kuis Tengah Semester', date: 'Besok, 10:00', status: 'Mendatang' }
            ]
        }
    },
    {
        id: 'dosen',
        label: 'Dosen',
        icon: Presentation,
        title: 'Portal Pengajar',
        desc: 'Alat bantu terintegrasi untuk menyusun materi, mendistribusikan kuis, dan memberikan penilaian secara transparan.',
        features: [
            'Pembuat silabus & modul drag-and-drop',
            'Pemeriksaan tugas dengan kriteria penilaian dinamis',
            'Statistik keaktifan dan kehadiran mahasiswa',
            'Penjadwalan otomatis kuis interaktif'
        ],
        preview: {
            title: 'Basis Data Terdistribusi - Kelas A',
            sub: 'Menunggu Penilaian: 14 Mahasiswa',
            progress: 88,
            tasks: [
                { name: 'Tugas Kelompok 2', date: 'Perlu Nilai: 8', status: 'Evaluasi' },
                { name: 'Ujian Praktikum SQL', date: 'Perlu Nilai: 6', status: 'Evaluasi' }
            ]
        }
    },
    {
        id: 'staf',
        label: 'Administrator & Staf',
        icon: Building2,
        title: 'Pusat Manajemen Sistem',
        desc: 'Sistem tata kelola untuk mengawasi integrasi data akademik, akun pengguna, dan konfigurasi server universitas.',
        features: [
            'Sinkronisasi server SSO / LDAP terpusat',
            'Manajemen katalog program studi dan mata kuliah',
            'Pemantauan utilisasi server platform real-time',
            'Manajemen akses berbasis peran (RBAC)'
        ],
        preview: {
            title: 'Sistem Otentikasi Terpusat (LDAP)',
            sub: 'Status Sinkronisasi: Sukses (12.420 Akun)',
            progress: 100,
            tasks: [
                { name: 'Sinkronisasi SIAKAD', date: 'Terakhir: 2 jam lalu', status: 'Sinkron' },
                { name: 'Audit Log Akses', date: 'Bersih - No Issues', status: 'Aktif' }
            ]
        }
    }
];

export function LandingTabsShowcase() {
    const [activeTab, setActiveTab] = useState('mahasiswa');
    const activeData = tabsData.find(t => t.id === activeTab) || tabsData[0];

    return (
        <section className="py-24 bg-surface border-t border-border">
            <div className="mx-auto max-w-[1200px] px-6">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <span className="inline-block rounded-full bg-iris-500/10 text-iris-600 px-4 py-1.5 text-[12px] font-semibold mb-4">
                        Pilih Mode Akses
                    </span>
                    <h2 className="text-[32px] font-bold text-ink tracking-tight mb-4">
                        Satu Platform, Tiga Antarmuka Khusus
                    </h2>
                    <p className="text-[16px] text-muted leading-relaxed">
                        KULINO menyesuaikan seluruh fungsionalitas dan dasbor berdasarkan peran Anda di lingkungan akademik.
                    </p>
                </div>

                {/* Tab Navigation */}
                <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-12 border-b border-border md:justify-center -mx-6 px-6 md:mx-0 md:px-0 scrollbar-none [&::-webkit-scrollbar]:hidden">
                    {tabsData.map(tab => {
                        const Icon = tab.icon;
                        const isActive = tab.id === activeTab;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-2.5 md:px-6 md:py-3 rounded-lg text-[13px] md:text-[14px] font-semibold transition-all shrink-0 ${
                                    isActive
                                        ? 'bg-ink text-surface shadow-md'
                                        : 'text-muted hover:text-ink hover:bg-surface2/50'
                                }`}
                            >
                                <Icon size={16} className="shrink-0" />
                                <span className="whitespace-nowrap">{tab.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Tab Content Panel */}
                <div className="grid lg:grid-cols-12 gap-12 items-center">
                    {/* Left: Info */}
                    <div className="lg:col-span-5 space-y-6">
                        <h3 className="text-[24px] font-bold text-ink tracking-tight">
                            {activeData.title}
                        </h3>
                        <p className="text-[15px] text-muted leading-relaxed">
                            {activeData.desc}
                        </p>
                        <ul className="space-y-3 pt-2">
                            {activeData.features.map((f, i) => (
                                <li key={i} className="flex items-center gap-3 text-[14px] text-ink2">
                                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                                    <span>{f}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Right: Premium UI Showcase */}
                    <div className="lg:col-span-7 bg-surface2/50 border border-border p-4 sm:p-6 rounded-2xl shadow-inner relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-iris-500/5 rounded-full blur-2xl"></div>
                        <div className="bg-surface rounded-xl border border-border/80 shadow-md p-4 sm:p-5 relative z-10">
                            {/* Window bar */}
                            <div className="flex items-center justify-between mb-5 border-b border-border/50 pb-3">
                                <div className="flex gap-1.5">
                                    <span className="size-3 rounded-full bg-red-500/80"></span>
                                    <span className="size-3 rounded-full bg-amber-500/80"></span>
                                    <span className="size-3 rounded-full bg-emerald-500/80"></span>
                                </div>
                                <span className="text-[11px] font-mono text-muted">kulino.workspace.io</span>
                            </div>

                            {/* Inside UI mock */}
                            <div className="space-y-4">
                                <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:items-center">
                                    <div>
                                        <h4 className="text-[14px] font-bold text-ink leading-tight">{activeData.preview.title}</h4>
                                        <p className="text-[11px] text-muted mt-0.5">{activeData.preview.sub}</p>
                                    </div>
                                    <span className="text-[11px] sm:text-[12px] font-bold text-iris-600 bg-iris-500/10 px-2.5 py-1 rounded-full shrink-0">
                                        Progres: {activeData.preview.progress}%
                                    </span>
                                </div>

                                <div className="w-full bg-surface2 h-2 rounded-full overflow-hidden">
                                    <div
                                        className="bg-iris-500 h-full rounded-full transition-all duration-500"
                                        style={{ width: `${activeData.preview.progress}%` }}
                                    ></div>
                                </div>

                                <div className="pt-3 border-t border-border/50 space-y-3">
                                    <h5 className="text-[11px] uppercase tracking-wider font-semibold text-muted">
                                        Aktivitas Sistem Terjadwal
                                    </h5>
                                    {activeData.preview.tasks.map((task, i) => (
                                        <div key={i} className="flex justify-between items-center gap-3 bg-surface2/40 border border-border/50 rounded-lg p-3">
                                            <div className="min-w-0 flex-1">
                                                <p className="text-[13px] font-semibold text-ink truncate">{task.name}</p>
                                                <p className="text-[11px] text-muted mt-0.5 truncate">{task.date}</p>
                                            </div>
                                            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded shrink-0 ${
                                                task.status === 'Selesai' || task.status === 'Sinkron'
                                                    ? 'text-emerald-600 bg-emerald-500/10'
                                                    : 'text-amber-600 bg-amber-500/10'
                                            }`}>
                                                {task.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
