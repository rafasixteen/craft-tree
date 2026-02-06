import { auth } from '@/auth';
import { notFound } from 'next/navigation';
import { DesktopLayout } from './desktop-layout';
import { MobileLayout } from './mobile-layout';
import { cookies } from 'next/headers';
import { getUserId } from '@/domain/user';
import { getUserCollections, CollectionsProvider } from '@/domain/collection';
import { getInventoryData, InventoryProvider } from '@/domain/inventory';
import React from 'react';

interface LayoutProps
{
	children: React.ReactNode;
	params: Promise<{ 'path-segments': string[] }>;
}

const LAYOUT_COOKIE_KEY = 'main-layout-panels';

export default async function Layout({ children, params }: LayoutProps)
{
	const { 'path-segments': pathSegments } = await params;

	const session = await auth();

	const userId = await getUserId(session!.user!.email!);
	const collections = await getUserCollections(userId!);

	const collectionSlug = pathSegments[0];
	const activeCollection = collections.find((collection) => collection.slug === collectionSlug);

	if (!activeCollection) notFound();

	const path = pathSegments.map((segment, index) => ({
		name: segment,
		href: `/collections/` + pathSegments.slice(0, index + 1).join('/'),
	}));

	const cookieStore = await cookies();
	const defaultLayoutString = cookieStore.get(LAYOUT_COOKIE_KEY)?.value;
	const defaultLayout = defaultLayoutString ? (JSON.parse(defaultLayoutString) as number[]) : undefined;

	const data = await getInventoryData(activeCollection.id);

	return (
		<CollectionsProvider collections={collections} activeCollection={activeCollection}>
			<InventoryProvider data={data}>
				{/* Desktop Layout - Resizable Panels */}
				<DesktopLayout path={path} defaultLayout={defaultLayout} layoutId={LAYOUT_COOKIE_KEY}>
					{children}
				</DesktopLayout>

				{/* Mobile Layout - Toggle View */}
				<MobileLayout path={path}>{children}</MobileLayout>
			</InventoryProvider>
		</CollectionsProvider>
	);
}
