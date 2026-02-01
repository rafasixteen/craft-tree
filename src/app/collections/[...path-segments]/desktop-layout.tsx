'use client';

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { Sidebar } from '@/components/layout';
import { BreadcrumbTrail } from '@/components';

const SIDEBAR_DEFAULT_WIDTH_PERCENTAGE = 45;
const CONTENT_DEFAULT_WIDTH_PERCENTAGE = 55;

interface DesktopLayoutProps
{
	children: React.ReactNode;
	path: { name: string; href: string }[];
	defaultLayout?: number[];
	layoutId: string;
}

export function DesktopLayout({ children, path, defaultLayout, layoutId }: DesktopLayoutProps)
{
	function onLayoutChanged(layout: number[])
	{
		document.cookie = `${layoutId}=${JSON.stringify(layout)}; path=/; max-age=31536000`;
	}

	const sidebarSize = defaultLayout?.[0] ?? SIDEBAR_DEFAULT_WIDTH_PERCENTAGE;
	const contentSize = defaultLayout?.[1] ?? CONTENT_DEFAULT_WIDTH_PERCENTAGE;

	return (
		<div className="hidden size-full flex-col md:flex">
			<ResizablePanelGroup direction="horizontal" className="flex-1" onLayout={onLayoutChanged}>
				{/* Left panel – sidebar */}
				<ResizablePanel collapsible minSize={20} defaultSize={sidebarSize}>
					<Sidebar />
				</ResizablePanel>

				<ResizableHandle withHandle />

				{/* Right panel – page content */}
				<ResizablePanel defaultSize={contentSize} minSize={30}>
					<div className="no-scrollbar flex h-full min-h-0 flex-col overflow-y-auto">
						<BreadcrumbTrail path={path} className="flex h-10 items-center border-b px-4" />
						<div className="min-h-0 flex-1">{children}</div>
					</div>
				</ResizablePanel>
			</ResizablePanelGroup>
		</div>
	);
}
