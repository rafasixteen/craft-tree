'use client';

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { Sidebar } from '@/components/layout';
import { BreadcrumbTrail } from '@/components';

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

	return (
		<div className="hidden md:flex h-full w-full flex-col">
			<ResizablePanelGroup direction="horizontal" className="flex-1" onLayout={onLayoutChanged}>
				{/* Left panel – sidebar */}
				<ResizablePanel collapsible minSize={20} defaultSize={defaultLayout?.[0] ?? 45}>
					<Sidebar />
				</ResizablePanel>

				<ResizableHandle withHandle />

				{/* Right panel – page content */}
				<ResizablePanel defaultSize={defaultLayout?.[1] ?? 55} minSize={30}>
					<div className="h-full overflow-y-auto no-scrollbar">
						<div className="flex h-full flex-col min-h-0">
							<div className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
								<BreadcrumbTrail path={path} />
							</div>

							<div className="flex-1 min-h-0">{children}</div>
						</div>
					</div>
				</ResizablePanel>
			</ResizablePanelGroup>
		</div>
	);
}
