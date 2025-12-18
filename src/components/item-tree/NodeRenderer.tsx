'use client';

import { ChevronDownIcon, EllipsisIcon, PlusIcon, Folder, FolderOpen, Box, CookingPot } from 'lucide-react';
import { ItemInstance } from '@headless-tree/core';
import { TreeItem } from '@/components/ui/tree';
import { Node, NodeType } from '@generated/graphql/types';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@components/ui/dropdown-menu';
import { Kbd, KbdGroup } from '@/components/ui/kbd';
import { useRouter } from 'next/navigation';

interface ContextAction
{
	label: string;
	execute: (item: ItemInstance<Node>) => void;
	kbd?: string[];
}

const ACTIONS: Record<string, ContextAction> = {
	newItem: {
		label: 'New Item',
		execute: (item) => item.createChild(),
		kbd: ['F'],
	},
	newFolder: {
		label: 'New Folder',
		execute: (item) => item.createFolder(),
		kbd: ['Control', 'F'],
	},
	newRecipe: {
		label: 'New Recipe',
		execute: (item) => item.createChild(),
		kbd: ['F'],
	},
	rename: {
		label: 'Rename',
		execute: (item) => item.startRenaming(),
		kbd: ['F2'],
	},
	duplicate: {
		label: 'Duplicate',
		execute: () => console.log('Duplicate'),
		kbd: ['Ctrl', 'D'],
	},
	delete: {
		label: 'Delete',
		execute: (item) => item.deleteItem(),
		kbd: ['Delete'],
	},
};

const ACTION_GROUPS: Record<NodeType, (keyof typeof ACTIONS)[][]> = {
	folder: [
		['newItem', 'newFolder'],
		['rename', 'duplicate', 'delete'],
	],
	item: [['newRecipe'], ['rename', 'duplicate', 'delete']],
	recipe: [['rename', 'duplicate', 'delete']],
};

interface NodeRendererProps
{
	item: ItemInstance<Node>;
	visible: boolean;
}

export default function NodeRenderer({ item, visible }: NodeRendererProps)
{
	const router = useRouter();

	function onItemIconClick(e: React.MouseEvent)
	{
		const node = item.getItemData();

		// I don't think i will have a folder page.
		if (node.type === 'folder') return;

		// This prevents the click event from going to the TreeItem and causing it to expand/collapse.
		e.stopPropagation();

		const href = item.getHref();

		if (href)
		{
			router.push(href);
		}
	}

	function onAddIconClick(e: React.MouseEvent)
	{
		// This prevents the click event from going to the TreeItem and causing it to expand/collapse.
		e.stopPropagation();
		item.createChild();
	}

	return (
		<TreeItem item={item} className="data-[visible=false]:hidden" data-visible={visible}>
			<div className="in-focus-visible:ring-ring/50 bg-transparent hover:bg-accent in-data-[selected=true]:bg-accent in-data-[selected=true]:text-accent-foreground in-data-[drag-target=true]:bg-accent flex items-center gap-1 rounded-sm px-2 py-1.5 text-sm transition-colors not-in-data-[folder=true]:ps-7 in-focus-visible:ring-[3px] [&_svg]:shrink-0">
				{item.isFolder() && <ChevronDownIcon className="text-muted-foreground size-4 in-aria-[expanded=false]:-rotate-90" />}
				<div className="flex items-center justify-between w-full ml-1">
					<span className="flex grow items-center gap-2">
						<ItemIcon item={item} className="size-4 text-muted-foreground" onClick={onItemIconClick} />

						<div className="flex">
							<Name item={item} />
						</div>
					</span>

					<span className="flex items-center gap-2">
						<AddIcon item={item} className="w-4 h-4 cursor-pointer text-muted-foreground hover:text-primary" onClick={onAddIconClick} />
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<EllipsisIcon className="w-4 h-4 cursor-pointer text-muted-foreground hover:text-primary" />
							</DropdownMenuTrigger>
							<ContextMenu item={item} side="right" align="start" className="w-56" />
						</DropdownMenu>
					</span>
				</div>
			</div>
		</TreeItem>
	);
}

interface NameProps extends React.HTMLAttributes<HTMLDivElement>
{
	item: ItemInstance<Node>;
}

function Name({ item }: NameProps)
{
	if (item.isRenaming())
	{
		return <input {...item.getRenameInputProps()} className="w-full mr-2" onFocus={(e) => e.currentTarget.select()} />;
	}
	else
	{
		return (
			<p className="truncate" onDoubleClick={(e) => item.startRenaming()}>
				{item.getItemName()}
			</p>
		);
	}
}

interface IconProps extends React.SVGProps<SVGSVGElement>
{
	item: ItemInstance<Node>;
}

function ItemIcon({ item, ...props }: IconProps)
{
	const node = item.getItemData();

	if (node.type === 'folder')
	{
		if (item.isExpanded())
		{
			return <FolderOpen {...props} />;
		}
		else
		{
			return <Folder {...props} />;
		}
	}
	else if (node.type === 'item')
	{
		return <Box {...props} />;
	}
	else
	{
		return <CookingPot {...props} />;
	}
}

function AddIcon({ item, ...props }: IconProps)
{
	const node = item.getItemData();

	if (node.type === 'folder' || node.type === 'item')
	{
		return <PlusIcon {...props} />;
	}
}

interface ContextMenuProps extends React.ComponentPropsWithoutRef<typeof DropdownMenuContent>
{
	item: ItemInstance<Node>;
}

function ContextMenu({ item, ...props }: ContextMenuProps)
{
	const node = item.getItemData();

	return (
		<DropdownMenuContent {...props}>
			{ACTION_GROUPS[node.type].map((group, groupIndex) => (
				<DropdownMenuGroup key={groupIndex}>
					{group.map((actionKey) =>
					{
						const action = ACTIONS[actionKey];

						return (
							<DropdownMenuItem
								key={actionKey}
								onSelect={() => action.execute(item)}
								onClick={(e) => e.stopPropagation()}
								className="flex items-center justify-between gap-3"
							>
								<span>{action.label}</span>

								{action.kbd && (
									<KbdGroup>
										{action.kbd.map((key) => (
											<Kbd key={key}>{key}</Kbd>
										))}
									</KbdGroup>
								)}
							</DropdownMenuItem>
						);
					})}

					{groupIndex < ACTION_GROUPS[node.type].length - 1 && <DropdownMenuSeparator />}
				</DropdownMenuGroup>
			))}
		</DropdownMenuContent>
	);
}
