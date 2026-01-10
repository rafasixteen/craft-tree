import { Collection, Collections } from '@/components/collections';

interface SidebarProps
{
	collections: Collection[];
}

export function Sidebar({ collections }: SidebarProps)
{
	return (
		<div className="h-full">
			<div className="flex items-center justify-center p-2">
				<Collections collections={collections} />
			</div>
		</div>
	);
}
