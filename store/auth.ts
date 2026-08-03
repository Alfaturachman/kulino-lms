import { create } from 'zustand';
import type { AuthState, LoginCredentials, User } from '@/types/auth';
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
            await new Promise((r) => setTimeout(r, 600));

            if (!credentials.email || credentials.password.length < 8) {
                set({ isLoading: false });
                return { success: false, error: 'Email atau password salah' };
            }

            const rawRole = credentials.email.includes('admin')
                ? 'admin'
                : credentials.email.includes('dsn') || credentials.email.includes('dosen')
                ? 'dosen'
                : credentials.email.includes('tu') || credentials.email.includes('staff')
                ? 'tu'
                : 'mahasiswa';

            const devUser: User = {
                id: `dev-${Date.now()}`,
                name: credentials.email.split('@')[0],
                email: credentials.email,
                role: rawRole,
                nim_nip: '0000000000',
            };
            saveSession(devUser);
            set({ user: devUser, isAuthenticated: true, isLoading: false });
            return { success: true };
        }

        try {
            const supabase = createClient();

            // 1. Coba login melalui Supabase Auth
            const { data: authData, error: authError } =
                await supabase.auth.signInWithPassword({
                    email: credentials.email,
                    password: credentials.password,
                });

            if (!authError && authData?.user) {
                // Ambil profil publik dari tabel users
                const { data: profileData } = await supabase
                    .from('users')
                    .select('*')
                    .eq('id', authData.user.id)
                    .maybeSingle();

                const rawRole = (
                    profileData?.role ||
                    authData.user.user_metadata?.role ||
                    'mahasiswa'
                ).toLowerCase();

                let normalizedRole: User['role'] = 'mahasiswa';
                if (rawRole.includes('admin')) normalizedRole = 'admin';
                else if (rawRole.includes('dosen')) normalizedRole = 'dosen';
                else if (rawRole.includes('tu') || rawRole.includes('staff')) normalizedRole = 'tu';
                else if (rawRole.includes('mahasiswa')) normalizedRole = 'mahasiswa';

                const user: User = {
                    id: authData.user.id,
                    name:
                        profileData?.name ||
                        authData.user.user_metadata?.name ||
                        credentials.email.split('@')[0],
                    email: profileData?.email || authData.user.email || credentials.email,
                    role: normalizedRole,
                    nim_nip: profileData?.nim_nip,
                    photo_url: profileData?.photo_url,
                    phone: profileData?.phone,
                };

                saveSession(user);
                set({ user, isAuthenticated: true, isLoading: false });

                // Asynchronous non-blocking audit log insert
                (async () => {
                    try {
                        await supabase.from('audit_logs').insert({
                            user_name: user.name,
                            action: `Login sebagai ${user.role}: ${user.name}`,
                            ip_address: '',
                        });
                    } catch {}
                })();

                return { success: true };
            }

            // 2. Fallback: Jika Supabase Auth GoTrue belum meng-index user, periksa tabel public.users
            const { data: dbUser } = await supabase
                .from('users')
                .select('*')
                .eq('email', credentials.email)
                .maybeSingle();

            if (dbUser) {
                // Verifikasi kecocokan password atau password bawaan seed '12345678' / 'hashed_by_supabase_auth'
                if (
                    dbUser.password === credentials.password ||
                    credentials.password === '12345678' ||
                    dbUser.password === 'hashed_by_supabase_auth'
                ) {
                    const rawRole = (dbUser.role || 'mahasiswa').toLowerCase();
                    let normalizedRole: User['role'] = 'mahasiswa';
                    if (rawRole.includes('admin')) normalizedRole = 'admin';
                    else if (rawRole.includes('dosen')) normalizedRole = 'dosen';
                    else if (rawRole.includes('tu') || rawRole.includes('staff')) normalizedRole = 'tu';
                    else if (rawRole.includes('mahasiswa')) normalizedRole = 'mahasiswa';

                    const user: User = {
                        id: dbUser.id,
                        name: dbUser.name,
                        email: dbUser.email,
                        role: normalizedRole,
                        nim_nip: dbUser.nim_nip,
                        photo_url: dbUser.photo_url,
                        phone: dbUser.phone,
                    };

                    saveSession(user);
                    set({ user, isAuthenticated: true, isLoading: false });

                    // Asynchronous non-blocking audit log insert
                    (async () => {
                        try {
                            await supabase.from('audit_logs').insert({
                                user_name: user.name,
                                action: `Login sebagai ${user.role}: ${user.name}`,
                                ip_address: '',
                            });
                        } catch {}
                    })();

                    return { success: true };
                } else {
                    set({ isLoading: false });
                    return {
                        success: false,
                        error: 'Password yang Anda masukkan salah.',
                    };
                }
            }

            // 3. User tidak ditemukan
            set({ isLoading: false });
            return {
                success: false,
                error: 'Email atau password salah. Akun tidak ditemukan di sistem KULINO.',
            };
        } catch (err: unknown) {
            set({ isLoading: false });
            const errMsg =
                err instanceof Error ? err.message : 'Terjadi kesalahan koneksi ke server';
            return {
                success: false,
                error: errMsg,
            };
        }
    },

    logout: async () => {
        const state = useAuthStore.getState();
        if (!state.isAuthenticated && !state.user && !loadSession()) {
            return;
        }

        // 1. Matikan state lokal terlebih dahulu untuk menghentikan rekursi tak hingga
        clearSession();
        set({ user: null, isAuthenticated: false });

        // 2. Lakukan audit log & signout Supabase jika terkonfigurasi
        if (isSupabaseConfigured) {
            try {
                const supabase = createClient();
                if (state.user) {
                    try {
                        await supabase.from('audit_logs').insert({
                            user_name: state.user.name,
                            action: `Logout: ${state.user.name}`,
                            ip_address: '',
                        });
                    } catch {}
                }
                await supabase.auth.signOut();
            } catch (err) {
                console.error('Gagal logout dari Supabase:', err);
            }
        }
    },
}));
