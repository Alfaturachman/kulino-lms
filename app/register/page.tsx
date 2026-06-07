'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, User, Mail, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

const registerSchema = z
    .object({
        name: z.string().min(1, 'Nama wajib diisi'),
        email: z
            .string()
            .min(1, 'Email wajib diisi')
            .email('Format email tidak valid'),
        password: z.string().min(8, 'Password minimal 8 karakter'),
        confirmPassword: z.string().min(1, 'Konfirmasi password wajib diisi'),
    })
    .refine((d) => d.password === d.confirmPassword, {
        message: 'Password tidak cocok',
        path: ['confirmPassword'],
    });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const router = useRouter();

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    async function onSubmit(data: RegisterFormData) {
        setIsLoading(true);
        const isSupabaseConfigured =
            !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
            process.env.NEXT_PUBLIC_SUPABASE_URL.startsWith('http');

        if (!isSupabaseConfigured) {
            // Simulasi pendaftaran
            await new Promise((resolve) => setTimeout(resolve, 800));
            setModalMessage(
                `Pendaftaran untuk ${data.name} berhasil diajukan (simulasi). Silakan login.`,
            );
            setIsLoading(false);
            setShowModal(true);
            return;
        }

        try {
            const supabase = createClient();

            // Registrasi user baru di Supabase Auth
            const { data: authData, error: authError } =
                await supabase.auth.signUp({
                    email: data.email,
                    password: data.password,
                    options: {
                        data: {
                            name: data.name,
                            role: 'mahasiswa', // default role untuk pendaftaran mandiri
                        },
                    },
                });

            if (authError) {
                setError('email', { message: authError.message });
                setIsLoading(false);
                return;
            }

            if (authData.user) {
                // Hubungkan ke tabel public.users
                const { error: profileError } = await supabase
                    .from('users')
                    .insert({
                        id: authData.user.id,
                        name: data.name,
                        email: data.email,
                        password: 'hashed_by_supabase_auth', // Kolom password required di DDL spec, kita beri placeholder
                        nim_nip: `MHS-${Math.floor(100000 + Math.random() * 900000)}`, // NIM acak untuk testing
                        role: 'mahasiswa',
                    });

                if (profileError) {
                    console.error(
                        'Gagal menyisipkan profil ke database:',
                        profileError.message,
                    );
                }
            }

            setModalMessage(
                'Pendaftaran sukses! Silakan lakukan login. Jika konfirmasi email aktif, silakan periksa kotak masuk email Anda terlebih dahulu.',
            );
            setShowModal(true);
        } catch (err: any) {
            setError('email', {
                message: err.message || 'Gagal menghubungi server pendaftaran.',
            });
        } finally {
            setIsLoading(false);
        }
    }

    function handleCloseModal() {
        setShowModal(false);
        router.push('/login');
    }

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
                    <h1 className="text-[28px] font-bold text-ink tracking-tight mb-2">
                        Daftar Akun
                    </h1>
                    <p className="text-[14px] text-muted leading-relaxed">
                        Buat akun mahasiswa KULINO baru untuk mengakses ruang kerja akademik pribadi Anda.
                    </p>
                </div>

                <div className="space-y-6">
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="flex flex-col gap-4"
                    >
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="name">Nama Lengkap</Label>
                            <Input
                                id="name"
                                placeholder="Nama Anda"
                                error={errors.name?.message}
                                icon={<User size={16} className="text-muted" />}
                                {...register('name')}
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="nama@email.com"
                                error={errors.email?.message}
                                icon={<Mail size={16} className="text-muted" />}
                                {...register('email')}
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Min. 8 karakter"
                                error={errors.password?.message}
                                icon={<Lock size={16} className="text-muted" />}
                                {...register('password')}
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="confirmPassword">
                                Konfirmasi Password
                            </Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="Ulangi password"
                                error={errors.confirmPassword?.message}
                                icon={<Lock size={16} className="text-muted" />}
                                {...register('confirmPassword')}
                            />
                        </div>
                        <Button
                            type="submit"
                            className="mt-2"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Mendaftarkan...' : 'Daftar'}
                        </Button>
                    </form>
                </div>

                <p className="mt-8 text-center text-[13px] text-muted">
                    Sudah memiliki akun?{' '}
                    <Link
                        href="/login"
                        className="font-semibold text-iris-600 hover:text-iris-700 transition-colors"
                    >
                        Login disini
                    </Link>
                </p>

                <div className="mt-6 pt-6 border-t border-border/50">
                    <Button
                        variant="secondary"
                        className="w-full rounded-sm"
                        asChild
                    >
                        <Link href="/">Kembali ke Beranda</Link>
                    </Button>
                </div>
            </div>

            {/* Success Modal Custom */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-ink/40 backdrop-blur-xs"
                            onClick={handleCloseModal}
                        />

                        {/* Modal Content */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 12 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 12 }}
                            transition={{ duration: 0.2, ease: 'easeOut' }}
                            className="relative w-full max-w-xs rounded-2xl border border-border/80 bg-surface p-6 shadow-xl z-10 flex flex-col items-center text-center"
                        >
                            <div className="flex size-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mb-4">
                                <CheckCircle2 size={24} />
                            </div>

                            <h3 className="text-[16px] font-bold text-ink mb-2">
                                Pendaftaran Berhasil
                            </h3>

                            <p className="text-[13px] text-muted leading-relaxed mb-6">
                                {modalMessage}
                            </p>

                            <Button
                                onClick={handleCloseModal}
                                className="w-full"
                            >
                                Kembali ke Login
                            </Button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
