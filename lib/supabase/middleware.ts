import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    });

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // Jika Supabase belum dikonfigurasi dengan URL HTTP/HTTPS yang valid, lewati pengecekan session
    if (!url || !key || !url.startsWith('http')) {
        return supabaseResponse;
    }

    const supabase = createServerClient(url, key, {
        cookies: {
            getAll() {
                return request.cookies.getAll();
            },
            setAll(cookiesToSet) {
                cookiesToSet.forEach(({ name, value }) =>
                    request.cookies.set(name, value),
                );
                supabaseResponse = NextResponse.next({
                    request,
                });
                cookiesToSet.forEach(({ name, value, options }) =>
                    supabaseResponse.cookies.set(name, value, options),
                );
            },
        },
    });

    // IMPORTANT: Avoid writing any logic between createServerClient and
    // supabase.auth.getUser(). A simple mistake can write user sessions to local
    // memory, which can cause security issues.
    const {
        data: { user },
    } = await supabase.auth.getUser();

    // Route protection:
    // 1. If no user and trying to access protected paths, redirect to login.
    const path = request.nextUrl.pathname;
    const isProtectedPath =
        path.startsWith('/dashboard') ||
        path.startsWith('/lecturer') ||
        path.startsWith('/staff') ||
        path.startsWith('/admin') ||
        path.startsWith('/courses');

    const isAuthPath =
        path === '/' ||
        path === '/login' ||
        path === '/register';

    if (!user && isProtectedPath) {
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }

    // 2. If user is logged in and tries to access landing, login or register, redirect to dashboard.
    if (user && isAuthPath) {
        const url = request.nextUrl.clone();
        url.pathname = '/dashboard';
        return NextResponse.redirect(url);
    }

    return supabaseResponse;
}
