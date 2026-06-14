'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth';

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { user, isAuthenticated } = useAuthStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setMounted(true);
        }, 0);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (mounted && !isAuthenticated) {
            router.push('/login');
        }
    }, [mounted, isAuthenticated, router]);

    useEffect(() => {
        if (mounted && isAuthenticated && user) {
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
    }, [mounted, isAuthenticated, user, pathname, router]);

    if (!mounted) {
        return null;
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
