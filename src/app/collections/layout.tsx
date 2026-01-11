import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Sidebar } from '@/components/sidebar';
import { Collection } from '@/components/collections';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

const mockCollections: Collection[] = [
	{ id: 'microtopia', name: 'Microtopia' },
	{ id: '1', name: 'My First Collection' },
	{ id: '2', name: 'Summer Projects' },
];

export default async function CollectionsLayout({ children }: { children: React.ReactNode })
{
	const session = await auth();
	if (!session) redirect('/sign-in');

	return (
		<div className="h-full w-full flex flex-col">
			{/* Panels */}
			<ResizablePanelGroup direction="horizontal" className="flex-1" autoSaveId="panels">
				{/* Left panel – sidebar */}
				<ResizablePanel defaultSize={20}>
					<Sidebar collections={mockCollections} />
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
