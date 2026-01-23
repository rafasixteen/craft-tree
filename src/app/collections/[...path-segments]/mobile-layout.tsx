'use client';

import { useEffect, useRef, useState } from 'react';
import { Sidebar } from '@/components/layout';
import { BreadcrumbTrail } from '@/components';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

type MobileTab = 'sidebar' | 'content';

interface MobileLayoutProps
{
	children: React.ReactNode;
	path: { name: string; href: string }[];
}

export function MobileLayout({ children, path }: MobileLayoutProps)
{
	const [tabValue, setTabValue] = useState<MobileTab>('sidebar');

	const containerRef = useRef<HTMLDivElement | null>(null);
	const [isDragging, setIsDragging] = useState(false);
	const [dragStartX, setDragStartX] = useState<number | null>(null);
	const [dragOffsetX, setDragOffsetX] = useState(0);
	const [containerWidth, setContainerWidth] = useState(0);

	useEffect(() =>
	{
		const measure = () =>
		{
			const width = containerRef.current?.offsetWidth ?? 0;
			setContainerWidth(width);
		};
		measure();
		window.addEventListener('resize', measure);
		return () => window.removeEventListener('resize', measure);
	}, []);

	const index = tabValue === 'sidebar' ? 0 : 1;

	const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) =>
	{
		if (e.touches.length !== 1) return;
		setIsDragging(true);
		setDragStartX(e.touches[0].clientX);
		setDragOffsetX(0);
	};

	const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) =>
	{
		if (!isDragging || dragStartX == null) return;
		const currentX = e.touches[0].clientX;
		const deltaX = currentX - dragStartX;
		setDragOffsetX(deltaX);
	};

	const handleTouchEnd = () =>
	{
		if (!isDragging) return;
		const width = containerRef.current?.offsetWidth ?? 0;
		const threshold = Math.max(60, width * 0.25);
		let nextIndex = index;

		// Negative offset = swipe left -> go to next page
		if (dragOffsetX <= -threshold && index < 1)
		{
			nextIndex = index + 1;
		}
		// Positive offset = swipe right -> go to previous page
		else if (dragOffsetX >= threshold && index > 0)
		{
			nextIndex = index - 1;
		}

		setIsDragging(false);
		setDragStartX(null);
		setDragOffsetX(0);

		setTabValue(nextIndex === 0 ? 'sidebar' : 'content');
	};

	const baseX = -index * containerWidth;

	const translateX = baseX + (isDragging ? dragOffsetX : 0);
	const containerStyle: React.CSSProperties = {
		transform: `translateX(${translateX}px)`,
		transition: isDragging ? 'none' : 'transform 300ms ease',
	};

	return (
		<div className="md:hidden flex flex-col h-full w-full">
			<Tabs value={tabValue} onValueChange={(v) => setTabValue(v as MobileTab)} className="flex flex-col h-full w-full">
				{/* Main content area with horizontal pager */}
				<div className="flex-1 overflow-hidden" ref={containerRef} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
					<div className="flex h-full w-full" style={containerStyle}>
						{/* Sidebar Pane */}
						<div className="h-full w-full shrink-0">
							<Sidebar />
						</div>

						{/* Content Pane */}
						<div className="h-full w-full shrink-0">
							<div className="h-full overflow-y-auto">
								<div className="flex h-full flex-col min-h-0">
									<div className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
										<BreadcrumbTrail path={path} />
									</div>

									<div className="flex-1 min-h-0">{children}</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Bottom Tab Bar */}
				<TabsList className="h-14 w-full bg-background" variant="line">
					<TabsTrigger value="sidebar" className="flex flex-col items-center justify-center gap-1 flex-1 h-full data-[state=active]:bg-muted/50">
						<span className="text-xs font-medium">Sidebar</span>
					</TabsTrigger>

					<TabsTrigger value="content" className="flex flex-col items-center justify-center gap-1 flex-1 h-full data-[state=active]:bg-muted/50">
						<span className="text-xs font-medium">Content</span>
					</TabsTrigger>
				</TabsList>
			</Tabs>
		</div>
	);
}
