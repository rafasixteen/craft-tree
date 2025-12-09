'use client';

import { NodeRendererProps, NodeApi, TreeApi } from 'react-arborist';
import React, { useState } from 'react';
import { Button } from '@components/ui/button';
import { Ban, ChevronRight, Ellipsis, File, Plus, FolderOpen, FolderClosed } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Node, NodeType } from '@generated/graphql/types';
import { Input } from '@components/ui/input';
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

function startEditing(node: NodeApi<Node>, inputRef: React.RefObject<HTMLInputElement>)
{
	node.edit();
}

export default function NodeRenderer({ node, style, dragHandle, tree }: NodeRendererProps<Node>)
{
	const [menuOpen, setMenuOpen] = useState(false);
	const [nodeName, setNodeName] = useState(node.data.name);

	const inputRef = React.useRef<HTMLInputElement>(null);

	function onInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>)
	{
		if (event.key === 'Escape')
		{
			setNodeName(node.data.name);
			node.reset();
		}
		else if (event.key === 'Enter' && event.currentTarget.value !== '')
		{
			node.submit(event.currentTarget.value);
		}
	}

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
			<div className="flex justify-between">
				<div className="items-center flex ml-2">
					{DisplayChevron(node)}

					{DisplayIcon(node)}

					<Input
						ref={inputRef}
						readOnly={!node.isEditing}
						type="text"
						value={nodeName}
						onChange={(e) => setNodeName(e.target.value)}
						onBlur={() => node.reset()}
						onKeyDown={onInputKeyDown}
						className={cn(
							'border-none shadow-none bg-transparent! rounded-none text-sm transition-all',
							!node.isEditing && 'pointer-events-none select-none',
							'focus-visible:border-2 focus-visible:border-primary focus-visible:ring-0 focus-visible:bg-background',
						)}
					/>
				</div>

				<div className={cn('flex gap-1 items-center transition-opacity', menuOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100')}>
					<Button variant="ghost" size="icon-sm" className="m-1" onClick={() => createLeafNode(node, tree)}>
						<Plus />
					</Button>

					<DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" size="icon-sm" className={cn('m-1', menuOpen && 'bg-accent text-accent-foreground dark:bg-accent/50')}>
								<Ellipsis />
							</Button>
						</DropdownMenuTrigger>
						{DisplayContextMenu(node, tree, inputRef)}
					</DropdownMenu>
				</div>
			</div>
		</div>
	);
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

	switch (node.data.type)
	{
		case 'folder':
			return node.isOpen ? <FolderOpen className={className} /> : <FolderClosed className={className} />;
		case 'item':
			return <File className={className} />;
		case 'recipe':
			return <File className={className} />;
		default:
			return <Ban className={className} />;
	}
}

function DisplayContextMenu(node: NodeApi<Node>, tree: TreeApi<Node>, inputRef: React.RefObject<HTMLInputElement>): React.JSX.Element
{
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
					{ label: 'Rename', onExecute: () => startEditing(node, inputRef) },
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
					{ label: 'Rename', onExecute: () => startEditing(node, inputRef) },
					{ label: 'Duplicate', onExecute: () => console.log('Duplicate') },
					{ label: 'Delete', onExecute: () => tree.delete(node.id) },
				],
			},
		],
		recipe: [
			{
				group: [
					{ label: 'Rename', onExecute: () => startEditing(node, inputRef) },
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
