import { UserCheck, BookOpen, MessageSquare, UploadCloud } from 'lucide-react';

const steps = [
    {
        number: '01',
        title: 'Masuk Akun',
        desc: 'Autentikasi aman menggunakan Akun MHS Anda untuk langsung masuk ke dasbor personal.',
        icon: UserCheck,
        color: 'bg-blue-500/10 text-blue-600',
    },
    {
        number: '02',
        title: 'Pilih Kelas',
        desc: 'Lihat daftar mata kuliah aktif semester ini, jadwal perkuliahan, dan silabus belajar.',
        icon: BookOpen,
        color: 'bg-iris-500/10 text-iris-600',
    },
    {
        number: '03',
        title: 'Belajar & Diskusi',
        desc: 'Pelajari modul mingguan melalui PDF/Video dan berinteraksi di forum tanya jawab kelas.',
        icon: MessageSquare,
        color: 'bg-amber-500/10 text-amber-600',
    },
    {
        number: '04',
        title: 'Kumpulkan Tugas',
        desc: 'Kirim tugas akademik Anda langsung ke server cloud dan pantau nilai beserta feedback dari dosen.',
        icon: UploadCloud,
        color: 'bg-emerald-500/10 text-emerald-600',
    },
];

export function LandingHowItWorks() {
    return (
        <section
            id="how-it-works"
            className="py-24 bg-surface2/30 border-t border-border"
        >
            <div className="mx-auto max-w-[1200px] px-6">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <span className="inline-block rounded-full bg-iris-500/10 text-iris-600 px-4 py-1.5 text-[12px] font-semibold mb-4">
                        Alur Belajar
                    </span>
                    <h2 className="text-[32px] font-bold text-ink tracking-tight mb-4">
                        Cara Kerja KULINO
                    </h2>
                    <p className="text-[16px] text-muted leading-relaxed">
                        Nikmati pengalaman perkuliahan online terstruktur dengan
                        empat langkah sederhana berikut.
                    </p>
                </div>

                <div className="grid md:grid-cols-4 gap-8 relative">
                    {/* Connecting line on desktop */}
                    <div className="hidden md:block absolute top-[50px] left-[12%] right-[12%] h-0.5 bg-border/40 -z-10"></div>

                    {steps.map((step) => {
                        const Icon = step.icon;
                        return (
                            <div
                                key={step.number}
                                className="bg-surface rounded-2xl border border-border p-6 relative hover:shadow-md transition-shadow"
                            >
                                <div className="absolute -top-4 -right-4 size-10 rounded-full bg-ink text-surface flex items-center justify-center font-bold text-[14px] shadow-sm">
                                    {step.number}
                                </div>
                                <div
                                    className={`size-12 rounded-xl ${step.color} flex items-center justify-center mb-6`}
                                >
                                    <Icon size={24} />
                                </div>
                                <h3 className="text-[16px] font-bold text-ink mb-2">
                                    {step.title}
                                </h3>
                                <p className="text-[13px] text-muted leading-relaxed">
                                    {step.desc}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
