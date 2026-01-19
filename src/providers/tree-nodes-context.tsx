'use client';

import React, { createContext, useContext, useMemo } from 'react';
import useSWR, { MutatorCallback } from 'swr';
import { useCollectionContext } from '@/providers/collection-context';
import { getTreeNodes, Node, NodeType } from '@/domain/tree';
import { Collection } from '@/domain/collection';

type NodeMap = Record<string, Node>;

type TreeNodesContextValue = {
	nodes: NodeMap;
	isLoading: boolean;
	error?: unknown;
	refresh: () => Promise<NodeMap | undefined>;
	mutateNodes: (data?: MutatorCallback<NodeMap> | NodeMap, opts?: { revalidate?: boolean }) => Promise<NodeMap | undefined>;
};

const TreeNodesContext = createContext<TreeNodesContextValue | undefined>(undefined);

export function TreeNodesProvider({ children }: { children: React.ReactNode })
{
	const { activeCollection } = useCollectionContext();

	const { data, isLoading, error, mutate } = useSWR<NodeMap>(['nodes', activeCollection.id], () => loadNodeData(activeCollection), { keepPreviousData: true });

	const value = useMemo<TreeNodesContextValue>(
		() => ({
			nodes: data ?? {},
			isLoading,
			error,
			refresh: () => mutate(),
			mutateNodes: (next, opts) => mutate(next as any, { revalidate: opts?.revalidate ?? false }),
		}),
		[data, isLoading, error, mutate],
	);

	return <TreeNodesContext.Provider value={value}>{children}</TreeNodesContext.Provider>;
}

export function useTreeNodes()
{
	const context = useContext(TreeNodesContext);
	if (!context) throw new Error('useTreeNodes must be used within a TreeNodesProvider');
	return context;
}

async function loadNodeData(collection: Collection): Promise<Record<string, Node>>
{
	try
	{
		const rows = await getTreeNodes(collection.id);
		const nodes: Record<string, Node> = {};

		// Initialize root nodes
		const collectionNode = createNode(collection.id, collection.name, collection.slug, 'collection', collection);
		const dummyRoot = createNode(`dummy-${collection.id}`, 'Root', 'root', 'folder', collection, [collection.id]);

		nodes[collection.id] = collectionNode;
		nodes[dummyRoot.id] = dummyRoot;

		// Track folder parent relationships to build hierarchy
		const folderParents = new Map<string, string>();
		const topLevelFolders: string[] = [];

		// Single pass to extract all structural data
		for (const row of rows)
		{
			// Create folder node if needed
			if (row.folder_id && !nodes[row.folder_id])
			{
				nodes[row.folder_id] = createNode(row.folder_id, row.folder_name, row.folder_slug, 'folder', collection);
			}

			// Track folder hierarchy
			if (row.folder_id && row.parent_folder_id)
			{
				folderParents.set(row.folder_id, row.parent_folder_id);
			}
			else if (row.folder_id)
			{
				topLevelFolders.push(row.folder_id);
			}

			// Create item node if needed
			if (row.item_id && !nodes[row.item_id])
			{
				nodes[row.item_id] = createNode(row.item_id, row.item_name!, row.item_slug!, 'item', collection);
			}

			// Create recipe node if needed
			if (row.recipe_id && !nodes[row.recipe_id])
			{
				nodes[row.recipe_id] = createNode(row.recipe_id, row.recipe_name!, row.recipe_slug!, 'recipe', collection);
			}
		}

		// Link folders to their parents
		folderParents.forEach((parentId, childId) =>
		{
			const parent = nodes[parentId] || createNode(parentId, 'Folder', 'folder', 'folder', collection);

			if (!nodes[parentId])
			{
				nodes[parentId] = parent;
			}

			addChild(parent, childId);
		});

		// Add top-level folders to collection
		topLevelFolders.forEach((folderId) => addChild(collectionNode, folderId));

		// Link items to their parents (folders or collection)
		for (const row of rows)
		{
			if (!row.item_id) continue;

			const parent = row.folder_id ? nodes[row.folder_id] : collectionNode;
			if (parent) addChild(parent, row.item_id);
		}

		// Link recipes to their parent items
		for (const row of rows)
		{
			if (!row.recipe_id || !row.item_id) continue;

			const item = nodes[row.item_id];
			if (item) addChild(item, row.recipe_id);
		}

		return nodes;
	}
	catch (error)
	{
		console.error('Error loading tree nodes:', error);
		return {};
	}
}

function createNode(id: string, name: string, slug: string, type: NodeType, collection: Collection, children: string[] = []): Node
{
	return {
		id,
		name,
		slug,
		type,
		children,
		collectionSlug: collection.slug,
		collectionId: collection.id,
	};
}

function addChild(parent: Node, childId: string): void
{
	if (!parent.children)
	{
		parent.children = [];
	}

	if (!parent.children.includes(childId))
	{
		parent.children.push(childId);
	}
}
