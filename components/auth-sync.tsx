'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth';
import { createClient } from '@/lib/supabase/client';

const isSupabaseConfigured =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_URL.startsWith('http');

export function AuthSync() {
    useEffect(() => {
        if (!isSupabaseConfigured) return;

        const supabase = createClient();

        // 1. Cek session saat awal mount
        const verifySession = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user && useAuthStore.getState().isAuthenticated) {
                    // Session Supabase sudah expired tetapi state lokal masih menyimpan user
                    await useAuthStore.getState().logout();
                }
            } catch (error) {
                console.error('Gagal memverifikasi session Supabase:', error);
            }
        };
        verifySession();

        // 2. Dengar perubahan auth state dari Supabase
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_OUT' || !session) {
                if (useAuthStore.getState().isAuthenticated) {
                    await useAuthStore.getState().logout();
                }
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    return null;
}
