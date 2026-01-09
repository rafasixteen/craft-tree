export default function Page()
{
	return (
		<div className="p-4 space-y-8">
			<h1 className="text-2xl font-bold">Welcome to Craft Tree!</h1>

			<p>
				Craft Tree is a place where ideas grow, branches connect, and creativity spreads outward. Scroll down to explore more content and see how the page extends far
				beyond its parent container.
			</p>

			{/* Repeated content blocks */}
			{Array.from({ length: 20 }).map((_, index) => (
				<section key={index} className="border rounded-lg p-4 shadow-sm space-y-2">
					<h2 className="text-xl font-semibold">Section {index + 1}</h2>
					<p>
						This is a content section designed to increase the overall height of the page. Each section contains text, spacing, and structure that contributes to
						vertical overflow.
					</p>
					<p>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
						nostrud exercitation ullamco laboris.
					</p>
				</section>
			))}

			{/* Extra vertical space at the bottom */}
			<div className="h-[800px] bg-primary/80 rounded-lg flex items-center justify-center">
				<span className="text-gray-500">Extra vertical space (800px tall)</span>
			</div>
		</div>
	);
}
