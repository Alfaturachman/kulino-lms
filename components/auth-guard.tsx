'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { createClient } from '@/lib/supabase/client';

const isSupabaseConfigured =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_URL.startsWith('http');

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { user, isAuthenticated } = useAuthStore();
    const [verifying, setVerifying] = useState(true);

    useEffect(() => {
        async function checkSession() {
            if (isSupabaseConfigured) {
                try {
                    const supabase = createClient();
                    const {
                        data: { user: supabaseUser },
                    } = await supabase.auth.getUser();
                    if (
                        !supabaseUser &&
                        useAuthStore.getState().isAuthenticated
                    ) {
                        // Jika session Supabase sudah tidak ada tetapi state lokal masih aktif, log out
                        await useAuthStore.getState().logout();
                    }
                } catch (err) {
                    console.error('Gagal memverifikasi session Supabase:', err);
                }
            }
            setVerifying(false);
        }
        checkSession();
    }, []);

    useEffect(() => {
        if (!verifying && !isAuthenticated) {
            router.push('/login');
        }
    }, [verifying, isAuthenticated, router]);

    useEffect(() => {
        if (!verifying && isAuthenticated && user) {
            if (pathname.startsWith('/admin') && user.role !== 'admin') {
                router.push(
                    user.role === 'dosen'
                        ? '/lecturer'
                        : user.role === 'tu'
                          ? '/staff'
                          : '/dashboard',
                );
            } else if (
                pathname.startsWith('/lecturer') &&
                user.role !== 'dosen'
            ) {
                router.push(
                    user.role === 'admin'
                        ? '/admin'
                        : user.role === 'tu'
                          ? '/staff'
                          : '/dashboard',
                );
            } else if (pathname.startsWith('/staff') && user.role !== 'tu') {
                router.push(
                    user.role === 'admin'
                        ? '/admin'
                        : user.role === 'dosen'
                          ? '/lecturer'
                          : '/dashboard',
                );
            } else if (
                pathname.startsWith('/dashboard') &&
                user.role !== 'mahasiswa'
            ) {
                router.push(
                    user.role === 'admin'
                        ? '/admin'
                        : user.role === 'dosen'
                          ? '/lecturer'
                          : '/staff',
                );
            }
        }
    }, [verifying, isAuthenticated, user, pathname, router]);

    if (verifying) {
        return (
            <div className="flex h-screen w-screen items-center justify-center bg-surface3">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-iris-500 border-t-transparent"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    // Cegah render jika role tidak sesuai dengan path
    if (user) {
        if (pathname.startsWith('/admin') && user.role !== 'admin') return null;
        if (pathname.startsWith('/lecturer') && user.role !== 'dosen')
            return null;
        if (pathname.startsWith('/staff') && user.role !== 'tu') return null;
        if (pathname.startsWith('/dashboard') && user.role !== 'mahasiswa')
            return null;
    }

    return <>{children}</>;
}
