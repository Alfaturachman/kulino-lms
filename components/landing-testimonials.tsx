const testimonials = [
    {
        quote: 'Platform Kulino ini sangat responsif dan mudah digunakan. Mengunduh PDF materi kuliah dan mengumpulkan kuis jadi jauh lebih cepat dibanding platform lama.',
        name: 'Andi Wijaya',
        role: 'Mahasiswa Teknik Informatika',
        initials: 'AW',
        color: 'bg-iris-500/10 text-iris-600',
    },
    {
        quote: 'Fitur manajemen modul mingguan dan kriteria penilaian tugas sangat membantu saya membagikan feedback langsung ke mahasiswa secara terstruktur.',
        name: 'Dr. Budi Santoso',
        role: 'Dosen Fakultas Ilmu Komputer',
        initials: 'BS',
        color: 'bg-emerald-500/10 text-emerald-600',
    },
    {
        quote: 'Sebagai administrator sistem, integrasi backend dengan Supabase Auth dan LDAP membuat manajemen data user dan backup data akademik berjalan mulus.',
        name: 'Citra Kirana',
        role: 'Staf Unit Layanan IT',
        initials: 'CK',
        color: 'bg-blue-500/10 text-blue-600',
    },
];

export function LandingTestimonials() {
    return (
        <section
            id="testimonials"
            className="py-24 bg-surface2/30 border-t border-border"
        >
            <div className="mx-auto max-w-[1200px] px-6">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <span className="inline-block rounded-full bg-iris-500/10 text-iris-600 px-4 py-1.5 text-[12px] font-semibold mb-4">
                        Ulasan Pengguna
                    </span>
                    <h2 className="text-[32px] font-bold text-ink tracking-tight mb-4">
                        Kata Mereka Tentang KULINO
                    </h2>
                    <p className="text-[16px] text-muted leading-relaxed">
                        Simak pengalaman langsung dari civitas akademika yang
                        menggunakan KULINO dalam aktivitas belajar-mengajar
                        harian.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((t, idx) => (
                        <div
                            key={idx}
                            className="bg-surface rounded-2xl border border-border p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
                        >
                            <div>
                                <div className="flex gap-1 mb-5">
                                    {[...Array(5)].map((_, i) => (
                                        <svg
                                            key={i}
                                            className="size-4 text-amber-500 fill-current"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                                <p className="text-[14px] text-ink2 italic leading-relaxed mb-6">
                                    "{t.quote}"
                                </p>
                            </div>
                            <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                                <div
                                    className={`size-10 rounded-full ${t.color} flex items-center justify-center font-bold text-[13px] tracking-wider`}
                                >
                                    {t.initials}
                                </div>
                                <div>
                                    <h4 className="text-[14px] font-bold text-ink leading-tight">
                                        {t.name}
                                    </h4>
                                    <p className="text-[11px] text-muted mt-0.5">
                                        {t.role}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
