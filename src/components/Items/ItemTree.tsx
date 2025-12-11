'use client';

import { Tree, NodeApi, TreeApi } from 'react-arborist';
import { useRef, useState, useEffect } from 'react';
import { Button } from '@components/ui/button';
import { Plus, Search } from 'lucide-react';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { useResizeObserver } from '@/hooks/use-resize-observer';
import { createNode, deleteNode, getNode, getRootNodes, updateNode } from '@/lib/graphql/nodes';
import { Node } from '@generated/graphql/types';
import { createItem, deleteItem, updateItem } from '@/lib/graphql/items';
import { createRecipe, deleteRecipe } from '@/lib/graphql/recipes';
import { NodeRenderer } from '@components/Items';

interface ItemTreeProps
{
	onNodeClick: (node: Node) => void;
}

export default function ItemTree({ onNodeClick }: ItemTreeProps)
{
	const [search, setSearch] = useState('');
	const [treeData, setTreeData] = useState<Node[]>([]);

	const treeRef = useRef<TreeApi<Node>>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	const { width, height } = useResizeObserver({
		ref: containerRef,
	});

	async function refreshTree()
	{
		const rootNodeIds = await getRootNodes(['id']);
		const rootNodes: Node[] = [];

		for (const rootNodeId of rootNodeIds)
		{
			//const rootNode = await getNodeWithChildren(rootNodeId.id, ['id', 'name', 'type', 'resourceId', 'parentId', 'order']);
			//rootNodes.push(rootNode);
		}

		setTreeData(rootNodes);
	}

	async function createRootNode()
	{
		const tree = treeRef.current;

		if (tree)
		{
			tree.create({
				type: 'internal',
				parentId: null,
			});
		}
	}

	async function onCreate({ parentId, parentNode, index, type }: { parentId: string | null; parentNode: NodeApi<Node> | null; index: number; type: 'internal' | 'leaf' })
	{
		let newNodeId: string;

		if (parentNode === null)
		{
			const newNode = await createNode(
				{
					data: {
						name: 'New Folder',
						type: 'folder',
					},
				},
				['id'],
			);

			newNodeId = newNode.id;
		}
		else
		{
			if (parentNode.data.type === 'folder')
			{
				if (type === 'internal')
				{
					const newNode = await createNode(
						{
							data: {
								name: 'New Folder',
								type: 'folder',
								parentId: parentId,
							},
						},
						['id'],
					);

					newNodeId = newNode.id;
				}
				else
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
								parentId: parentId,
							},
						},
						['id'],
					);

					newNodeId = newNode.id;
				}
			}
			else if (parentNode.data.type === 'item')
			{
				const newRecipe = await createRecipe(
					{
						data: {
							itemId: parentNode.data.resourceId!,
							quantity: 1,
							time: 1,
						},
					},
					['id'],
				);

				console.log('Created recipe', newRecipe);

				const newNode = await createNode(
					{
						data: {
							name: 'New Recipe',
							type: 'recipe',
							resourceId: newRecipe.id,
							parentId: parentId,
						},
					},
					['id'],
				);

				newNodeId = newNode.id;
			}
			else
			{
				throw new Error(`Cannot create child node under parent of type ${parentNode.data.type}`);
			}
		}

		refreshTree();
		return { id: newNodeId };
	}

	function onRename({ id, name }: { id: string; name: string })
	{
		const tree = treeRef.current;

		if (!tree) throw new Error('Tree ref is not set');

		const node = tree.get(id);

		if (!node) throw new Error(`Node with id ${id} not found`);

		updateNode(
			{
				id,
				data: {
					name,
				},
			},
			['id'],
		);

		if (node.data.type === 'item')
		{
			updateItem(
				{
					id: node.data.resourceId!,
					data: {
						name,
					},
				},
				['id'],
			);
		}
	}

	function onMove({ dragIds, parentId, index }: { dragIds: string[]; parentId: string | null; index: number })
	{
		console.log('MOVE', { dragIds, parentId, index });
	}

	function onDelete({ ids, nodes }: { ids: string[]; nodes: NodeApi<Node>[] })
	{
		for (const node of nodes)
		{
			deleteNodeRecursive(node.data);
		}

		refreshTree();

		function deleteNodeRecursive(node: Node)
		{
			if (node.children && node.children.length > 0)
			{
				for (const child of node.children)
				{
					//deleteNodeRecursive(child);
				}
			}

			deleteNode({ id: node.id }, ['id']);

			if (node.type === 'item')
			{
				deleteItem({ id: node.resourceId! }, ['id']);
			}
			else if (node.type === 'recipe')
			{
				deleteRecipe({ id: node.resourceId! }, ['id']);
			}
		}
	}

	function onSelect(nodes: NodeApi<Node>[])
	{
		if (nodes.length !== 1) return;
		onNodeClick(nodes[0].data);
	}

	useEffect(() =>
	{
		refreshTree();
	}, []);

	return (
		<>
			<div className="flex m-2 gap-2">
				<Button variant="ghost" size="icon" onClick={createRootNode}>
					<Plus />
				</Button>

				<InputGroup>
					<InputGroupInput className="text-sm" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
					<InputGroupAddon>
						<Search />
					</InputGroupAddon>
					<InputGroupAddon align="inline-end">12 results</InputGroupAddon>
				</InputGroup>
			</div>
			<div ref={containerRef} className="flex grow">
				<Tree<Node>
					className="react-aborist"
					ref={treeRef}
					data={treeData}
					onCreate={onCreate}
					onRename={onRename}
					onMove={onMove}
					onDelete={onDelete}
					onSelect={onSelect}
					width={width}
					height={height}
					overscanCount={1}
					indent={24}
					rowHeight={40}
					searchTerm={search}
					searchMatch={(node, term) => node.data.name.toLowerCase().includes(term.toLowerCase())}
				>
					{NodeRenderer}
				</Tree>
			</div>
		</>
	);
}
