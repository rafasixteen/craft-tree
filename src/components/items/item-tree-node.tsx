import { ItemInstance } from '@headless-tree/core';
import { TreeItem, TreeItemLabel } from '@/components/ui/tree';
import { Item } from '@/components/items';
import { FolderIcon, FolderOpenIcon } from 'lucide-react';

interface ItemTreeNodeProps
{
	item: ItemInstance<Item>;
	visible: boolean;
}

export function ItemTreeNode({ item, visible }: ItemTreeNodeProps)
{
	return (
		<TreeItem className="data-[visible=false]:hidden" data-visible={visible} item={item}>
			<TreeItemLabel>
				<span className="flex items-center gap-2">
					{item.isFolder() &&
						(item.isExpanded() ? (
							<FolderOpenIcon className="pointer-events-none size-4 text-muted-foreground" />
						) : (
							<FolderIcon className="pointer-events-none size-4 text-muted-foreground" />
						))}
					{item.getItemName()}
				</span>
			</TreeItemLabel>
		</TreeItem>
	);
}
