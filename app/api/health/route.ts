import { NextResponse } from 'next/server';
import { withErrorHandler } from '@/lib/api-error-handler';
import { createClient } from '@/lib/supabase/server';

export const GET = withErrorHandler(async () => {
    const isSupabaseConfigured =
        !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
        process.env.NEXT_PUBLIC_SUPABASE_URL.startsWith('http');

    let dbStatus = 'not_configured';

    if (isSupabaseConfigured) {
        try {
            const supabase = await createClient();
            // Jalankan kueri sederhana untuk memverifikasi koneksi database
            const { data, error } = await supabase
                .from('users')
                .select('id')
                .limit(1);

            if (error) {
                dbStatus = 'disconnected';
            } else {
                dbStatus = 'connected';
            }
        } catch (err) {
            dbStatus = 'disconnected';
        }
    }

    const payload = {
        status: dbStatus === 'disconnected' ? 'unhealthy' : 'healthy',
        database: dbStatus,
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        env: process.env.NODE_ENV,
    };

    return NextResponse.json(payload, {
        status: dbStatus === 'disconnected' ? 503 : 200,
    });
});
