'use server';

import { createClient } from '@supabase/supabase-js';

export async function createUserInAuth(data: {
    email: string;
    name: string;
    role: string;
    nim_nip: string;
}) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
        throw new Error(
            'Konfigurasi Supabase Service Role Key (SUPABASE_SERVICE_ROLE_KEY) belum diset di server environment.',
        );
    }

    // Inisialisasi client Supabase dengan hak akses admin
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });

    // Default password untuk user baru
    const defaultPassword = '12345678';

    // Buat user baru di Supabase Auth
    const { data: authUser, error: authError } =
        await supabaseAdmin.auth.admin.createUser({
            email: data.email,
            password: defaultPassword,
            email_confirm: true,
            user_metadata: {
                name: data.name,
                role: data.role,
                nim_nip: data.nim_nip,
            },
        });

    if (authError) {
        throw new Error(authError.message);
    }

    return { id: authUser.user.id };
}
