'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { FieldGroup, FieldSeparator } from '@/components/ui/field';
import { signIn } from 'next-auth/react';
import { ReactNode } from 'react';

interface Provider
{
	id: string;
	name: string;
	icon: ReactNode;
}

const discord: Provider = {
	id: 'discord',
	name: 'Discord',
	icon: (
		<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-discord mr-2" viewBox="0 0 16 16">
			<path d="M13.545 2.907a13.2 13.2 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.2 12.2 0 0 0-3.658 0 8 8 0 0 0-.412-.833.05.05 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.04.04 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032q.003.022.021.037a13.3 13.3 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019q.463-.63.818-1.329a.05.05 0 0 0-.01-.059l-.018-.011a9 9 0 0 1-1.248-.595.05.05 0 0 1-.02-.066l.015-.019q.127-.095.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.05.05 0 0 1 .053.007q.121.1.248.195a.05.05 0 0 1-.004.085 8 8 0 0 1-1.249.594.05.05 0 0 0-.03.03.05.05 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.2 13.2 0 0 0 4.001-2.02.05.05 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.03.03 0 0 0-.02-.019m-8.198 7.307c-.789 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612m5.316 0c-.788 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612" />
		</svg>
	),
};

const google: Provider = {
	id: 'google',
	name: 'Google',
	icon: (
		<svg width="16" height="16" viewBox="0 0 533.5 544.3">
			<path d="M533.5 278.4c0-18.4-1.6-36.1-4.6-53.4H272v101h146.9c-6.3 33.7-25 62.3-53.4 81.5v67h86.3c50.7-46.7 80.7-115.4 80.7-196.1z" fill="#4285F4" />
			<path
				d="M272 544.3c72.9 0 134.1-24.2 178.8-65.5l-86.3-67c-24 16.1-54.7 25.6-92.5 25.6-71.1 0-131.4-47.9-153-112.1h-89v70.7c44.6 87.7 136.2 148.3 242 148.3z"
				fill="#34A853"
			/>
			<path d="M119 351.0c-10.2-30.5-10.2-63.5 0-94.0v-70.7h-89c-38.8 76.8-38.8 168.6 0 245.4l89-70.7z" fill="#FBBC05" />
			<path
				d="M272 107.1c39.6-0.6 77.2 14 106.1 40.5l79.5-79.5C403.1 24.2 341.9 0 272 0 166.2 0 74.6 60.6 30 148.3l89 70.7C140.6 155.0 200.9 107.1 272 107.1z"
				fill="#EA4335"
			/>
		</svg>
	),
};

const providers: Provider[] = [discord, google];

export function SignInForm({ className, ...props }: React.ComponentProps<'div'>)
{
	return (
		<div className={cn('flex flex-col gap-6', className)} {...props}>
			<FieldGroup>
				<div className="flex flex-col items-center gap-1 text-center">
					<h1 className="text-2xl font-bold">Sign in to your account</h1>
					<p className="text-sm text-balance text-muted-foreground">Choose one of the following providers</p>
				</div>

				<FieldSeparator />

				<div className="flex flex-wrap justify-center gap-3">
					{providers.map((provider) => (
						<Button key={provider.id} type="button" className="flex min-w-30 items-center justify-center" onClick={() => signIn(provider.id, { callbackUrl: '/' })}>
							{provider.icon}
							{provider.name}
						</Button>
					))}
				</div>
			</FieldGroup>
		</div>
	);
}
