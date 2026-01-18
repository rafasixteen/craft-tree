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
		<div className="relative h-full w-full overflow-hidden">
			{/* Animated background elements */}
			<div className="absolute inset-0 overflow-hidden">
				<div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
				<div
					className="absolute bottom-40 left-1/4 w-96 h-96 bg-secondary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
					style={{ animationDelay: '2s' }}
				/>
			</div>

			{/* Content */}
			<div className="relative z-10 flex h-full flex-col items-center justify-center gap-6 p-6 md:p-10">
				<div className="w-full max-w-sm animate-fade-in" style={{ animationDelay: '0.2s' }}>
					<SignInForm />
				</div>
				{errorMessage && (
					<p className={cn('text-xs text-destructive text-center transition-opacity duration-500 animate-fade-in', visible ? 'opacity-100' : 'opacity-0')}>
						{errorMessage}
					</p>
				)}
			</div>

			{/* CSS for animations */}
			<style>{`
				@keyframes fade-in {
					from {
						opacity: 0;
						transform: translateY(20px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}

				.animate-fade-in {
					animation: fade-in 0.8s ease-out forwards;
					opacity: 0;
				}
			`}</style>
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
