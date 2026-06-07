import { LoginForm } from '@/components/login-form';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-[#f0f9ff] font-sans selection:bg-iris-500/30 selection:text-ink relative overflow-hidden p-6">
            {/* Soft, massive atmospheric light blue light (samar-samar dominant blue light) */}
            <div className="absolute top-[-10%] left-[-10%] w-[700px] h-[700px] rounded-full bg-[#bfdbfe] opacity-[0.5] blur-[140px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#93c5fd] opacity-[0.4] blur-[120px] pointer-events-none"></div>
            <div className="absolute top-[30%] right-[20%] w-[500px] h-[500px] rounded-full bg-[#bae6fd] opacity-[0.4] blur-[130px] pointer-events-none"></div>

            {/* Centered White Card */}
            <div className="w-full max-w-[440px] rounded-3xl border border-border/60 bg-surface p-8 sm:p-10 shadow-2xl relative z-10">
                {/* Logo */}
                <div className="flex flex-col items-center justify-center mb-8">
                    <Link href="/" className="flex flex-col items-center">
                        <span
                            className="text-[32px] font-black tracking-[0.05em] text-[#005695] select-none font-sans"
                            style={
                                {
                                    fontWeight: 900,
                                    WebkitTextStroke: '1.5px #005695',
                                    textStroke: '1.5px #005695',
                                } as any
                            }
                        >
                            KULINO
                        </span>
                        <span className="text-[13px] font-bold text-muted tracking-[0.15em] uppercase mt-1">
                            Kuliah Online
                        </span>
                    </Link>
                </div>

                <div className="mb-8 text-center">
                    <p className="text-[14px] text-muted leading-relaxed">
                        Masuk menggunakan Akun MHS Anda untuk mengakses
                        layanan akademik KULINO.
                    </p>
                </div>

                <div className="space-y-6">
                    <LoginForm />
                </div>

                <p className="mt-8 text-center text-[13px] text-muted">
                    Belum memiliki akun?{' '}
                    <Link
                        href="/register"
                        className="font-semibold text-iris-600 hover:text-iris-700 transition-colors"
                    >
                        Ajukan akses
                    </Link>
                </p>

                <div className="mt-6 pt-6 border-t border-border/50">
                    <Button variant="secondary" className="w-full rounded-sm" asChild>
                        <Link href="/">
                            Kembali ke Beranda
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
