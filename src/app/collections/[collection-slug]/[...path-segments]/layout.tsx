import { BreadcrumbTrail } from '@/components';
import React from 'react';

interface LayoutProps
{
	children: React.ReactNode;
	params: Promise<{ 'collection-slug': string; 'path-segments': string[] }>;
}

export default async function Layout({ children, params }: LayoutProps)
{
	const { 'collection-slug': collectionSlug, 'path-segments': pathSegments } = await params;

	const path = pathSegments.map((segment, index) => ({
		name: segment,
		href: `/collections/${collectionSlug}/` + pathSegments.slice(0, index + 1).join('/'),
	}));

	return (
		<div className="flex h-full flex-col min-h-0">
			<div className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
				<BreadcrumbTrail path={path} />
			</div>

			<div className="flex-1 min-h-0 p-4">{children}</div>
		</div>
	);
}
