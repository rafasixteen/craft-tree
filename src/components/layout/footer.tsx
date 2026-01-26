export function Footer()
{
	const year = new Date().getFullYear();

	return <footer className="flex items-center justify-center text-sm border-t h-auto min-h-11 md:min-h-10 py-2">&copy; {year} Craft Tree. All rights reserved.</footer>;
}
