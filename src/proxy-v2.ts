import { NextResponse, type NextRequest } from 'next/server';
import { supabaseProxy } from '@/lib/supabase/proxy-v2';

export async function proxyV2(request: NextRequest)
{
	const { supabase, response } = await supabaseProxy(request);

	const { data, error } = await supabase.auth.getClaims();

	console.log('Claims:', data, error);

	if (error || (!data && !request.nextUrl.pathname.startsWith('/sign-in') && !request.nextUrl.pathname.startsWith('/auth/callback')))
	{
		return NextResponse.redirect(new URL('/sign-in', request.url));
	}

	return response;
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * Feel free to modify this pattern to include more paths.
		 */
		'/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
	],
};
