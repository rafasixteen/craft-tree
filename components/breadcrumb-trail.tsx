'use client';

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import React from 'react';

interface BreadcrumbItemData
{
	name: string;
	href?: string;
}

interface BreadcrumbsProps extends React.ComponentProps<typeof Breadcrumb>
{
	path: BreadcrumbItemData[];
}

export function BreadcrumbTrail({ path, ...props }: BreadcrumbsProps)
{
	return (
		<Breadcrumb {...props}>
			<BreadcrumbList>
				{path.map((item, index) =>
				{
					const isLast = index === path.length - 1;

					return (
						<React.Fragment key={item.name + index}>
							{index > 0 && <BreadcrumbSeparator />}
							<BreadcrumbItem>
								{isLast ? <BreadcrumbPage>{item.name}</BreadcrumbPage> : <BreadcrumbLink href={item.href ?? '#'}>{item.name}</BreadcrumbLink>}
							</BreadcrumbItem>
						</React.Fragment>
					);
				})}
			</BreadcrumbList>
		</Breadcrumb>
	);
}
