import { updateSession } from '@/lib/supabase/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // List of truly protected routes that REQUIRE authentication
    const protectedRoutes = ['/dashboard', '/events/create', '/profile', '/tickets'];
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

    // Public routes that should skip authentication check entirely
    const publicRoutes = ['/events/discover', '/events/'];
    const isPublicEventRoute = publicRoutes.some(route => pathname.startsWith(route)) && !pathname.includes('/edit');

    // Skip auth check for public event pages - HUGE performance boost!
    if (isPublicEventRoute && !isProtectedRoute) {
        return NextResponse.next();
    }

    // Only check authentication for protected routes and auth pages
    const { supabaseResponse, user } = await updateSession(request);

    // Redirect authenticated users away from auth pages
    if (user && (pathname === '/login' || pathname === '/register')) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Redirect unauthenticated users from protected routes
    if (!user && isProtectedRoute) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return supabaseResponse;
}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/events/create/:path*',
        '/events/:path*',  // Still match to handle /events/[id]/edit
        '/profile/:path*',
        '/tickets/:path*',
        '/login',
        '/register',
    ],
};
