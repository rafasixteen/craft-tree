import { Collections } from '@/components/collections';
import { Collection } from '@/domain/collection';

interface SidebarProps
{
	collections: Collection[];
	activeCollection: Collection;
}

export function Sidebar({ collections, activeCollection }: SidebarProps)
{
	return (
		<div className="h-full">
			<div className="flex items-center justify-center p-2">
				<Collections collections={collections} activeCollection={activeCollection} />
			</div>
		</div>
	);
}
