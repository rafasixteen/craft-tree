export function Footer()
{
	const year = new Date().getFullYear();

	return <footer className="flex h-auto min-h-11 items-center justify-center border-t py-2 text-sm md:min-h-10">&copy; {year} Craft Tree. All rights reserved.</footer>;
}
