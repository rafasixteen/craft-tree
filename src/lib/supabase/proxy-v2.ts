import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function supabaseProxy(request: NextRequest)
{
	let response = NextResponse.next({
		request,
	});

	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

	if (!supabaseUrl)
	{
		throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
	}

	if (!supabaseKey)
	{
		throw new Error('Missing NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY environment variable');
	}

	const supabase = createServerClient(supabaseUrl, supabaseKey, {
		cookies: {
			getAll()
			{
				return request.cookies.getAll();
			},
			setAll(cookiesToSet)
			{
				cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
				response = NextResponse.next({
					request,
				});
				cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
			},
		},
	});

	return { supabase, response };
}
