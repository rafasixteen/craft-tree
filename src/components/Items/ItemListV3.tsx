'use client';

import { NodeRendererProps, RowRendererProps, Tree } from 'react-arborist';
import { useRef, useState, useEffect } from 'react';
import { Button } from '@components/ui/button';
import { Ellipsis, PlusIcon, SearchIcon } from 'lucide-react';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { useResizeObserver } from '@/hooks/use-resize-observer';
import { FolderOpen, FolderClosed, ChevronDown } from 'lucide-react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { createNode, getRootNodes } from '@/lib/node';

interface TreeNode
{
	id: string;
	name: string;
	type: 'folder' | 'item' | 'recipe';
	children?: TreeNode[];
}

export default function ItemListV3()
{
	const [search, setSearch] = useState('');
	const [treeData, setTreeData] = useState<TreeNode[]>([]);

	const containerRef = useRef<HTMLDivElement>(null);

	const { width, height } = useResizeObserver({
		ref: containerRef,
	});

	async function createRootNode()
	{
		const newNode = await createNode({
			data: {
				name: 'New Collection',
				type: 'folder',
				resourceId: null,
				parentId: null,
			},
		});

		return newNode;
	}

	useEffect(() =>
	{
		async function fetchRootNodes()
		{
			const roots = await getRootNodes();

			const mapped: TreeNode[] = roots.map((n) => ({
				id: n.id,
				name: n.name,
				type: n.type,
				children: [],
			}));

			setTreeData(mapped);
		}

		fetchRootNodes();
	}, []);

	return (
		<>
			<div className="flex m-2 gap-2">
				<Button variant="ghost" size="icon" onClick={createRootNode}>
					<PlusIcon />
				</Button>

				<InputGroup>
					<InputGroupInput className="text-xs" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
					<InputGroupAddon>
						<SearchIcon />
					</InputGroupAddon>
					<InputGroupAddon align="inline-end">12 results</InputGroupAddon>
				</InputGroup>
			</div>
			<div ref={containerRef} className="flex grow">
				<Tree<TreeNode>
					data={treeData}
					width={width}
					height={height}
					indent={24}
					rowHeight={40}
					searchTerm={search}
					searchMatch={(node, term) => node.data.name.toLowerCase().includes(term.toLowerCase())}
					renderRow={RowRenderer}
				>
					{NodeRenderer}
				</Tree>
			</div>
		</>
	);
}

function RowRenderer({ node, innerRef, attrs, children }: RowRendererProps<any>)
{
	return (
		<div ref={innerRef} {...attrs}>
			<div>{children}</div>
		</div>
	);
}

function NodeRenderer({ node, style, dragHandle, tree }: NodeRendererProps<TreeNode>)
{
	const [menuOpen, setMenuOpen] = useState(false);

	const buttonsOpacityClass = menuOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 transition-opacity';
	const bgClass = menuOpen ? 'bg-muted/50' : '';
	const actionsButtonClass = menuOpen ? 'bg-accent text-accent-foreground dark:bg-accent/50' : '';

	async function newItem()
	{
		if (node.data.type !== 'folder')
		{
			throw new Error('Can only create new items inside folders');
		}
	}

	async function newFolder()
	{
		if (node.data.type !== 'folder')
		{
			throw new Error('Can only create new folders inside folders');
		}
	}

	async function newRecipe()
	{
		if (node.data.type !== 'item')
		{
			throw new Error('Can only create new recipes inside items');
		}
	}

	return (
		<div className={`group hover:bg-muted/50 transition-all ${bgClass}`} style={style} ref={dragHandle} onClick={() => node.toggle()}>
			<div className="flex justify-between">
				<div className="items-center flex">
					<span>{node.data.name}</span>
				</div>

				<div className={`flex gap-1 ${buttonsOpacityClass} items-center`}>
					<Button variant="ghost" size="icon-sm" className="m-1">
						<PlusIcon />
					</Button>

					<DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" size="icon-sm" className={`m-1 ${actionsButtonClass}`}>
								<Ellipsis />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent side="right" align="start" className="w-48">
							<DropdownMenuGroup>
								<DropdownMenuItem>New Item</DropdownMenuItem>
								<DropdownMenuItem>New Folder</DropdownMenuItem>
							</DropdownMenuGroup>
							<DropdownMenuSeparator />
							<DropdownMenuGroup>
								<DropdownMenuItem>Rename</DropdownMenuItem>
								<DropdownMenuItem>Duplicate</DropdownMenuItem>
								<DropdownMenuItem>Delete</DropdownMenuItem>
							</DropdownMenuGroup>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</div>
	);
}
