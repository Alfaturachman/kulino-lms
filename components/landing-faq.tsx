'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqData = [
    {
        question: 'Bagaimana cara masuk ke platform KULINO?',
        answer: 'Anda dapat masuk menggunakan Akun MHS (untuk mahasiswa) atau akun resmi staf/dosen yang telah diterbitkan oleh bagian administrasi akademik institusi Anda.',
    },
    {
        question: 'Apakah KULINO dapat diakses melalui ponsel?',
        answer: 'Ya, KULINO dirancang secara sepenuhnya responsif agar dapat diakses secara optimal melalui browser pada ponsel, tablet, maupun laptop.',
    },
    {
        question: 'Bagaimana jika saya lupa kata sandi saya?',
        answer: 'Karena KULINO menggunakan sistem autentikasi terintegrasi, Anda dapat memperbarui atau mereset kata sandi melalui portal SSO utama di unit layanan IT institusi Anda.',
    },
    {
        question: 'Kenapa mata kuliah saya tidak muncul di dashboard?',
        answer: 'Pastikan Anda telah terdaftar secara administratif pada kelas tersebut. Jika sudah terdaftar namun kelas belum muncul, harap hubungi administrator atau staf akademik terkait.',
    },
    {
        question: 'Format file apa saja yang didukung untuk pengumpulan tugas?',
        answer: 'Format file dan batas ukuran maksimal bervariasi bergantung pada pengaturan masing-masing dosen. Umumnya format dokumen (PDF, Word) dan arsip (ZIP, RAR) didukung secara luas.',
    },
];

export function LandingFAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section
            id="faq"
            className="py-24 bg-surface/50 border-t border-border"
        >
            <div className="mx-auto max-w-[800px] px-6">
                <div className="text-center mb-16">
                    <h2 className="text-[32px] font-bold text-ink tracking-tight mb-4">
                        Pertanyaan yang Sering Diajukan
                    </h2>
                    <p className="text-[16px] text-muted leading-relaxed">
                        Cari tahu informasi dasar mengenai penggunaan dan akses
                        platform pembelajaran KULINO.
                    </p>
                </div>

                <div className="space-y-4">
                    {faqData.map((item, index) => {
                        const isOpen = openIndex === index;
                        return (
                            <div
                                key={index}
                                className="rounded-2xl border border-border bg-surface overflow-hidden transition-all duration-200"
                            >
                                <button
                                    onClick={() => toggleFAQ(index)}
                                    className="flex w-full items-center justify-between px-6 py-5 text-left font-medium text-ink hover:bg-surface2/50 transition-colors"
                                >
                                    <span className="text-[15px] md:text-[16px] font-semibold">
                                        {item.question}
                                    </span>
                                    <ChevronDown
                                        size={18}
                                        className={`text-muted transition-transform duration-200 ${isOpen ? 'rotate-180 text-ink' : ''}`}
                                    />
                                </button>
                                <div
                                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                                        isOpen
                                            ? 'max-h-40 border-t border-border/50'
                                            : 'max-h-0'
                                    }`}
                                >
                                    <p className="px-6 py-5 text-[14px] text-muted leading-relaxed">
                                        {item.answer}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
