'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function CollectionNotFound()
{
	return (
		<div className="relative flex h-full flex-col items-center justify-center overflow-hidden text-center">
			{/* Animated background elements */}
			<div className="pointer-events-none absolute inset-0 overflow-hidden">
				<div className="absolute top-20 left-10 size-72 animate-pulse rounded-full bg-primary/10 opacity-20 mix-blend-multiply blur-3xl filter" />
				<div className="animation-delay-2000 absolute right-10 bottom-20 size-72 animate-pulse rounded-full bg-secondary/10 opacity-20 mix-blend-multiply blur-3xl filter" />
			</div>

			{/* Content */}
			<div className="relative z-10 space-y-6">
				{/* 404 Number with animation */}
				<div className="space-y-2">
					<div className="animate-bounce bg-linear-to-r from-primary to-secondary bg-clip-text text-7xl font-bold text-transparent">404</div>
					<p className="text-lg font-semibold text-muted-foreground">Collection Not Found</p>
				</div>

				{/* Description */}
				<div className="max-w-md space-y-2">
					<p className="animate-fade-in text-foreground/80">The collection you&apos;re looking for doesn&apos;t exist.</p>
					<p className="text-sm text-muted-foreground">Let&apos;s get you back on track!</p>
				</div>

				{/* Action buttons */}
				<div className="flex flex-wrap justify-center gap-3 pt-4">
					<Button asChild>
						<Link href="/collections">Collections</Link>
					</Button>
					<Button variant="outline" asChild>
						<Link href="/">Home</Link>
					</Button>
				</div>
			</div>

			{/* CSS for animations */}
			<style>{`
				@keyframes fade-in {
					from {
						opacity: 0;
						transform: translateY(10px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}

				.animate-fade-in {
					animation: fade-in 0.8s ease-out 0.3s both;
				}

				.animation-delay-2000 {
					animation-delay: 2s;
				}
			`}</style>
		</div>
	);
}
