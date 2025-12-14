'use client';

import { AssistiveTreeDescription, useTree } from '@headless-tree/react';
import { useEffect, useState } from 'react';
import { Tree, TreeDragLine } from '@/components/ui/tree';
import { Node } from '@generated/graphql/types';
import { getDescendantNodes } from '@/lib/graphql/nodes';
import { Collection } from '@components/Collection';
import { NodeRenderer } from '@/components/Items';
import useSWR from 'swr';
import { nodeActionsFeature } from '@components/Items/features/nodeActions';
import {
	createOnDropHandler,
	dragAndDropFeature,
	expandAllFeature,
	hotkeysCoreFeature,
	keyboardDragAndDropFeature,
	searchFeature,
	selectionFeature,
	syncDataLoaderFeature,
	renamingFeature,
	type TreeState,
	type TreeInstance,
	ItemInstance,
} from '@headless-tree/core';

const indent = 8;
const dummyRootId = 'tree-root';

interface ItemTreeProps
{
	searchValue: string;
	activeCollection?: Collection | null;
}

export default function ItemTree({ searchValue, activeCollection }: ItemTreeProps)
{
	const [nodes, setNodes] = useState<Record<string, Node>>({});
	const [state, setState] = useState<Partial<TreeState<Node>>>({});

	const shouldFetch = !!activeCollection;

	const { data: fetchedNodes, mutate } = useSWR(
		shouldFetch ? ['nodes', activeCollection.id] : null,
		shouldFetch
			? () =>
					getDescendantNodes(activeCollection.id, {
						id: true,
						name: true,
						type: true,
						order: true,
						children: { id: true },
						item: { id: true, name: true },
						recipe: { id: true },
					})
			: null,
		{
			revalidateOnFocus: false,
			revalidateOnReconnect: false,
		},
	);

	function getItem(id: string): Node
	{
		const node = nodes[id];

		if (!node)
		{
			return {
				id,
				name: 'Unknown',
				type: 'folder',
				order: 1,
				children: [],
			};
		}

		return node;
	}

	function getItemChildren(id: string): string[]
	{
		const node = nodes[id];
		return node ? node.children.map((child) => child.id) : [];
	}

	const tree: TreeInstance<Node> = useTree<Node>({
		features: [
			syncDataLoaderFeature,
			selectionFeature,
			searchFeature,
			expandAllFeature,
			hotkeysCoreFeature,
			dragAndDropFeature,
			keyboardDragAndDropFeature,
			renamingFeature,
			nodeActionsFeature,
		],
		canReorder: true,
		dataLoader: {
			getItem: getItem,
			getChildren: getItemChildren,
		},
		getItemName: getItemName,
		onRename: onRename,
		isItemFolder: isItemFolder,
		indent: indent,
		rootItemId: dummyRootId,
		state: state,
		setState: setState,
		onDrop: createOnDropHandler((parent, newChildren) =>
		{
			setNodes((prev) => ({
				...prev,
				[parent.getId()]: {
					...prev[parent.getId()],
					children: newChildren.map((child) => nodes[child]),
				},
			}));
		}),
		hotkeys: {
			customExpandAll: {
				hotkey: 'KeyQ',
				handler: (e, tree) =>
				{
					tree.expandAll();
				},
			},
			customCollapseAll: {
				hotkey: 'KeyW',
				handler: (e, tree) =>
				{
					tree.collapseAll();
				},
			},
			customCreateChild: {
				hotkey: 'Control+Plus',
				handler: (e, tree) =>
				{
					e.preventDefault();

					tree.getSelectedItems().forEach((item) =>
					{
						const node = item.getItemData();
						if (node.type === 'recipe') return;
						item.createChild();
					});
				},
			},
			customDeleteItem: {
				hotkey: 'Delete',
				handler: (e, tree) =>
				{
					tree.getSelectedItems().forEach((item) =>
					{
						item.deleteItem();
					});
				},
			},
		},
	});

	tree.onChange = mutate;

	useEffect(() =>
	{
		if (!fetchedNodes || !activeCollection)
		{
			setNodes({});
			return;
		}

		const nodesMap: Record<string, Node> = {};

		for (const node of fetchedNodes)
		{
			nodesMap[node.id] = node;
		}

		const rootNode = fetchedNodes.find((n) => n.id === activeCollection.id);

		setNodes({
			[dummyRootId]: {
				id: dummyRootId,
				name: 'Root',
				type: 'folder',
				order: 1,
				children: rootNode ? [rootNode] : [],
			},
			...nodesMap,
		});
	}, [fetchedNodes, activeCollection]);

	useEffect(() =>
	{
		if (Object.keys(nodes).length === 0) return;

		const allFolders = tree
			.getItems()
			.filter((i) => i.isFolder())
			.map((i) => i.getId());
		setState({ expandedItems: allFolders });

		tree.rebuildTree();
	}, [nodes, tree]);

	useEffect(() =>
	{
		tree.setSearch(searchValue);
	}, [tree, searchValue]);

	function DisplayNodes()
	{
		const filteredItems = searchValue ? filterNodes(nodes, tree, searchValue) : [];

		function shouldShowNode(itemInstance: ItemInstance<Node>)
		{
			const id = itemInstance.getId();
			return !searchValue || filteredItems.includes(id);
		}

		if (searchValue && filteredItems.length === 0)
		{
			return <p className="px-3 py-4 text-center text-sm">No items found for &quot;{searchValue}&quot;</p>;
		}
		else
		{
			return tree.getItems().map((item) =>
			{
				return <NodeRenderer key={item.getId()} item={item} visible={shouldShowNode(item)} />;
			});
		}
	}

	return (
		<div className="flex h-full flex-col gap-2 *:first:grow">
			<Tree indent={indent} tree={tree}>
				<AssistiveTreeDescription tree={tree} />
				{DisplayNodes()}
				<TreeDragLine />
			</Tree>
		</div>
	);
}

function onRename(item: ItemInstance<Node>, value: string)
{
	item.renameItem(value);
}

function isItemFolder(item: ItemInstance<Node>): boolean
{
	const node = item.getItemData();
	return node.type === 'folder' || (node.type === 'item' && node.children.length > 0);
}

function getItemName(item: ItemInstance<Node>): string
{
	const node = item.getItemData();
	return node.name;
}

function filterNodes(nodes: Record<string, Node>, tree: TreeInstance<Node>, searchValue: string)
{
	if (!searchValue) return [];

	const all = tree.getItems();
	const searchLower = searchValue.toLowerCase();

	const directMatches = all.filter((item) => getItemName(item).toLowerCase().includes(searchLower)).map((item) => item.getId());

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
			childrenMatches.add(child.id);

			const childNode = nodes[child.id];

			if (childNode.children?.length) getDescendants(child.id);
		}
	};
	directMatches.forEach(getDescendants);

	return [...directMatches, ...Array.from(parentMatches), ...Array.from(childrenMatches)];
}
