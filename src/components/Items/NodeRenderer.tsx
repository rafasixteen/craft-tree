'use client';

import { NodeRendererProps, NodeApi, TreeApi } from 'react-arborist';
import React, { useState } from 'react';
import { Button } from '@components/ui/button';
import { Ban, ChevronRight, Ellipsis, File, Plus, FolderOpen, FolderClosed } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Node, NodeType } from '@generated/graphql/types';
import { cn } from '@/lib/utils';

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

function createLeafNode(node: NodeApi<Node>, tree: TreeApi<Node>)
{
	tree.create({
		parentId: node.id,
		type: 'leaf',
	});
}

function createFolderNode(node: NodeApi<Node>, tree: TreeApi<Node>)
{
	tree.create({
		parentId: node.id,
		type: 'internal',
	});
}

export default function NodeRenderer({ node, style, dragHandle, tree }: NodeRendererProps<Node>)
{
	const [menuOpen, setMenuOpen] = useState(false);

	return (
		<div
			className={cn(
				'box-border group hover:bg-muted/50 transition-all',
				menuOpen && 'bg-muted/50',
				node.isSelected && 'before:absolute before:left-0 before:top-0 before:bottom-0 before:w-0.5 before:bg-primary',
			)}
			style={style}
			ref={dragHandle}
		>
			<div className="flex items-center justify-between px-2 py-1">
				<div className="flex items-center gap-2 min-w-0">
					<div className="w-6 shrink-0">{DisplayChevron(node)}</div>
					<div className="w-6 shrink-0">{DisplayIcon(node)}</div>
					<div className="grow min-w-0 ml-2">{DisplayName(node)}</div>
				</div>

				<div className={cn('flex gap-1 items-center transition-opacity', menuOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100')}>
					<Button variant="ghost" size="icon-sm" onClick={() => createLeafNode(node, tree)}>
						<Plus />
					</Button>

					<DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" size="icon-sm">
								<Ellipsis />
							</Button>
						</DropdownMenuTrigger>
						{DisplayContextMenu(node, tree)}
					</DropdownMenu>
				</div>
			</div>
		</div>
	);
}

function DisplayName(node: NodeApi<Node>): React.JSX.Element
{
	function onInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>)
	{
		if (event.key === 'Escape') node.reset();
		else if (event.key === 'Enter' && event.currentTarget.value !== '')
		{
			node.submit(event.currentTarget.value);
			node.data.name = event.currentTarget.value;
		}
	}

	if (node.isEditing)
	{
		return (
			<input
				type="text"
				defaultValue={node.data.name}
				onFocus={(e) => e.currentTarget.select()}
				onBlur={() => node.reset()}
				onKeyDown={onInputKeyDown}
				autoFocus
				className="w-full text-sm border border-input px-1 py-0.5 rounded"
			/>
		);
	}
	else
	{
		return (
			<span className="block truncate text-sm cursor-text select-none" onDoubleClick={() => node.edit()}>
				{node.data.name}
			</span>
		);
	}
}

function DisplayChevron(node: NodeApi<Node>): React.JSX.Element
{
	const className = cn('mr-1', node.isLeaf && 'invisible', node.isOpen ? 'rotate-90' : 'rotate-0', 'transition-transform');

	return (
		<Button variant="ghost" size="icon-sm" onClick={() => node.toggle()} className={className}>
			<ChevronRight />
		</Button>
	);
}

function DisplayIcon(node: NodeApi<Node>): React.JSX.Element
{
	const className = 'ml-3';
	const iconSize = 16;

	switch (node.data.type)
	{
		case 'folder':
			return node.isOpen ? <FolderOpen size={iconSize} className={className} /> : <FolderClosed size={iconSize} className={className} />;
		case 'item':
			return <File size={iconSize} className={className} />;
		case 'recipe':
			return <File size={iconSize} className={className} />;
		default:
			return <Ban size={iconSize} className={className} />;
	}
}

function DisplayContextMenu(node: NodeApi<Node>, tree: TreeApi<Node>): React.JSX.Element
{
	// TODO: To make the edit focus, we must select the node first.

	function editNode()
	{
		node.select();
		node.edit();
	}

	const actionsByNodeType: ActionsByNodeType = {
		folder: [
			{
				group: [
					{ label: 'New Item', onExecute: () => createLeafNode(node, tree) },
					{ label: 'New Folder', onExecute: () => createFolderNode(node, tree) },
				],
			},
			{
				group: [
					{ label: 'Rename', onExecute: () => editNode() },
					{ label: 'Duplicate', onExecute: () => console.log('Duplicate') },
					{ label: 'Delete', onExecute: () => tree.delete(node.id) },
				],
			},
		],
		item: [
			{
				group: [{ label: 'New Recipe', onExecute: () => createLeafNode(node, tree) }],
			},
			{
				group: [
					{ label: 'Rename', onExecute: () => editNode() },
					{ label: 'Duplicate', onExecute: () => console.log('Duplicate') },
					{ label: 'Delete', onExecute: () => tree.delete(node.id) },
				],
			},
		],
		recipe: [
			{
				group: [
					{ label: 'Rename', onExecute: () => editNode() },
					{ label: 'Duplicate', onExecute: () => console.log('Duplicate') },
					{ label: 'Delete', onExecute: () => tree.delete(node.id) },
				],
			},
		],
	};

	return (
		<DropdownMenuContent side="right" align="start" className="w-48">
			{actionsByNodeType[node.data.type].map((group, groupIndex) => (
				<DropdownMenuGroup key={groupIndex}>
					{group.group.map((action, actionIndex) => (
						<DropdownMenuItem key={actionIndex} onSelect={() => action.onExecute()}>
							{action.label}
						</DropdownMenuItem>
					))}
					{groupIndex < actionsByNodeType[node.data.type].length - 1 && <DropdownMenuSeparator />}
				</DropdownMenuGroup>
			))}
		</DropdownMenuContent>
	);
}
