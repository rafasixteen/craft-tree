import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/server';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default function SignInPage()
{
	async function signIn()
	{
		'use server';

		const supabase = await createClient();
		const origin = (await headers()).get('origin');

		const { error, data } = await supabase.auth.signInWithOAuth({
			provider: 'google',
			options: {
				redirectTo: `${origin}/auth/callback`,
			},
		});

		if (error)
		{
			console.error('Error signing in:', error);
		}
		else
		{
			redirect(data.url);
		}
	}

	return (
		<form action={signIn} className="flex min-h-screen flex-1 items-center justify-center">
			<Button type="submit" size="lg">
				Sign In
			</Button>
		</form>
	);
}
