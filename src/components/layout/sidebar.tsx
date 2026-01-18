import { Collections } from '@/components/collections';
import { Collection } from '@/domain/collection';
import { ItemTree } from '@/components/tree';

interface SidebarProps
{
	collections: Collection[];
	activeCollection: Collection;
}

export function Sidebar({ collections, activeCollection }: SidebarProps)
{
	return (
		<div className="flex flex-col p-2 gap-2">
			<Collections collections={collections} activeCollection={activeCollection} />
			<ItemTree collection={activeCollection} />
		</div>
	);
}
