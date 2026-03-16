'use server';

import { createClient } from '@/lib/supabase/server';
import { Provider } from '@supabase/supabase-js';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export async function signInWithProvider(provider: Provider)
{
	const supabase = await createClient();
	const origin = (await headers()).get('origin');

	const { error, data } = await supabase.auth.signInWithOAuth({
		provider: provider,
		options: {
			redirectTo: `${origin}/auth/callback`,
		},
	});

	if (error)
	{
		redirect(`/sign-in?error=${encodeURIComponent(error.message)}`);
	}

	redirect(data.url);
}

export async function signInWithPassword({ email, password }: { email: string; password: string })
{
	const supabase = await createClient();
	const { error } = await supabase.auth.signInWithPassword({ email, password });

	if (error)
	{
		redirect(`/sign-in?error=${encodeURIComponent(error.message)}`);
	}

	redirect('/inventories');
}
