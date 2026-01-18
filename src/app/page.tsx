import { Button } from '@/components/ui/button';
import { auth } from '@/auth';
import Link from 'next/link';

export default async function Home()
{
	const session = await auth();

	return (
		<div className="relative h-full w-full overflow-hidden">
			{/* Animated background elements */}
			<div className="absolute inset-0 overflow-hidden">
				<div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
				<div
					className="absolute top-40 right-1/4 w-96 h-96 bg-secondary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
					style={{ animationDelay: '2s' }}
				/>
				<div
					className="absolute bottom-0 left-1/3 w-96 h-96 bg-accent/10 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
					style={{ animationDelay: '4s' }}
				/>
			</div>

			{/* Content */}
			<div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
				{/* Main heading with animation */}
				<div className="space-y-6 max-w-3xl">
					<div className="space-y-4">
						<h1 className="text-5xl md:text-7xl font-bold bg-linear-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent animate-fade-in">
							Craft Your Tree
						</h1>
						<p className="text-xl md:text-2xl text-foreground/80 animate-fade-in" style={{ animationDelay: '0.2s' }}>
							Visualize crafting dependencies and material requirements
						</p>
					</div>

					{/* Description */}
					<div className="space-y-3 pt-2">
						<p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.4s' }}>
							See everything you need to craft your item. Track materials, view dependencies, and plan your crafting.
						</p>
					</div>

					{/* Call-to-action buttons */}
					<div className="flex gap-4 justify-center flex-wrap pt-8 animate-fade-in" style={{ animationDelay: '0.6s' }}>
						{session ? (
							<Button size="lg" className="text-base">
								<Link href="/collections">Collections</Link>
							</Button>
						) : (
							<Button size="lg" className="text-base">
								<Link href="/sign-in">Get Started</Link>
							</Button>
						)}
					</div>

					{/* Feature highlights */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 animate-fade-in" style={{ animationDelay: '0.8s' }}>
						<div className="p-6 rounded-lg backdrop-blur-md bg-card/50 border border-primary/10 hover:border-primary/30 transition-colors">
							<div className="text-3xl mb-2">🌳</div>
							<h3 className="font-semibold mb-2">Dependency Trees</h3>
							<p className="text-sm text-muted-foreground">Visualize all materials in a tree structure</p>
						</div>
						<div className="p-6 rounded-lg backdrop-blur-md bg-card/50 border border-primary/10 hover:border-primary/30 transition-colors">
							<div className="text-3xl mb-2">📦</div>
							<h3 className="font-semibold mb-2">Material Overview</h3>
							<p className="text-sm text-muted-foreground">List of all required materials and quantities</p>
						</div>
						<div className="p-6 rounded-lg backdrop-blur-md bg-card/50 border border-primary/10 hover:border-primary/30 transition-colors">
							<div className="text-3xl mb-2">🎮</div>
							<h3 className="font-semibold mb-2">Multi-Game Support</h3>
							<p className="text-sm text-muted-foreground">Separate collections for each game</p>
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
