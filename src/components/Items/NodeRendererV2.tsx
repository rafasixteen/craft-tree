'use client';

import { ChevronDownIcon, EllipsisIcon, PlusIcon, File, Folder, FolderOpen } from 'lucide-react';
import { ItemInstance } from '@headless-tree/core';
import { TreeItem } from '@/components/ui/tree';
import { Node, NodeType } from '@generated/graphql/types';
import { createNode, updateNode } from '@/lib/graphql/nodes';
import { createItem, updateItem } from '@/lib/graphql/items';
import { createRecipe } from '@/lib/graphql/recipes';
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
	refreshTree: () => void;
}

export default function NodeRendererV2({ item, visible, refreshTree }: NodeRendererProps)
{
	function toggleItemExpansion()
	{
		if (!item.isFolder()) return;
		return item.isExpanded() ? item.collapse() : item.expand();
	}

	return (
		<TreeItem item={item} className="data-[visible=false]:hidden" data-visible={visible}>
			<div className="in-focus-visible:ring-ring/50 bg-transparent hover:bg-accent in-data-[selected=true]:bg-accent in-data-[selected=true]:text-accent-foreground in-data-[drag-target=true]:bg-accent flex items-center gap-1 rounded-sm px-2 py-1.5 text-sm transition-colors not-in-data-[folder=true]:ps-7 in-focus-visible:ring-[3px] [&_svg]:shrink-0">
				{item.isFolder() && <ChevronDownIcon className="text-muted-foreground mr-1 size-4 in-aria-[expanded=false]:-rotate-90" onClick={toggleItemExpansion} />}
				<div className="flex items-center justify-between w-full">
					<span className="flex grow items-center gap-2" onClick={toggleItemExpansion}>
						{DisplayIcon(item)}
						{DisplayName(item)}
					</span>

					<span className="flex items-center gap-2">
						{DisplayPlusIcon(item, refreshTree)}
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<EllipsisIcon className="w-4 h-4 cursor-pointer text-muted-foreground hover:text-primary" />
							</DropdownMenuTrigger>
							{DisplayContextMenu(item.getItemData(), refreshTree)}
						</DropdownMenu>
					</span>
				</div>
			</div>
		</TreeItem>
	);
}

function DisplayName(item: ItemInstance<Node>)
{
	return item.getItemName();
}

function DisplayIcon(item: ItemInstance<Node>)
{
	const className = 'size-4 text-muted-foreground';

	if (!item.isFolder())
	{
		return <File className={className} />;
	}

	if (item.isExpanded())
	{
		return <FolderOpen className={className} />;
	}
	else
	{
		return <Folder className={className} />;
	}
}

function DisplayPlusIcon(item: ItemInstance<Node>, refreshTree: () => void)
{
	function onClick()
	{
		const node = item.getItemData();

		if (node.type === 'folder')
		{
			createItemNode(node, refreshTree);
		}
		else if (node.type === 'item')
		{
			createRecipeNode(node, refreshTree);
		}
	}

	const node = item.getItemData();

	if (node.type === 'folder' || node.type === 'item')
	{
		return <PlusIcon className="w-4 h-4 cursor-pointer text-muted-foreground hover:text-primary" onClick={onClick} />;
	}
}

function DisplayContextMenu(node: Node, refreshTree: () => void): React.JSX.Element
{
	const actionsByNodeType: ActionsByNodeType = {
		folder: [
			{
				group: [
					{ label: 'New Item', onExecute: () => createItemNode(node, refreshTree) },
					{ label: 'New Folder', onExecute: () => createFolderNode(node, refreshTree) },
				],
			},
			{
				group: [
					{ label: 'Rename', onExecute: () => console.log('Rename') },
					{ label: 'Duplicate', onExecute: () => console.log('Duplicate') },
					{ label: 'Delete', onExecute: () => console.log('Delete') },
				],
			},
		],
		item: [
			{
				group: [{ label: 'New Recipe', onExecute: () => createRecipeNode(node, refreshTree) }],
			},
			{
				group: [
					{ label: 'Rename', onExecute: () => console.log('Rename') },
					{ label: 'Duplicate', onExecute: () => console.log('Duplicate') },
					{ label: 'Delete', onExecute: () => console.log('Delete') },
				],
			},
		],
		recipe: [
			{
				group: [
					{ label: 'Rename', onExecute: () => console.log('Rename') },
					{ label: 'Duplicate', onExecute: () => console.log('Duplicate') },
					{ label: 'Delete', onExecute: () => console.log('Delete') },
				],
			},
		],
	};

	return (
		<DropdownMenuContent side="right" align="start" className="w-48">
			{actionsByNodeType[node.type].map((group, groupIndex) => (
				<DropdownMenuGroup key={groupIndex}>
					{group.group.map((action, actionIndex) => (
						<DropdownMenuItem key={actionIndex} onSelect={() => action.onExecute()}>
							{action.label}
						</DropdownMenuItem>
					))}
					{groupIndex < actionsByNodeType[node.type].length - 1 && <DropdownMenuSeparator />}
				</DropdownMenuGroup>
			))}
		</DropdownMenuContent>
	);
}

async function createFolderNode(parent: Node, refreshTree: () => void)
{
	const newNode = await createNode(
		{
			data: {
				name: 'New Folder',
				type: 'folder',
				parentId: parent.id,
			},
		},
		['id'],
	);

	refreshTree();
}

async function createItemNode(parent: Node, refreshTree: () => void)
{
	const newItem = await createItem(
		{
			data: {
				name: 'New Item',
			},
		},
		['id', 'name'],
	);

	const newNode = await createNode(
		{
			data: {
				name: newItem.name,
				type: 'item',
				resourceId: newItem.id,
				parentId: parent.id,
			},
		},
		['id'],
	);

	refreshTree();
}

async function createRecipeNode(parent: Node, refreshTree: () => void)
{
	if (!parent.resourceId)
	{
		console.error('Cannot create recipe: parent.resourceId is missing', parent);
		return;
	}

	const newRecipe = await createRecipe(
		{
			data: {
				itemId: parent.resourceId,
				quantity: 1,
				time: 1,
			},
		},
		['id'],
	);

	const newNode = await createNode(
		{
			data: {
				name: 'New Recipe',
				type: 'recipe',
				resourceId: newRecipe.id,
				parentId: parent.id,
			},
		},
		['id'],
	);

	refreshTree();
}

async function renameNode(node: Node, newName: string, refreshTree: () => void)
{
	const updatedNode = await updateNode(
		{
			id: node.id,
			data: {
				name: newName,
			},
		},
		['id'],
	);

	if (node.type === 'item')
	{
		const updatedItem = await updateItem(
			{
				id: node.resourceId!,
				data: {
					name: newName,
				},
			},
			['id'],
		);
	}

	refreshTree();
}
