import { ItemInstance } from '@headless-tree/core';
import { TreeItem, TreeItemLabel } from '@/components/ui/tree';
import { Node } from '@/components/items';
import { FolderIcon, FolderOpenIcon, MoreHorizontalIcon, FolderPlusIcon, FilePlusIcon, PencilIcon, TrashIcon, LucideIcon } from 'lucide-react';
import { Input } from '../ui/input';
import Link from 'next/link';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

type MenuAction = 'create-folder' | 'create-item' | 'rename' | 'delete';

interface ContextMenuItem
{
	id: MenuAction;
	label: string;
	icon: LucideIcon;
	variant?: 'default' | 'destructive';
	showForTypes: Node['type'][];
	separatorAfter?: boolean;
}

const CONTEXT_MENU_OPTIONS: ContextMenuItem[] = [
	{
		id: 'create-folder',
		label: 'New Folder',
		icon: FolderPlusIcon,
		showForTypes: ['folder'],
	},
	{
		id: 'create-item',
		label: 'New Item',
		icon: FilePlusIcon,
		showForTypes: ['folder'],
		separatorAfter: true,
	},
	{
		id: 'rename',
		label: 'Rename',
		icon: PencilIcon,
		showForTypes: ['folder', 'item', 'recipe'],
	},
	{
		id: 'delete',
		label: 'Delete',
		icon: TrashIcon,
		variant: 'destructive',
		showForTypes: ['folder', 'item', 'recipe'],
	},
];

interface ItemTreeNodeProps
{
	item: ItemInstance<Node>;
	visible: boolean;
}

export function ItemTreeNode({ item, visible }: ItemTreeNodeProps)
{
	return (
		<TreeItem className="data-[visible=false]:hidden group" data-visible={visible} item={item}>
			<Link href={item.getHref()} className="flex-1 min-w-0">
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

export function Name({ item }: { item: ItemInstance<Node> })
{
	return item.isRenaming() ? <Input {...item.getRenameInputProps()} autoFocus className="-my-0.5 h-6 px-1" /> : item.getItemName();
}

export function Icon({ item }: { item: ItemInstance<Node> })
{
	const className = 'pointer-events-none size-4 text-muted-foreground';

	if (item.isFolder())
	{
		return item.isExpanded() ? <FolderOpenIcon className={className} /> : <FolderIcon className={className} />;
	}
}

function ActionsDropdown({ item }: { item: ItemInstance<Node> })
{
	const node = item.getItemData();

	const handleAction = (action: MenuAction) =>
	{
		switch (action)
		{
			case 'create-folder':
				console.log('Create folder');
				break;
			case 'create-item':
				console.log('Create item');
				break;
			case 'rename':
				item.startRenaming();
				break;
			case 'delete':
				console.log('Delete', node.name);
				break;
		}
	};

	const visibleOptions = CONTEXT_MENU_OPTIONS.filter((option) => option.showForTypes.includes(node.type));

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				asChild
				onClick={(e) =>
				{
					e.preventDefault();
					e.stopPropagation();
				}}
			>
				<Button variant="ghost" size="icon" className="size-6 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
					<MoreHorizontalIcon className="size-4" />
					<span className="sr-only">Actions</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
				{visibleOptions.map((option, index) =>
				{
					const Icon = option.icon;
					return (
						<div key={option.id}>
							<DropdownMenuItem
								variant={option.variant}
								onClick={(e) =>
								{
									e.preventDefault();
									handleAction(option.id);
								}}
							>
								<Icon />
								{option.label}
							</DropdownMenuItem>
							{option.separatorAfter && index < visibleOptions.length - 1 && <DropdownMenuSeparator />}
						</div>
					);
				})}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
