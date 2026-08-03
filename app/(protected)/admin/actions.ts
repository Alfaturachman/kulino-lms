'use server';

import { createClient as createAdminClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { ConfigurationError, ForbiddenError, UnauthorizedError } from '@/lib/errors';

async function verifyAdminCaller() {
    const supabase = await createServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        throw new UnauthorizedError('Silakan login terlebih dahulu.');
    }

    let role = user.user_metadata?.role;
    if (!role) {
        const { data: dbUser } = await supabase
            .from('users')
            .select('role')
            .eq('id', user.id)
            .single();
        role = dbUser?.role;
    }

    if (role !== 'admin' && role !== 'tu') {
        throw new ForbiddenError('Akses ditolak: Hanya Admin/TU yang diizinkan mengeksekusi aksi ini.');
    }

    return user;
}

function getAdminClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
        throw new ConfigurationError(
            'Konfigurasi Supabase Service Role Key (SUPABASE_SERVICE_ROLE_KEY) belum diset di server environment.',
        );
    }

    return createAdminClient(supabaseUrl, serviceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });
}

export async function createUserInAuth(data: {
    email: string;
    name: string;
    role: string;
    nim_nip: string;
}) {
    await verifyAdminCaller();

    const supabaseAdmin = getAdminClient();
    const defaultPassword = '12345678';

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

export async function updateUserPasswordInAuth(userId: string, newPassword: string) {
    await verifyAdminCaller();

    const supabaseAdmin = getAdminClient();
    const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
        password: newPassword,
    });

    if (error) {
        throw new Error(error.message);
    }

    return { success: true };
}
