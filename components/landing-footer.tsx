import Link from 'next/link';
import { MapPin, Phone, Mail } from 'lucide-react';

export function LandingFooter() {
    return (
        <footer className="bg-surface pb-12 pt-12 mt-12 border-t border-border">
            <div className="mx-auto max-w-[1200px] px-6">
                <div className="grid gap-12 md:grid-cols-4 text-ink">
                    <div className="md:col-span-1">
                        <div className="flex items-center mb-6">
                            <span
                                className="text-[18px] font-black tracking-[0.05em] text-[#005695] select-none font-sans"
                                style={
                                    {
                                        fontWeight: 900,
                                        WebkitTextStroke: '1px #005695',
                                        textStroke: '1px #005695',
                                    } as any
                                }
                            >
                                KULINO
                            </span>
                        </div>
                        <p className="text-[13px] leading-relaxed text-muted">
                            Pusat sistem akademik untuk keunggulan pembelajaran
                            digital yang terintegrasi.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-[13px] font-semibold text-ink mb-4">
                            Platform
                        </h4>
                        <div className="flex flex-col gap-3 text-[13px] text-muted">
                            <Link
                                href="/courses"
                                className="hover:text-ink transition-colors"
                            >
                                Katalog Mata Kuliah
                            </Link>
                            <Link
                                href="/changelog"
                                className="hover:text-ink transition-colors"
                            >
                                Catatan Perubahan
                            </Link>
                            <Link
                                href="/status"
                                className="hover:text-ink transition-colors"
                            >
                                Status Sistem
                            </Link>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-[13px] font-semibold text-ink mb-4">
                            Layanan IT
                        </h4>
                        <div className="flex gap-3 text-[13px] text-muted items-start">
                            <MapPin
                                size={16}
                                className="shrink-0 mt-0.5 text-muted/60"
                            />
                            <span className="leading-relaxed">
                                Gedung Rektorat Lt. 2<br />
                                Pusat Data & Layanan IT
                                <br />
                                Kampus Utama
                            </span>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-[13px] font-semibold text-ink mb-4">
                            Kontak
                        </h4>
                        <div className="flex flex-col gap-3 text-[13px] text-muted">
                            <div className="flex items-center gap-3 hover:text-ink transition-colors cursor-pointer">
                                <Phone size={16} className="text-muted/60" />{' '}
                                +62 (24) 1234-5678
                            </div>
                            <div className="flex items-center gap-3 hover:text-ink transition-colors cursor-pointer">
                                <Mail size={16} className="text-muted/60" />{' '}
                                support@institusi.ac.id
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-[12px] text-muted">
                    <p>
                        &copy; {new Date().getFullYear()} KULINO Platform. Hak
                        cipta dilindungi undang-undang.
                    </p>
                    <div className="flex gap-6">
                        <Link
                            href="/privacy"
                            className="hover:text-ink transition-colors"
                        >
                            Kebijakan Privasi
                        </Link>
                        <Link
                            href="/terms"
                            className="hover:text-ink transition-colors"
                        >
                            Ketentuan Layanan
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
