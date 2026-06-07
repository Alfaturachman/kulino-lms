import Link from 'next/link';
import {
    BookOpen,
    FileText,
    FlaskConical,
    GraduationCap,
    Presentation,
    Building2,
    ArrowRight,
    Layout,
    Calendar,
    ChevronRight,
    LineChart,
    PlayCircle,
    MessageSquare,
    BarChart3,
    Bell,
    Users,
    Smartphone,
} from 'lucide-react';
import { LandingNavbar } from '@/components/landing-navbar';
import { LandingFooter } from '@/components/landing-footer';
import { LandingFAQ } from '@/components/landing-faq';
import { LandingTabsShowcase } from '@/components/landing-tabs-showcase';
import { LandingHowItWorks } from '@/components/landing-how-it-works';
import { LandingStats } from '@/components/landing-stats';
import { LandingTestimonials } from '@/components/landing-testimonials';

const features = [
    {
        icon: BookOpen,
        title: 'Materi Terstruktur',
        desc: 'Akses materi kuliah minggu demi minggu. Video, PDF, dan tautan bacaan di satu lokasi terpusat.',
    },
    {
        icon: FileText,
        title: 'Tugas & Penilaian',
        desc: 'Kumpulkan tugas secara online, pantau tenggat waktu yang ketat, dan lihat umpan balik nilai secara real-time.',
    },
    {
        icon: FlaskConical,
        title: 'Kuis & Ujian',
        desc: 'Evaluasi online yang aman dengan pengukur waktu presisi, pengumpulan otomatis, dan berbagai jenis soal.',
    },
    {
        icon: MessageSquare,
        title: 'Forum Diskusi',
        desc: 'Saluran tanya jawab langsung dengan dosen dan rekan mahasiswa, diatur per modul dan topik.',
    },
    {
        icon: BarChart3,
        title: 'Pelacakan Kemajuan',
        desc: 'Pantau perkembangan akademis melalui bilah kemajuan visual dan statistik yang komprehensif.',
    },
    {
        icon: Bell,
        title: 'Notifikasi Pintar',
        desc: 'Peringatan otomatis untuk tenggat waktu yang mendekat, pengumuman kelas, dan publikasi nilai.',
    },
    {
        icon: Users,
        title: 'Akses Berbasis Peran',
        desc: 'Antarmuka yang disesuaikan untuk mahasiswa, dosen, staf administrasi, dan admin sistem.',
    },
    {
        icon: Smartphone,
        title: 'Desain Responsif',
        desc: 'Tata letak yang dioptimalkan memastikan akses mulus di laptop, tablet, dan perangkat seluler.',
    },
];

export default function Home() {
    return (
        <div className="min-h-screen bg-surface font-sans selection:bg-iris-500/30 selection:text-ink">
            <LandingNavbar />

            <main>
                {/* Hero Section */}
                <section className="relative pt-24 pb-32 overflow-hidden">
                    {/* Background Pattern - minimal grid */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

                    <div className="mx-auto max-w-[1200px] px-6 relative z-10">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            {/* Left: Copy */}
                            <div className="max-w-2xl">
                                <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface2/50 px-3 py-1 mb-6">
                                    <span className="flex size-2 rounded-full bg-iris-500 animate-pulse"></span>
                                    <span className="text-[12px] font-medium text-ink2">
                                        Universitas Dian Nuswantoro
                                    </span>
                                </div>
                                <div className="flex flex-col mb-6">
                                    <span
                                        className="text-[56px] lg:text-[68px] font-black tracking-[0.05em] text-[#005695] select-none font-sans leading-none"
                                        style={
                                            {
                                                fontWeight: 900,
                                                WebkitTextStroke: '2px #005695',
                                                textStroke: '2px #005695',
                                            } as any
                                        }
                                    >
                                        KULINO
                                    </span>
                                    <span className="text-[16px] lg:text-[18px] font-bold text-muted tracking-[0.2em] uppercase mt-2">
                                        Kuliah Online
                                    </span>
                                </div>
                                <p className="text-[16px] text-muted leading-relaxed mb-10 max-w-lg">
                                    Sistem Manajemen Pembelajaran (LMS) resmi
                                    Universitas Dian Nuswantoro yang dirancang
                                    untuk mendukung perkuliahan daring secara
                                    efisien, terintegrasi, dan interaktif bagi
                                    seluruh civitas akademika.
                                </p>
                                <div className="flex flex-wrap items-center gap-4">
                                    <Link
                                        href="/login"
                                        className="inline-flex items-center gap-2 rounded-lg bg-[#005695] px-6 py-3.5 text-[14px] font-semibold text-white transition-all hover:bg-[#004b80] shadow-[0_4px_14px_0_rgba(0,86,149,0.35)] hover:-translate-y-[1px]"
                                    >
                                        Login Mahasiswa <ArrowRight size={16} />
                                    </Link>
                                </div>
                            </div>

                            {/* Right: Bento Showcase */}
                            <div className="relative">
                                {/* Decorative glow */}
                                <div className="absolute -top-10 -right-10 w-64 h-64 bg-iris-500/5 rounded-full blur-3xl"></div>

                                <div className="grid grid-cols-2 gap-4 relative z-10">
                                    {/* Card 1: Digital Space */}
                                    <div className="col-span-2 rounded-2xl border border-border bg-surface p-6 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="size-10 rounded-lg bg-iris-500/10 text-iris-600 flex items-center justify-center">
                                                <Building2 size={20} />
                                            </div>
                                            <div>
                                                <h3 className="text-[15px] font-bold text-ink">
                                                    Layanan Akademik
                                                    Terintegrasi
                                                </h3>
                                                <p className="text-[12px] text-muted">
                                                    Akses Terpusat & Responsif
                                                </p>
                                            </div>
                                        </div>
                                        <p className="text-[13px] text-muted leading-relaxed">
                                            KULINO menyatukan materi
                                            perkuliahan, pengelolaan tugas,
                                            penilaian, dan komunikasi dalam satu
                                            platform terpadu untuk menunjang
                                            kegiatan pembelajaran yang
                                            fleksibel.
                                        </p>
                                    </div>

                                    {/* Card 2: Security */}
                                    <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="size-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-3">
                                            <GraduationCap size={16} />
                                        </div>
                                        <h3 className="text-[13px] font-bold text-ink mb-1">
                                            Akses SSO Aman
                                        </h3>
                                        <p className="text-[11px] text-muted leading-normal">
                                            Autentikasi terenkripsi untuk
                                            menjamin keamanan privasi data
                                            akademik seluruh civitas akademika.
                                        </p>
                                    </div>

                                    {/* Card 3: Discussion */}
                                    <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="size-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center mb-3">
                                            <Users size={16} />
                                        </div>
                                        <h3 className="text-[13px] font-bold text-ink mb-1">
                                            Kolaborasi Terbuka
                                        </h3>
                                        <p className="text-[11px] text-muted leading-normal">
                                            Forum komunikasi dua arah antara
                                            dosen dan mahasiswa untuk berdiskusi
                                            secara interaktif.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <LandingTabsShowcase />

                {/* Features / Architecture Section */}
                <section
                    id="features"
                    className="py-24 bg-surface2/30 border-y border-border/50"
                >
                    <div className="mx-auto max-w-[1200px] px-6">
                        <div className="max-w-2xl mb-16">
                            <h2 className="text-[32px] font-bold text-ink tracking-tight mb-4">
                                Dirancang untuk Fokus.
                            </h2>
                            <p className="text-[16px] text-muted leading-relaxed">
                                Setiap komponen di KULINO dirancang untuk
                                menghadirkan pengalaman pembelajaran digital
                                yang terstruktur, mempermudah akses materi
                                kuliah, pengumpulan tugas, dan interaksi
                                perkuliahan.
                            </p>
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
                            {features.map((feature) => (
                                <div
                                    key={feature.title}
                                    className="group rounded-2xl border border-border/60 bg-surface p-6 transition-all hover:border-iris-300 hover:shadow-md"
                                >
                                    <div className="mb-5 flex size-10 items-center justify-center rounded-xl bg-surface2 border border-border/50 text-ink group-hover:bg-iris-500/10 group-hover:text-iris-600 transition-colors">
                                        <feature.icon
                                            size={20}
                                            strokeWidth={1.5}
                                        />
                                    </div>
                                    <h3 className="text-[16px] font-semibold text-ink mb-2 tracking-tight">
                                        {feature.title}
                                    </h3>
                                    <p className="text-[14px] text-muted leading-relaxed">
                                        {feature.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Roles / Solutions Section */}
                <section id="roles" className="py-32">
                    <div className="mx-auto max-w-[1200px] px-6">
                        <div className="text-center max-w-2xl mx-auto mb-20">
                            <h2 className="text-[32px] font-bold text-ink tracking-tight mb-4">
                                Ekosistem terpadu.
                            </h2>
                            <p className="text-[16px] text-muted leading-relaxed">
                                Satu platform yang mendukung seluruh alur kerja
                                akademis. Antarmuka yang disesuaikan untuk
                                setiap peran di universitas.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8 relative">
                            {/* Connecting line for visual flow */}
                            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-px bg-border/50 -z-10"></div>

                            {[
                                {
                                    icon: GraduationCap,
                                    title: 'Mahasiswa',
                                    desc: 'Akses jalur pembelajaran yang disesuaikan, pantau nilai, dan jangan pernah melewatkan tenggat waktu.',
                                },
                                {
                                    icon: Presentation,
                                    title: 'Dosen',
                                    desc: 'Rancang modul yang menarik, beri nilai secara efisien, dan pantau analitik kelas.',
                                },
                                {
                                    icon: Building2,
                                    title: 'Administrasi',
                                    desc: 'Kelola katalog mata kuliah, awasi akses, dan buat laporan kepatuhan.',
                                },
                            ].map((role) => (
                                <div
                                    key={role.title}
                                    className="group flex flex-col items-center text-center"
                                >
                                    <div className="mb-6 size-24 rounded-3xl bg-surface border border-border/50 shadow-sm flex items-center justify-center text-ink group-hover:-translate-y-2 group-hover:shadow-md transition-all duration-300">
                                        <role.icon
                                            size={32}
                                            className="text-ink"
                                            strokeWidth={1.5}
                                        />
                                    </div>
                                    <h3 className="text-[18px] font-semibold text-ink mb-3">
                                        {role.title}
                                    </h3>
                                    <p className="text-[14px] text-muted leading-relaxed max-w-[260px]">
                                        {role.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <LandingHowItWorks />
                <LandingStats />
                <LandingTestimonials />

                <LandingFAQ />

                {/* CTA / Help & Support Section */}
                <section className="py-24 bg-gradient-to-r from-[#003c6c] to-[#005695] text-surface rounded-[2.5rem] mx-4 mb-4 lg:mx-8 lg:mb-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]"></div>
                    <div className="mx-auto max-w-[800px] px-6 text-center relative z-10">
                        <h2 className="text-[40px] font-bold tracking-tight mb-6 text-surface">
                            Siap untuk mengakses ruang kerja Anda?
                        </h2>
                        <p className="text-[16px] text-surface/70 mb-10 max-w-xl mx-auto leading-relaxed">
                            KULINO adalah platform akademik resmi yang dirancang
                            untuk mendukung perkuliahan daring. Silakan masuk
                            menggunakan akun MHS Anda untuk mengakses ruang
                            kelas virtual, materi kuliah, dan layanan akademik
                            lainnya.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link
                                href="/login"
                                className="rounded-lg bg-surface px-8 py-4 text-[15px] font-semibold text-ink transition-transform hover:scale-105 shadow-xl"
                            >
                                Login Akun MHS
                            </Link>
                            <a
                                href="mailto:support@institusi.ac.id"
                                className="rounded-lg border border-surface/20 bg-transparent px-8 py-4 text-[15px] font-medium text-surface transition-colors hover:bg-surface/10"
                            >
                                Hubungi Dukungan IT
                            </a>
                        </div>
                    </div>
                </section>
            </main>

            <LandingFooter />
        </div>
    );
}
