'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function CollectionNotFound()
{
	return (
		<div className="relative flex h-full flex-col items-center justify-center text-center overflow-hidden">
			{/* Animated background elements */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
				<div className="absolute bottom-20 right-10 w-72 h-72 bg-secondary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000" />
			</div>

			{/* Content */}
			<div className="relative z-10 space-y-6">
				{/* 404 Number with animation */}
				<div className="space-y-2">
					<div className="text-7xl font-bold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent animate-bounce">404</div>
					<p className="text-lg font-semibold text-muted-foreground">Collection Not Found</p>
				</div>

				{/* Description */}
				<div className="space-y-2 max-w-md">
					<p className="text-foreground/80 animate-fade-in">The collection you&apos;re looking for doesn&apos;t exist.</p>
					<p className="text-sm text-muted-foreground">Let&apos;s get you back on track!</p>
				</div>

				{/* Action buttons */}
				<div className="flex gap-3 justify-center flex-wrap pt-4">
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
