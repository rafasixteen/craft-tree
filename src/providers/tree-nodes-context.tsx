'use client';

import React, { createContext, useContext, useMemo } from 'react';
import useSWR, { MutatorOptions } from 'swr';
import { useCollectionsContext } from '@/providers/collections-context';
import { getNodeMap, Node, NodeMap } from '@/domain/tree';

type NodeUpdater = Partial<Node> | ((currentNode: Node) => Partial<Node> | Node);

type TreeNodesContextValue = {
	nodes: NodeMap;
	isLoading: boolean;
	isValidating: boolean;
	error?: any;
	refresh: () => Promise<NodeMap | undefined>;
	mutateNodes: ReturnType<typeof useSWR<NodeMap>>['mutate'];
	mutateNode: (nodeId: string, updater: NodeUpdater, options?: MutatorOptions) => Promise<NodeMap | undefined>;
};

const TreeNodesContext = createContext<TreeNodesContextValue | undefined>(undefined);

export function TreeNodesProvider({ children, initialNodes }: { children: React.ReactNode; initialNodes?: NodeMap })
{
	const { activeCollection } = useCollectionsContext();

	const key = useMemo(() => ['nodes', activeCollection.id], [activeCollection.id]);

	const { data, isLoading, isValidating, error, mutate } = useSWR<NodeMap>(key, () => getNodeMap(activeCollection), {
		keepPreviousData: true,
		fallbackData: initialNodes,
	});

	const mutateNode = useMemo(
		() => (nodeId: string, updater: NodeUpdater, options?: MutatorOptions) =>
		{
			return mutate((currentNodes) =>
			{
				if (!currentNodes) return currentNodes;
				const existingNode = currentNodes[nodeId];
				if (!existingNode) return currentNodes;

				const update = typeof updater === 'function' ? updater(existingNode) : updater;

				return {
					...currentNodes,
					[nodeId]: {
						...existingNode,
						...update,
					},
				};
			}, options);
		},
		[mutate],
	);

	const value = useMemo<TreeNodesContextValue>(
		() => ({
			nodes: data ?? {},
			isLoading,
			isValidating,
			error,
			refresh: () => mutate(undefined, { revalidate: true }),
			mutateNodes: mutate,
			mutateNode,
		}),
		[data, isLoading, isValidating, error, mutate, mutateNode],
	);

	return <TreeNodesContext.Provider value={value}>{children}</TreeNodesContext.Provider>;
}

export function useTreeNodes()
{
	const context = useContext(TreeNodesContext);
	if (!context) throw new Error('useTreeNodes must be used within a TreeNodesProvider');
	return context;
}
