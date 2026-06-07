export type Role = 'guest' | 'mahasiswa' | 'dosen' | 'tu' | 'admin';

export interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
    nim_nip?: string;
    photo_url?: string;
    phone?: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (
        credentials: LoginCredentials,
    ) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
}
