'use client';

import { ChevronDownIcon, EllipsisIcon, PlusIcon, Folder, FolderOpen, Box, CookingPot } from 'lucide-react';
import { ItemInstance } from '@headless-tree/core';
import { TreeItem } from '@/components/ui/tree';
import { Node, NodeType } from '@generated/graphql/types';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@components/ui/dropdown-menu';

interface Action
{
	label: string;
	onExecute: () => void;
}

interface ActionGroup
{
	group: Action[];
}

type ActionsByNodeType = {
	[K in NodeType]: ActionGroup[];
};

interface NodeRendererProps
{
	item: ItemInstance<Node>;
	visible: boolean;
}

export default function NodeRenderer({ item, visible }: NodeRendererProps)
{
	return (
		<TreeItem item={item} className="data-[visible=false]:hidden" data-visible={visible}>
			<div className="in-focus-visible:ring-ring/50 bg-transparent hover:bg-accent in-data-[selected=true]:bg-accent in-data-[selected=true]:text-accent-foreground in-data-[drag-target=true]:bg-accent flex items-center gap-1 rounded-sm px-2 py-1.5 text-sm transition-colors not-in-data-[folder=true]:ps-7 in-focus-visible:ring-[3px] [&_svg]:shrink-0">
				{item.isFolder() && <ChevronDownIcon className="text-muted-foreground size-4 in-aria-[expanded=false]:-rotate-90" />}
				<div className="flex items-center justify-between w-full ml-1">
					<span className="flex grow items-center gap-2">
						{DisplayIcon(item)}
						{DisplayName(item)}
					</span>

					<span className="flex items-center gap-2">
						{DisplayPlusIcon(item)}
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<EllipsisIcon className="w-4 h-4 cursor-pointer text-muted-foreground hover:text-primary" />
							</DropdownMenuTrigger>
							{DisplayContextMenu(item)}
						</DropdownMenu>
					</span>
				</div>
			</div>
		</TreeItem>
	);
}

function DisplayName(item: ItemInstance<Node>)
{
	function rename()
	{
		item.startRenaming();
	}

	if (item.isRenaming())
	{
		return <input {...item.getRenameInputProps()} />;
	}
	else
	{
		return <p onDoubleClick={rename}>{item.getItemName()}</p>;
	}
}

function DisplayIcon(item: ItemInstance<Node>)
{
	const className = 'size-4 text-muted-foreground';

	const node = item.getItemData();

	if (node.type === 'folder')
	{
		if (item.isExpanded())
		{
			return <FolderOpen className={className} />;
		}
		else
		{
			return <Folder className={className} />;
		}
	}
	else if (node.type === 'item')
	{
		return <Box className={className} />;
	}
	else
	{
		return <CookingPot className={className} />;
	}
}

function DisplayPlusIcon(item: ItemInstance<Node>)
{
	function onClick(e: React.MouseEvent)
	{
		// This prevents the click event from going to the TreeItem and causing it to expand/collapse.
		e.stopPropagation();

		item.createChild();
	}

	const node = item.getItemData();

	if (node.type === 'folder' || node.type === 'item')
	{
		return <PlusIcon className="w-4 h-4 cursor-pointer text-muted-foreground hover:text-primary" onClick={onClick} />;
	}
}

function DisplayContextMenu(item: ItemInstance<Node>): React.JSX.Element
{
	const node = item.getItemData();

	const actionsByNodeType: ActionsByNodeType = {
		folder: [
			{
				group: [
					{ label: 'New Item', onExecute: () => item.createChild() },
					{ label: 'New Folder', onExecute: () => item.createFolder() },
				],
			},
			{
				group: [
					{ label: 'Rename', onExecute: () => item.startRenaming() },
					{ label: 'Duplicate', onExecute: () => console.log('Duplicate') },
					{ label: 'Delete', onExecute: () => item.deleteItem() },
				],
			},
		],
		item: [
			{
				group: [{ label: 'New Recipe', onExecute: () => item.createChild() }],
			},
			{
				group: [
					{ label: 'Rename', onExecute: () => item.startRenaming() },
					{ label: 'Duplicate', onExecute: () => console.log('Duplicate') },
					{ label: 'Delete', onExecute: () => item.deleteItem() },
				],
			},
		],
		recipe: [
			{
				group: [
					{ label: 'Rename', onExecute: () => item.startRenaming() },
					{ label: 'Duplicate', onExecute: () => console.log('Duplicate') },
					{ label: 'Delete', onExecute: () => item.deleteItem() },
				],
			},
		],
	};

	return (
		<DropdownMenuContent side="right" align="start" className="w-48">
			{actionsByNodeType[node.type].map((group, groupIndex) => (
				<DropdownMenuGroup key={groupIndex}>
					{group.group.map((action, actionIndex) => (
						<DropdownMenuItem
							key={actionIndex}
							onSelect={() => action.onExecute()}
							onClick={(e) =>
							{
								// This prevents the click event from going to the TreeItem and causing it to expand/collapse.
								e.stopPropagation();
							}}
						>
							{action.label}
						</DropdownMenuItem>
					))}
					{groupIndex < actionsByNodeType[node.type].length - 1 && <DropdownMenuSeparator />}
				</DropdownMenuGroup>
			))}
		</DropdownMenuContent>
	);
}
