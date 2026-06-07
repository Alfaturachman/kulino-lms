import { create } from 'zustand';
import type { AuthState, LoginCredentials, User } from '@/types/auth';
import { mockUsers } from '@/data/users';
import { createClient } from '@/lib/supabase/client';

function saveSession(user: User) {
    if (typeof window !== 'undefined') {
        localStorage.setItem('kulino_user', JSON.stringify(user));
    }
}

function clearSession() {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('kulino_user');
    }
}

function loadSession(): User | null {
    if (typeof window !== 'undefined') {
        const raw = localStorage.getItem('kulino_user');
        if (raw) {
            try {
                return JSON.parse(raw) as User;
            } catch {
                clearSession();
            }
        }
    }
    return null;
}

const isSupabaseConfigured =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_URL.startsWith('http');

export const useAuthStore = create<AuthState>((set) => ({
    user: loadSession(),
    isAuthenticated: loadSession() !== null,
    isLoading: false,

    login: async (credentials: LoginCredentials) => {
        set({ isLoading: true });

        if (!isSupabaseConfigured) {
            // Fallback ke mock login jika Supabase belum dikonfigurasi
            await new Promise((r) => setTimeout(r, 800));

            const matched = mockUsers.find(
                (u) => u.email === credentials.email,
            );

            if (!matched) {
                set({ isLoading: false });
                return { success: false, error: 'Email atau password salah' };
            }

            if (credentials.password.length < 8) {
                set({ isLoading: false });
                return { success: false, error: 'Email atau password salah' };
            }

            saveSession(matched);
            set({ user: matched, isAuthenticated: true, isLoading: false });
            return { success: true };
        }

        try {
            const supabase = createClient();
            const { data: authData, error: authError } =
                await supabase.auth.signInWithPassword({
                    email: credentials.email,
                    password: credentials.password,
                });

            if (authError || !authData.user) {
                set({ isLoading: false });
                return {
                    success: false,
                    error: authError?.message || 'Email atau password salah',
                };
            }

            // Ambil data profil dan role dari tabel public.users
            const { data: profileData, error: profileError } = await supabase
                .from('users')
                .select('*')
                .eq('id', authData.user.id)
                .single();

            if (profileError || !profileData) {
                // Jika profile belum terbuat di public.users, buat fallback user dari metadata
                const fallbackUser: User = {
                    id: authData.user.id,
                    email: authData.user.email || credentials.email,
                    name:
                        authData.user.user_metadata?.name ||
                        credentials.email.split('@')[0],
                    role:
                        (authData.user.user_metadata?.role as any) ||
                        'mahasiswa',
                };
                saveSession(fallbackUser);
                set({
                    user: fallbackUser,
                    isAuthenticated: true,
                    isLoading: false,
                });
                return { success: true };
            }

            const user: User = {
                id: profileData.id,
                name: profileData.name,
                email: profileData.email,
                role: profileData.role,
                nim_nip: profileData.nim_nip,
                photo_url: profileData.photo_url,
                phone: profileData.phone,
            };

            saveSession(user);
            set({ user, isAuthenticated: true, isLoading: false });
            return { success: true };
        } catch (err: any) {
            set({ isLoading: false });
            return {
                success: false,
                error: err.message || 'Terjadi kesalahan koneksi ke Supabase',
            };
        }
    },

    logout: async () => {
        if (isSupabaseConfigured) {
            try {
                const supabase = createClient();
                await supabase.auth.signOut();
            } catch (err) {
                console.error('Gagal logout dari Supabase:', err);
            }
        }
        clearSession();
        set({ user: null, isAuthenticated: false });
    },
}));
