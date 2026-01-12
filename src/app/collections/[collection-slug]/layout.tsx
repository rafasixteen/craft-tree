import { getUserIdFromEmail } from '@/domain/user';
import { getUserCollections } from '@/domain/collection';
import { auth } from '@/auth';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { Sidebar } from '@/components/layout';
import { redirect } from 'next/navigation';
import React from 'react';

interface LayoutProps
{
	children: React.ReactNode;
	params: Promise<{ 'collection-slug': string }>;
}

export default async function Layout({ children, params }: LayoutProps)
{
	const session = await auth();
	if (!session) redirect('/sign-in');

	const { 'collection-slug': collectionSlug } = await params;

	const userId = await getUserIdFromEmail(session!.user!.email!);
	const collections = await getUserCollections(userId);
	const activeCollection = collections.find((collection) => collection.slug === collectionSlug);

	if (!activeCollection) redirect('/collections');

	return (
		<div className="h-full w-full flex flex-col">
			{/* Panels */}
			<ResizablePanelGroup direction="horizontal" className="flex-1" autoSaveId="panels">
				{/* Left panel – sidebar */}
				<ResizablePanel defaultSize={20}>
					<Sidebar collections={collections} activeCollection={activeCollection} />
				</ResizablePanel>

				<ResizableHandle withHandle />

				{/* Center panel – page content */}
				<ResizablePanel defaultSize={55}>
					<main className="h-full overflow-y-auto no-scrollbar">{children}</main>
				</ResizablePanel>
			</ResizablePanelGroup>
		</div>
	);
}
