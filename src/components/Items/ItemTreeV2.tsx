'use client';

import { AssistiveTreeDescription, useTree } from '@headless-tree/react';
import { FolderIcon, FolderOpenIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Tree, TreeDragLine, TreeItem, TreeItemLabel } from '@/components/ui/tree';
import { Node } from '@generated/graphql/types';
import { getNodes } from '@/lib/graphql/nodes';
import {
	createOnDropHandler,
	dragAndDropFeature,
	expandAllFeature,
	hotkeysCoreFeature,
	keyboardDragAndDropFeature,
	searchFeature,
	selectionFeature,
	syncDataLoaderFeature,
	type TreeState,
	type TreeInstance,
	ItemInstance,
} from '@headless-tree/core';

const indent = 20;
const initialExpandedItems = ['engineering', 'frontend', 'design-system'];

const childNode: Node = {
	id: 'frontend',
	name: 'Frontend Team',
	type: 'item',
	order: 1,
	children: [],
};

const rootNode: Node = {
	id: 'company',
	name: 'Craft Tree',
	type: 'folder',
	children: ['frontend'],
	order: 1,
};

const initialNodes: Record<string, Node> = {
	company: rootNode,
	frontend: childNode,
};

interface ItemTreeV2Props
{
	searchValue: string;
}

function isItemFolder(item: ItemInstance<Node>): boolean
{
	const node = item.getItemData();
	return node.children.length > 0;
}

function getItemName(item: ItemInstance<Node>): string
{
	const node = item.getItemData();
	return node.name;
}

export default function ItemTreeV2({ searchValue }: ItemTreeV2Props)
{
	const [nodes, setNodes] = useState<Record<string, Node>>({});
	const [state, setState] = useState<Partial<TreeState<Node>>>({});
	const [filteredItems, setFilteredItems] = useState<string[]>([]);

	const dummyRootId = 'tree-root';

	function getItem(id: string): Node
	{
		return nodes[id];
	}

	function getItemChildren(id: string): string[]
	{
		const node = nodes[id];
		return node ? node.children : [];
	}

	const tree: TreeInstance<Node> = useTree<Node>({
		features: [syncDataLoaderFeature, selectionFeature, searchFeature, expandAllFeature, hotkeysCoreFeature, dragAndDropFeature, keyboardDragAndDropFeature],
		canReorder: true,
		dataLoader: {
			getItem: getItem,
			getChildren: getItemChildren,
		},
		getItemName: getItemName,
		isItemFolder: isItemFolder,
		indent,
		initialState: { expandedItems: initialExpandedItems },
		rootItemId: dummyRootId,
		state,
		setState,
		onDrop: createOnDropHandler((parent, newChildren) =>
		{
			setNodes((prev) => ({
				...prev,
				[parent.getId()]: {
					...prev[parent.getId()],
					children: newChildren,
				},
			}));
		}),
	});

	useEffect(() =>
	{
		if (!searchValue)
		{
			setFilteredItems([]);
			return;
		}

		const filtered = filterNodes(nodes, tree, searchValue);
		setFilteredItems(filtered);

		setState((prev) => ({
			...prev,
			expandedItems: getAllFolders(tree),
		}));
	}, [searchValue, tree, nodes]);

	useEffect(() =>
	{
		async function fetchNodes()
		{
			const fetchedNodes = await getNodes(['id', 'name', 'type', 'order', 'children', 'parentId']);
			const nodesMap: Record<string, Node> = {};

			for (const node of fetchedNodes)
			{
				nodesMap[node.id] = node;
			}

			const rootNode = fetchedNodes.find((n) => !n.parentId);

			if (!rootNode)
			{
				throw new Error('No root node was found');
			}

			setNodes({
				[dummyRootId]: { id: dummyRootId, name: 'Root', type: 'folder', children: [rootNode.id], order: 0 },
				...nodesMap,
			});

			tree.rebuildTree();
		}

		fetchNodes();
	}, [tree]);

	return (
		<div className="flex h-full flex-col gap-2 *:first:grow">
			<Tree indent={indent} tree={tree}>
				<AssistiveTreeDescription tree={tree} />

				{searchValue && filteredItems.length === 0 ? (
					<p className="px-3 py-4 text-center text-sm">No items found for &quot;{searchValue}&quot;</p>
				) : (
					tree.getItems().map((item) =>
						{
						const visible = shouldShowNode(item.getId(), filteredItems, searchValue);

						return (
							<TreeItem key={item.getId()} item={item} className="data-[visible=false]:hidden" data-visible={visible}>
								<TreeItemLabel>
									<span className="flex items-center gap-2">
										{item.isFolder() &&
											(item.isExpanded() ? (
												<FolderOpenIcon className="size-4 text-muted-foreground" />
											) : (
												<FolderIcon className="size-4 text-muted-foreground" />
											))}
										{item.getItemName()}
									</span>
								</TreeItemLabel>
							</TreeItem>
						);
					})
				)}

				<TreeDragLine />
			</Tree>
		</div>
	);
}

function filterNodes(nodes: Record<string, Node>, tree: TreeInstance<Node>, searchValue: string)
{
	if (!searchValue) return [];

	const all = tree.getItems();
	const searchLower = searchValue.toLowerCase();

	const directMatches = all.filter((item) => item.getItemName().toLowerCase().includes(searchLower)).map((item) => item.getId());

	const parentMatches = new Set<string>();
	for (const id of directMatches)
	{
		let item = all.find((i) => i.getId() === id);
		while (item?.getParent?.())
		{
			const parent = item.getParent();
			if (!parent) break;
			parentMatches.add(parent.getId());
			item = parent;
		}
	}

	const childrenMatches = new Set<string>();
	const getDescendants = (id: string) =>
	{
		const node = nodes[id];

		for (const child of node.children)
		{
			childrenMatches.add(child);

			const childNode = nodes[child];

			if (childNode.children?.length) getDescendants(child);
		}
	};
	directMatches.forEach(getDescendants);

	return [...directMatches, ...Array.from(parentMatches), ...Array.from(childrenMatches)];
}

function getAllFolders(tree: TreeInstance<Node>)
{
	return tree
		.getItems()
		.filter((i) => i.isFolder())
		.map((i) => i.getId());
}

function shouldShowNode(id: string, filteredItems: string[], searchValue: string)
{
	return !searchValue || filteredItems.includes(id);
}
