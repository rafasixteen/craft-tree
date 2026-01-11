'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SignInForm } from '@/components/auth';
import { cn } from '@/lib/utils';

// TODO: Fix me - Error message doesn't fade out as it should, it simply disappears after 3 seconds.

export default function SignInPage()
{
	const router = useRouter();
	const searchParams = useSearchParams();
	const error = searchParams.get('error');

	const errorMessage = getErrorMessage(error);
	const [visible, setVisible] = useState(true);

	useEffect(() =>
	{
		if (!errorMessage) return;

		const timer = setTimeout(() =>
		{
			setVisible(false);

			if (error)
			{
				const params = new URLSearchParams(searchParams.toString());
				params.delete('error');
				router.replace(`?${params.toString()}`, { scroll: false });
			}
		}, 3000);

		return () => clearTimeout(timer);
	}, [errorMessage, error, router, searchParams]);

	return (
		<div className="flex h-full flex-col items-center justify-center gap-6 p-6 md:p-10">
			<div className="w-full max-w-sm">
				<SignInForm />
			</div>
			{errorMessage && <p className={cn('text-xs text-destructive text-center transition-opacity duration-500', visible ? 'opacity-100' : 'opacity-0')}>{errorMessage}</p>}
		</div>
	);
}

function getErrorMessage(error: string | null): string | null
{
	if (error == null) return null;

	switch (error)
	{
		case 'OAuthAccountNotLinked':
			return 'Use another provider to login.';
		default:
			return 'Something went wrong. Please try again.';
	}
}
