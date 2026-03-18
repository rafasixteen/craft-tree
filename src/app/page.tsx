import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export default async function Home()
{
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	return (
		<div className="flex flex-1 py-4">
			{/* Animated background elements */}
			<div className="absolute inset-0 overflow-hidden">
				<div className="absolute top-0 left-1/4 size-48 animate-pulse rounded-full bg-primary/10 opacity-20 mix-blend-multiply blur-3xl filter sm:size-96" />
				<div
					className="absolute top-40 right-1/4 size-48 animate-pulse rounded-full bg-secondary/10 opacity-20 mix-blend-multiply blur-3xl filter sm:size-96"
					style={{ animationDelay: '2s' }}
				/>
				<div
					className="absolute bottom-0 left-1/3 size-48 animate-pulse rounded-full bg-accent/10 opacity-20 mix-blend-multiply blur-3xl filter sm:size-96"
					style={{ animationDelay: '4s' }}
				/>
			</div>

			{/* Content */}
			<div className="relative z-10 flex w-full items-center justify-center px-4 text-center">
				{/* Main heading with animation */}
				<div className="mx-auto max-w-3xl space-y-6">
					<div className="space-y-4">
						<h1 className="animate-fade-in bg-linear-to-r from-primary via-primary/80 to-secondary bg-clip-text text-3xl font-bold text-transparent sm:text-5xl md:text-6xl lg:text-7xl">
							Craft Your Tree
						</h1>
						<p
							className="animate-fade-in text-base text-foreground/80 sm:text-lg md:text-xl lg:text-2xl"
							style={{ animationDelay: '0.2s' }}
						>
							Visualize crafting dependencies and material
							requirements
						</p>
					</div>

					{/* Description */}
					<div className="space-y-3 pt-2">
						<p
							className="animate-fade-in mx-auto max-w-2xl text-sm text-muted-foreground sm:text-base md:text-lg"
							style={{ animationDelay: '0.4s' }}
						>
							See everything you need to craft your item. Track
							materials, view dependencies, and plan your
							crafting.
						</p>
					</div>

					{/* Call-to-action buttons */}
					<div
						className="animate-fade-in flex flex-wrap justify-center gap-3 pt-8 sm:gap-4"
						style={{ animationDelay: '0.6s' }}
					>
						{user ? (
							<Button size="lg" className="text-sm sm:text-base">
								<Link href="/inventories">Inventories</Link>
							</Button>
						) : (
							<Button size="lg" className="text-sm sm:text-base">
								<Link href="/sign-in">Get Started</Link>
							</Button>
						)}
					</div>

					{/* Feature highlights */}
					<div
						className="animate-fade-in grid grid-cols-1 gap-4 pt-8 sm:grid-cols-2 sm:gap-6 sm:pt-12 lg:grid-cols-3"
						style={{ animationDelay: '0.8s' }}
					>
						<div className="rounded-lg border border-primary/10 bg-card/50 p-4 backdrop-blur-md transition-colors hover:border-primary/30 sm:p-6">
							<div className="mb-2 text-2xl sm:text-3xl">🌳</div>
							<h3 className="mb-2 text-sm font-semibold sm:text-base">
								Dependency Trees
							</h3>
							<p className="text-xs text-muted-foreground sm:text-sm">
								Visualize all materials in a tree structure
							</p>
						</div>
						<div className="rounded-lg border border-primary/10 bg-card/50 p-4 backdrop-blur-md transition-colors hover:border-primary/30 sm:p-6">
							<div className="mb-2 text-2xl sm:text-3xl">📦</div>
							<h3 className="mb-2 text-sm font-semibold sm:text-base">
								Material Overview
							</h3>
							<p className="text-xs text-muted-foreground sm:text-sm">
								List of all required materials and quantities
							</p>
						</div>
						<div className="rounded-lg border border-primary/10 bg-card/50 p-4 backdrop-blur-md transition-colors hover:border-primary/30 sm:col-span-2 sm:p-6 lg:col-span-1">
							<div className="mb-2 text-2xl sm:text-3xl">🎮</div>
							<h3 className="mb-2 text-sm font-semibold sm:text-base">
								Multi-Game Support
							</h3>
							<p className="text-xs text-muted-foreground sm:text-sm">
								Separate inventories for each game
							</p>
						</div>
					</div>
				</div>
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
