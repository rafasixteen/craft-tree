'use client';

import { ChevronDownIcon, EllipsisIcon, PlusIcon, Folder, FolderOpen, Box, CookingPot } from 'lucide-react';
import { ItemInstance } from '@headless-tree/core';
import { TreeItem } from '@/components/ui/tree';
import { Node, NodeType } from '@generated/graphql/types';
import { createNode, deleteNode, updateNode } from '@/lib/graphql/nodes';
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

function DisplayPlusIcon(item: ItemInstance<Node>, refreshTree: () => void)
{
	function onClick(e: React.MouseEvent)
	{
		// This prevents the click event from going to the TreeItem and causing it to expand/collapse.
		e.stopPropagation();

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
	async function del()
	{
		await deleteNode(
			{
				id: node.id,
			},
			{
				id: true,
			},
		);

		refreshTree();
	}

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
					{ label: 'Delete', onExecute: () => del() },
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
					{ label: 'Delete', onExecute: () => del() },
				],
			},
		],
		recipe: [
			{
				group: [
					{ label: 'Rename', onExecute: () => console.log('Rename') },
					{ label: 'Duplicate', onExecute: () => console.log('Duplicate') },
					{ label: 'Delete', onExecute: () => del() },
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
		{
			id: true,
			name: true,
		},
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
		{
			id: true,
			name: true,
		},
	);

	const newNode = await createNode(
		{
			data: {
				name: newItem.name,
				type: 'item',
				itemId: newItem.id,
				parentId: parent.id,
			},
		},
		{
			id: true,
			name: true,
		},
	);

	refreshTree();
}

async function createRecipeNode(parent: Node, refreshTree: () => void)
{
	if (parent.type !== 'item')
	{
		console.error('Cannot create recipe: parent node is not of type item', parent);
		return;
	}

	if (!parent.item)
	{
		console.error('Cannot create recipe: parent node has no associated item', parent);
		return;
	}

	const newRecipe = await createRecipe(
		{
			data: {
				itemId: parent.item.id,
				quantity: 1,
				time: 1,
			},
		},
		{
			id: true,
		},
	);

	const newNode = await createNode(
		{
			data: {
				name: 'New Recipe',
				type: 'recipe',
				recipeId: newRecipe.id,
				parentId: parent.id,
			},
		},
		{
			id: true,
		},
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
		{
			id: true,
		},
	);

	if (node.type === 'item')
	{
		if (!node.item)
		{
			console.error('Cannot rename item: node has no associated item', node);
			return;
		}

		const updatedItem = await updateItem(
			{
				id: node.item.id,
				data: {
					name: newName,
				},
			},
			{
				id: true,
			},
		);
	}

	refreshTree();
}
