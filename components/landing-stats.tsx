import { Zap, ShieldCheck, Cloud, Server } from 'lucide-react';

const statsData = [
    {
        title: 'Respons Cepat',
        desc: 'Optimasi Next.js SSR & Cloud CDN untuk menyajikan konten kuliah dalam hitungan milidetik.',
        icon: Zap,
        color: 'text-iris-600 bg-iris-500/10',
    },
    {
        title: 'Keamanan RLS',
        desc: 'Proteksi tingkat database (Row Level Security) menjamin data tugas Anda tidak bocor ke orang lain.',
        icon: ShieldCheck,
        color: 'text-emerald-600 bg-emerald-500/10',
    },
    {
        title: 'Sinkronisasi Cloud',
        desc: 'Database dinamis realtime yang menyimpan progres belajar, kuis, dan submission Anda secara otomatis.',
        icon: Cloud,
        color: 'text-blue-600 bg-blue-500/10',
    },
    {
        title: 'SLA Uptime 99.9%',
        desc: 'Infrastruktur andal memastikan KULINO siap diakses kapan saja menjelang tenggat waktu tugas Anda.',
        icon: Server,
        color: 'text-amber-600 bg-amber-500/10',
    },
];

export function LandingStats() {
    return (
        <section id="stats" className="py-24 bg-surface border-t border-border">
            <div className="mx-auto max-w-[1200px] px-6">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <span className="inline-block rounded-full bg-iris-500/10 text-iris-600 px-4 py-1.5 text-[12px] font-semibold mb-4">
                        Kapasitas Infrastruktur
                    </span>
                    <h2 className="text-[32px] font-bold text-ink tracking-tight mb-4">
                        Performa Handal untuk Belajar Tanpa Batas
                    </h2>
                    <p className="text-[16px] text-muted leading-relaxed">
                        Arsitektur teknologi KULINO dirancang khusus untuk menangani ribuan mahasiswa secara bersamaan dengan stabilitas tinggi.
                    </p>
                </div>

                <div className="grid md:grid-cols-4 gap-8">
                    {statsData.map((stat, i) => {
                        const Icon = stat.icon;
                        return (
                            <div key={i} className="flex flex-col items-center text-center p-6 rounded-2xl border border-border bg-surface2/30">
                                <div className={`size-12 rounded-xl ${stat.color} flex items-center justify-center mb-4`}>
                                    <Icon size={24} />
                                </div>
                                <h3 className="text-[16px] font-bold text-ink mb-2">
                                    {stat.title}
                                </h3>
                                <p className="text-[12px] text-muted leading-relaxed">
                                    {stat.desc}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
