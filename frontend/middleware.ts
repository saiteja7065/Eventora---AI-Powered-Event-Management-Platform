import { updateSession } from '@/lib/supabase/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    const { supabaseResponse, user } = await updateSession(request);

    const { pathname } = request.nextUrl;

    // Redirect authenticated users away from auth pages
    if (user && (pathname === '/login' || pathname === '/register')) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Redirect unauthenticated users from protected routes
    const protectedRoutes = ['/dashboard', '/events/create', '/events', '/profile', '/tickets'];
    if (!user && protectedRoutes.some(route => pathname.startsWith(route))) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return supabaseResponse;
}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/events/create/:path*',
        '/events/:path*',
        '/profile/:path*',
        '/tickets/:path*',
        '/login',
        '/register',
    ],
};
