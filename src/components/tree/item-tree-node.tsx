import { ItemInstance } from '@headless-tree/core';
import { TreeItem, TreeItemLabel } from '@/components/ui/tree';
import { Node } from '@/domain/tree';
import { FolderIcon, FolderOpenIcon, EllipsisVerticalIcon, CuboidIcon, CookingPotIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ButtonSpan } from '@/components/ui/button-span';
import { useMemo } from 'react';
import Link from 'next/link';

interface ItemTreeNodeProps
{
	item: ItemInstance<Node>;
	visible: boolean;
}

export function ItemTreeNode({ item, visible }: ItemTreeNodeProps)
{
	return (
		<TreeItem className="data-[visible=false]:hidden group" data-visible={visible} item={item}>
			<Link href={item.getHref()}>
				<TreeItemLabel>
					<div className="flex items-center justify-between flex-1 gap-2">
						<span className="flex items-center gap-2">
							<Icon item={item} />
							<Name item={item} />
						</span>
						<ActionsDropdown item={item} />
					</div>
				</TreeItemLabel>
			</Link>
		</TreeItem>
	);
}

function Icon({ item }: { item: ItemInstance<Node> })
{
	const className = 'pointer-events-none size-4 text-muted-foreground';

	const node = item.getItemData();

	switch (node.type)
	{
		case 'folder':
		{
			return item.isExpanded() ? <FolderOpenIcon className={className} /> : <FolderIcon className={className} />;
		}
		case 'item':
		{
			return <CuboidIcon className={className} />;
		}
		case 'recipe':
		{
			return <CookingPotIcon className={className} />;
		}
		default:
			return <></>;
	}

	if (item.isFolder())
	{
		return item.isExpanded() ? <FolderOpenIcon className={className} /> : <FolderIcon className={className} />;
	}
}

function Name({ item }: { item: ItemInstance<Node> })
{
	return item.isRenaming() ? <Input {...item.getRenameInputProps()} autoFocus className="-my-0.5 h-6 px-1" /> : item.getItemName();
}

function ActionsDropdown({ item }: { item: ItemInstance<Node> })
{
	const DropdownContent = useMemo(() => item.getDropdownContent(), [item]);

	if (!DropdownContent) return null;

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<ButtonSpan variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
					<EllipsisVerticalIcon className="size-4" />
				</ButtonSpan>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start" side="bottom">
				<DropdownContent item={item} />
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
