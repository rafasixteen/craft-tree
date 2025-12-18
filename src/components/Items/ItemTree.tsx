'use client';

import { AssistiveTreeDescription, useTree } from '@headless-tree/react';
import { Tree, TreeDragLine } from '@/components/ui/tree';
import { Node } from '@generated/graphql/types';
import { getDescendantNodes } from '@/lib/graphql/nodes';
import { NodeRenderer } from '@/components/items';
import { Collection } from '@/components/collections';
import useSWR from 'swr';
import { nodeActionsFeature } from '@/components/items/features/nodeActions';
import { useTreeStore } from '@/store/treeStore';
import { useEffect, useState } from 'react';
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
	type TreeInstance,
	ItemInstance,
} from '@headless-tree/core';

const indent = 8;

interface ItemTreeProps
{
	collection: Collection;
	searchValue?: string;
}

export default function ItemTree({ collection, searchValue }: ItemTreeProps)
{
	const [nodes, setNodes] = useState<Record<string, Node>>({});
	const { expandedItems, setExpandedItems, selectedItems, setSelectedItems } = useTreeStore();

	const { data: fetchedNodes, mutate } = useSWR(['tree', collection.id], () =>
		getDescendantNodes(collection.id, {
			id: true,
			name: true,
			type: true,
			order: true,
			children: {
				id: true,
			},
			item: {
				id: true,
				name: true,
				slug: true,
			},
			recipe: {
				id: true,
				name: true,
				slug: true,
			},
		}),
	);

	function getItem(id: string): Node
	{
		const node = nodes[id];

		if (!node)
		{
			return {
				id: 'unknown',
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
		rootItemId: 'tree-root',
		state: { selectedItems, expandedItems },
		setSelectedItems: wrapZustandSetter(setSelectedItems),
		setExpandedItems: wrapZustandSetter(setExpandedItems),
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
				hotkey: 'KeyF',
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
			customCreateFolder: {
				hotkey: 'Control+KeyF',
				handler: (e, tree) =>
				{
					e.preventDefault();

					tree.getSelectedItems().forEach((item) =>
					{
						const node = item.getItemData();
						if (node.type !== 'folder') return;
						item.createFolder();
					});
				},
			},
		},
	});

	tree.onChange = () =>
	{
		mutate();
	};

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

	useEffect(() =>
	{
		if (!fetchedNodes) return;

		const rootNode = fetchedNodes.find((node) => node.id === collection.id);

		if (!rootNode) return;

		const dummyRootNode: Node = {
			id: 'tree-root',
			name: 'Root',
			type: 'folder',
			order: 1,
			children: [rootNode],
		};

		const nodesMap: Record<string, Node> = {
			[dummyRootNode.id]: dummyRootNode,
		};

		for (const node of fetchedNodes)
		{
			nodesMap[node.id] = node;
		}

		setNodes(nodesMap);
	}, [fetchedNodes, collection.id]);

	useEffect(() =>
	{
		tree.rebuildTree();
	}, [nodes, tree]);

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

function wrapZustandSetter(setter: (ids: string[]) => void)
{
	return (updaterOrValue: string[] | ((old: string[]) => string[])) =>
	{
		if (typeof updaterOrValue === 'function')
		{
			setter(updaterOrValue([]));
		}
		else
		{
			setter(updaterOrValue);
		}
	};
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
		const node = nodes[id]!;

		for (const child of node.children)
		{
			childrenMatches.add(child.id);
			const childNode = nodes[child.id]!;

			if (childNode.children?.length) getDescendants(child.id);
		}
	};
	directMatches.forEach(getDescendants);

	return [...directMatches, ...Array.from(parentMatches), ...Array.from(childrenMatches)];
}
