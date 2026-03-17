'use client';

import { useMemo, createContext, useContext, useCallback, useEffect, useState } from 'react';
import { RecipeTreeNode, RecipeTreeState, getRecipeTreeData, parseRecipeTreeData } from '@/domain/recipe-tree';
import { Item } from '@/domain/item';
import useSWR from 'swr';

interface RecipeTreeContext
{
	recipeTree: RecipeTreeState | null;
	dfs: (
		startNodeId: RecipeTreeNode['id'],
		callback: (node: RecipeTreeNode) => void,
		getChildren: (node: RecipeTreeNode) => RecipeTreeNode['id'][],
		order?: 'pre' | 'post',
	) => void;
	changeProducer: (nodeId: RecipeTreeNode['id'], delta: number) => void;
}

const RecipeTreeContext = createContext<RecipeTreeContext | undefined>(undefined);

interface RecipeTreeProviderProps
{
	itemId: Item['id'];
	children: React.ReactNode;
}

export function RecipeTreeProvider({ itemId, children }: RecipeTreeProviderProps)
{
	const { data: rawData } = useSWR(['recipe-tree', itemId], () => getRecipeTreeData(itemId), { revalidateOnFocus: false });
	const [recipeTree, setRecipeTree] = useState<RecipeTreeState | null>(null);

	useEffect(() =>
	{
		if (!rawData)
		{
			setRecipeTree(null);
			return;
		}

		setRecipeTree(parseRecipeTreeData(rawData));
	}, [rawData]);

	const dfs = useCallback(
		function dfs(
			startNodeId: RecipeTreeNode['id'],
			callback: (node: RecipeTreeNode) => void,
			getChildren: (node: RecipeTreeNode) => RecipeTreeNode['id'][],
			order: 'pre' | 'post' = 'pre',
		)
		{
			if (!recipeTree)
			{
				throw new Error('Recipe tree data is not available.');
			}

			function visit(node: RecipeTreeNode)
			{
				if (order === 'pre')
				{
					callback(node);
				}

				for (const childId of getChildren(node))
				{
					const child = recipeTree!.nodes[childId];

					if (child)
					{
						visit(child);
					}
				}

				if (order === 'post')
				{
					callback(node);
				}
			}

			const startNode = recipeTree.nodes[startNodeId];

			if (startNode)
			{
				visit(startNode);
			}
		},
		[recipeTree],
	);

	const changeProducer = useCallback(function changeProducer(nodeId: RecipeTreeNode['id'], delta: number): void
	{
		setRecipeTree((prev) =>
		{
			if (!prev)
			{
				throw new Error('Recipe tree data is not available.');
			}

			const node = prev.nodes[nodeId];

			if (!node)
			{
				throw new Error(`Node with id "${nodeId}" not found.`);
			}

			if (!node.producers.length)
			{
				return prev;
			}

			const currentIndex = node.producers.findIndex((p) => p.id === node.selectedProducerId);
			const length = node.producers.length;
			const newIndex = (((currentIndex + delta) % length) + length) % length;
			const newSelectedProducerId = node.producers[newIndex].id;

			return {
				...prev,
				nodes: {
					...prev.nodes,
					[nodeId]: {
						...node,
						selectedProducerId: newSelectedProducerId,
					},
				},
			};
		});
	}, []);

	const value = useMemo(() => ({ recipeTree, dfs, changeProducer }), [recipeTree, dfs, changeProducer]);
	return <RecipeTreeContext.Provider value={value}>{children}</RecipeTreeContext.Provider>;
}

export function useRecipeTree(): RecipeTreeContext
{
	const context = useContext(RecipeTreeContext);

	if (context === undefined)
	{
		throw new Error('useRecipeTree must be used within a RecipeTreeProvider');
	}

	return context;
}
