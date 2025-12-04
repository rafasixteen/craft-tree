export default function Home()
{
	return (
		<main className="flex-1 flex flex-col bg-background text-foreground items-center justify-center p-8 text-center">
			<div className="max-w-2xl mx-auto">
				<h1 className="text-5xl font-bold mb-6 tracking-tight">Craft Tree</h1>
				<p className="text-lg text-muted-foreground mb-10">Build, explore, and visualize crafting recipes with ease.</p>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mt-6">
					<Card title="Items" description="Browse all available items and materials." href="/items" />
					<Card title="Recipes" description="Explore how items can be crafted step‑by‑step." href="/recipes" />
				</div>
			</div>
		</main>
	);
}

function Card({ title, description, href }: { title: string; description: string; href: string })
{
	return (
		<a href={href} className="p-6 rounded-2xl shadow hover:shadow-lg transition-all border">
			<h2 className="text-xl font-semibold mb-2">{title}</h2>
			<p className="text-muted-foreground text-sm">{description}</p>
		</a>
	);
}
