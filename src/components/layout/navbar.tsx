'use client';

import Link from 'next/link';
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from '@/components/ui/navigation-menu';

interface NavItem
{
	label: string;
	href: string;
}

const navItems: NavItem[] = [
	{ label: 'Home', href: '/' },
	{ label: 'Collections', href: '/collections' },
];

export function Navbar()
{
	return (
		<NavigationMenu>
			<NavigationMenuList>
				{navItems.map((item) => (
					<NavigationMenuItem key={item.href}>
						<NavigationMenuLink asChild>
							<Link href={item.href} className="px-3 py-2 text-sm font-medium transition-colors">
								{item.label}
							</Link>
						</NavigationMenuLink>
					</NavigationMenuItem>
				))}
			</NavigationMenuList>
		</NavigationMenu>
	);
}
