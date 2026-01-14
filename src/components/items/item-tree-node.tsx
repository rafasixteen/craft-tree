import { ItemInstance } from '@headless-tree/core';
import { TreeItem, TreeItemLabel } from '@/components/ui/tree';
import { TreeItemNode } from '@/components/items';
import { FolderIcon, FolderOpenIcon } from 'lucide-react';
import { Input } from '../ui/input';
import Link from 'next/link';

interface ItemTreeNodeProps
{
	item: ItemInstance<TreeItemNode>;
	visible: boolean;
}

export function ItemTreeNode({ item, visible }: ItemTreeNodeProps)
{
	return (
		<TreeItem className="data-[visible=false]:hidden" data-visible={visible} item={item}>
			<Link href={`/collections/new-collection/items/${item.getItemData().name.toLowerCase()}`}>
				<TreeItemLabel>
					<span className="flex items-center gap-2">
						{item.isFolder() &&
							(item.isExpanded() ? (
								<FolderOpenIcon className="pointer-events-none size-4 text-muted-foreground" />
							) : (
								<FolderIcon className="pointer-events-none size-4 text-muted-foreground" />
							))}
						{item.isRenaming() ? <Input {...item.getRenameInputProps()} autoFocus className="-my-0.5 h-6 px-1" /> : item.getItemName()}
					</span>
				</TreeItemLabel>
			</Link>
		</TreeItem>
	);
}
