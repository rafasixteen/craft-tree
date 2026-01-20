'use client';

import React, { createContext, useContext, useMemo } from 'react';
import useSWR, { MutatorCallback } from 'swr';
import { useCollectionsContext } from '@/providers/collections-context';
import { getNodeMap, NodeMap } from '@/domain/tree';

type TreeNodesContextValue = {
	nodes: NodeMap;
	isLoading: boolean;
	isValidating: boolean;
	error?: unknown;
	refresh: () => Promise<NodeMap | undefined>;
	mutateNodes: (data?: MutatorCallback<NodeMap> | NodeMap, opts?: { revalidate?: boolean }) => Promise<NodeMap | undefined>;
};

const TreeNodesContext = createContext<TreeNodesContextValue | undefined>(undefined);

export function TreeNodesProvider({ children, initialNodes }: { children: React.ReactNode; initialNodes?: NodeMap })
{
	const { activeCollection } = useCollectionsContext();

	const { data, isLoading, isValidating, error, mutate } = useSWR<NodeMap>(['nodes', activeCollection.id], () => getNodeMap(activeCollection), {
		keepPreviousData: true,
		fallbackData: initialNodes,
	});
	const value = useMemo<TreeNodesContextValue>(
		() => ({
			nodes: data ?? {},
			isLoading,
			isValidating,
			error,
			refresh: () => mutate(),
			mutateNodes: (next, opts) => mutate(next as any, { revalidate: opts?.revalidate ?? false }),
		}),
		[data, isLoading, isValidating, error, mutate],
	);

	return <TreeNodesContext.Provider value={value}>{children}</TreeNodesContext.Provider>;
}

export function useTreeNodes()
{
	const context = useContext(TreeNodesContext);
	if (!context) throw new Error('useTreeNodes must be used within a TreeNodesProvider');
	return context;
}
