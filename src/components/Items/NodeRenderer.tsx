'use client';

import { NodeRendererProps, NodeApi, TreeApi } from 'react-arborist';
import React, { useState } from 'react';
import { Button } from '@components/ui/button';
import { Ban, ChevronRight, Ellipsis, File, Plus, FolderOpen, FolderClosed } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Node, NodeType } from '@/graphql/generated/graphql';
import { Input } from '@components/ui/input';
import { cn } from '@/lib/utils';

export default function NodeRenderer({ node, style, dragHandle, tree }: NodeRendererProps<Node>)
{
	const [menuOpen, setMenuOpen] = useState(false);

	function onPlusButtonClick()
	{
		if (node.data.type === 'folder' || node.data.type === 'item')
		{
			tree.create({
				parentId: node.id,
				type: 'leaf',
			});
		}
	}

	function onInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>)
	{
		switch (event.key)
		{
			case 'Enter':
				node.submit(event.currentTarget.value);
				break;
			case 'Escape':
				node.reset();
				break;
			default:
				break;
		}
	}

	return (
		<div className={cn('group hover:bg-muted/50 transition-all', menuOpen && 'bg-muted/50')} style={style} ref={dragHandle}>
			<div className="flex justify-between">
				<div className="items-center flex ml-2">
					{DisplayChevron(node)}

					{DisplayIcon(node)}

					<Input
						readOnly={!node.isEditing}
						type="text"
						defaultValue={node.data.name}
						onBlur={() => node.reset()}
						onKeyDown={onInputKeyDown}
						required
						className={cn(
							'border-none shadow-none bg-transparent! rounded-none focus-visible:ring-0 focus-visible:border-none text-sm',
							!node.isEditing && 'pointer-events-none select-none',
						)}
					/>
				</div>

				<div className={cn('flex gap-1 items-center transition-opacity', menuOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100')}>
					<Button variant="ghost" size="icon-sm" className="m-1" onClick={onPlusButtonClick}>
						<Plus />
					</Button>

					<DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" size="icon-sm" className={cn('m-1', menuOpen && 'bg-accent text-accent-foreground dark:bg-accent/50')}>
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

interface Action
{
	label: string;
	onExecute: (node: NodeApi<Node>, tree: TreeApi<Node>) => void;
}

interface ActionGroup
{
	group: Action[];
}

type ActionsByNodeType = {
	[K in NodeType]: ActionGroup[];
};

function DisplayContextMenu(node: NodeApi<Node>, tree: TreeApi<Node>): React.JSX.Element
{
	const actionsByNodeType: ActionsByNodeType = {
		folder: [
			{
				group: [
					{ label: 'New Item', onExecute: () => console.log('New Item') },
					{ label: 'New Folder', onExecute: () => console.log('New Folder') },
				],
			},
			{
				group: [
					{ label: 'Rename', onExecute: (node) => node.edit() },
					{ label: 'Duplicate', onExecute: (node) => console.log('Duplicate') },
					{ label: 'Delete', onExecute: (node, tree) => tree.delete(node.id) },
				],
			},
		],
		item: [
			{
				group: [{ label: 'New Recipe', onExecute: (node) => console.log('New Recipe') }],
			},
			{
				group: [
					{ label: 'Rename', onExecute: (node) => node.edit() },
					{ label: 'Duplicate', onExecute: (node) => console.log('Duplicate') },
					{ label: 'Delete', onExecute: (node, tree) => tree.delete(node.id) },
				],
			},
		],
		recipe: [
			{
				group: [
					{ label: 'Duplicate', onExecute: (node) => console.log('Duplicate') },
					{ label: 'Delete', onExecute: (node, tree) => tree.delete(node.id) },
				],
			},
		],
	};

	return (
		<DropdownMenuContent side="right" align="start" className="w-48">
			{actionsByNodeType[node.data.type].map((group, groupIndex) => (
				<DropdownMenuGroup key={groupIndex}>
					{group.group.map((action, actionIndex) => (
						<DropdownMenuItem key={actionIndex} onSelect={() => action.onExecute(node, tree)}>
							{action.label}
						</DropdownMenuItem>
					))}
					{groupIndex < actionsByNodeType[node.data.type].length - 1 && <DropdownMenuSeparator />}
				</DropdownMenuGroup>
			))}
		</DropdownMenuContent>
	);
}
