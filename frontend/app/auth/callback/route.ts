import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get('code');
    const next = searchParams.get('next') ?? '/onboarding'; // Default to onboarding for new users

    if (code) {
        const supabase = await createClient();
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error && data.session) {
            // Check if user has completed onboarding by checking preferences
            const { data: preferences } = await supabase
                .from('user_preferences')
                .select('*')
                .eq('user_id', data.session.user.id)
                .single();

            // Decide where to redirect
            const redirectPath = preferences ? '/dashboard' : '/onboarding';

            const forwardedHost = request.headers.get('x-forwarded-host');
            const isLocalEnv = process.env.NODE_ENV === 'development';

            if (isLocalEnv) {
                return NextResponse.redirect(`${origin}${redirectPath}`);
            } else if (forwardedHost) {
                return NextResponse.redirect(`https://${forwardedHost}${redirectPath}`);
            } else {
                return NextResponse.redirect(`${origin}${redirectPath}`);
            }
        }

        // Log error for debugging
        if (error) {
            console.error('OAuth callback error:', error);
        }
    }

    // Return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/auth/login?error=oauth_failed`);
}
