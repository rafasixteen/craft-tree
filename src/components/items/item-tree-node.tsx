import { ItemInstance } from '@headless-tree/core';
import { TreeItem, TreeItemLabel } from '@/components/ui/tree';
import { Node } from '@/components/items';
import { FolderIcon, FolderOpenIcon } from 'lucide-react';
import { Input } from '../ui/input';
import Link from 'next/link';

interface ItemTreeNodeProps
{
	item: ItemInstance<Node>;
	visible: boolean;
}

export function ItemTreeNode({ item, visible }: ItemTreeNodeProps)
{
	return (
		<TreeItem className="data-[visible=false]:hidden" data-visible={visible} item={item}>
			<Link href={item.getHref()}>
				<TreeItemLabel>
					<span className="flex items-center gap-2">
						<Icon item={item} />
						{item.isRenaming() ? <Input {...item.getRenameInputProps()} autoFocus className="-my-0.5 h-6 px-1" /> : item.getItemName()}
					</span>
				</TreeItemLabel>
			</Link>
		</TreeItem>
	);
}

export function Icon({ item }: { item: ItemInstance<Node> })
{
	const className = 'pointer-events-none size-4 text-muted-foreground';

	if (item.isFolder())
	{
		return item.isExpanded() ? <FolderOpenIcon className={className} /> : <FolderIcon className={className} />;
	}
}
