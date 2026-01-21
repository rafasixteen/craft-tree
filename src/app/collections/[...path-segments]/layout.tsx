import { getUserIdFromEmail } from '@/domain/user';
import { getUserCollections } from '@/domain/collection';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { Sidebar } from '@/components/layout';
import { auth } from '@/auth';
import { notFound } from 'next/navigation';
import { CollectionsProvider } from '@/providers/collections-context';
import { TreeNodesProvider } from '@/providers/tree-nodes-context';
import { getNodeMap } from '@/domain/tree';
import { BreadcrumbTrail } from '@/components';
import React from 'react';

interface LayoutProps
{
	children: React.ReactNode;
	params: Promise<{ 'path-segments': string[] }>;
}

export default async function Layout({ children, params }: LayoutProps)
{
	const { 'path-segments': pathSegments } = await params;

	const session = await auth();

	const userId = await getUserIdFromEmail(session!.user!.email!);
	const collections = await getUserCollections(userId);

	const collectionSlug = pathSegments[0];
	const activeCollection = collections.find((collection) => collection.slug === collectionSlug);

	if (!activeCollection) notFound();

	const initialNodes = await getNodeMap(activeCollection);

	const path = pathSegments.map((segment, index) => ({
		name: segment,
		href: `/collections/` + pathSegments.slice(0, index + 1).join('/'),
	}));

	return (
		<CollectionsProvider collections={collections} activeCollection={activeCollection}>
			<TreeNodesProvider initialNodes={initialNodes}>
				<div className="h-full w-full flex flex-col">
					{/* Panels */}
					<ResizablePanelGroup direction="horizontal" className="flex-1" autoSaveId="main-layout-panels">
						{/* Left panel – sidebar */}
						<ResizablePanel collapsible minSize={20} defaultSize={45}>
							<Sidebar />
						</ResizablePanel>

						<ResizableHandle withHandle />

						{/* Right panel – page content */}
						<ResizablePanel defaultSize={55} minSize={30}>
							<div className="h-full overflow-y-auto no-scrollbar">
								<div className="flex h-full flex-col min-h-0">
									<div className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
										<BreadcrumbTrail path={path} />
									</div>

									<div className="flex-1 min-h-0 p-4">{children}</div>
								</div>
							</div>
						</ResizablePanel>
					</ResizablePanelGroup>
				</div>
			</TreeNodesProvider>
		</CollectionsProvider>
	);
}
