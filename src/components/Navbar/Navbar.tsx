'use client';

import * as React from 'react';
import Link from 'next/link';
import { useIsMobile } from '@/hooks/use-is-mobile';

import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';

export default function Navbar()
{
	const { isMobile } = useIsMobile();

	return (
		<NavigationMenu viewport={isMobile}>
			<NavigationMenuList className="flex-wrap">
				<NavigationMenuItem>
					<NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
						<Link href="/">Home</Link>
					</NavigationMenuLink>
				</NavigationMenuItem>

				<NavigationMenuItem className="hidden md:block">
					<NavigationMenuTrigger>Item</NavigationMenuTrigger>
					<NavigationMenuContent>
						<ul className="grid w-[300px] gap-4">
							<li>
								<NavigationMenuLink asChild>
									<Link href="#">
										<div className="font-medium">Components</div>
										<div className="text-muted-foreground">Browse all components in the library.</div>
									</Link>
								</NavigationMenuLink>
								<NavigationMenuLink asChild>
									<Link href="#">
										<div className="font-medium">Documentation</div>
										<div className="text-muted-foreground">Learn how to use the library.</div>
									</Link>
								</NavigationMenuLink>
								<NavigationMenuLink asChild>
									<Link href="#">
										<div className="font-medium">Blog</div>
										<div className="text-muted-foreground">Read our latest blog posts.</div>
									</Link>
								</NavigationMenuLink>
							</li>
						</ul>
					</NavigationMenuContent>
				</NavigationMenuItem>
			</NavigationMenuList>
		</NavigationMenu>
	);
}

function ListItem({ title, children, href, ...props }: React.ComponentPropsWithoutRef<'li'> & { href: string })
{
	return (
		<li {...props}>
			<NavigationMenuLink asChild>
				<Link href={href}>
					<div className="text-sm leading-none font-medium">{title}</div>
					<p className="text-muted-foreground line-clamp-2 text-sm leading-snug">{children}</p>
				</Link>
			</NavigationMenuLink>
		</li>
	);
}
