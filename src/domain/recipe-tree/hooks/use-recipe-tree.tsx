import { useMemo, createContext, useContext, useCallback, useEffect, useState } from 'react';
import { RecipeTreeNode, RecipeTreeState, getRecipeTreeData, parseRecipeTreeData } from '@/domain/recipe-tree';
import { Item } from '@/domain/item';
import { DfsOrder, DfsCallback } from '@/domain/recipe-tree';
import * as RecipeTreeActions from '@/domain/recipe-tree/utils/recipe-tree-actions';
import useSWR from 'swr';

interface RecipeTreeContext
{
	recipeTree: RecipeTreeState | null;
	error: Error | null;
	dfs: (startNodeId: RecipeTreeNode['id'], callback: DfsCallback, order?: DfsOrder) => void;
	changeRecipe: (nodeId: RecipeTreeNode['id'], delta: number) => void;
	getResolvedQuantity: (nodeId: RecipeTreeNode['id']) => number;
	getResolvedTime: (nodeId: RecipeTreeNode['id']) => number;
	getNodeTime: (nodeId: RecipeTreeNode['id']) => number;
}

const RecipeTreeContext = createContext<RecipeTreeContext | undefined>(undefined);

interface RecipeTreeProviderProps
{
	itemId: Item['id'];
	children: React.ReactNode;
}

export function RecipeTreeProvider({ children, itemId }: RecipeTreeProviderProps)
{
	const { data: rawData, error } = useSWR(['recipe-tree', itemId], () => getRecipeTreeData(itemId), { revalidateOnFocus: false });

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
		function dfs(startNodeId: RecipeTreeNode['id'], callback: DfsCallback, order: DfsOrder = 'pre'): void
		{
			if (!recipeTree)
			{
				throw new Error('Recipe tree data is not available.');
			}

			RecipeTreeActions.dfs(recipeTree, startNodeId, callback, order);
		},
		[recipeTree],
	);

	function changeRecipe(nodeId: RecipeTreeNode['id'], delta: number): void
	{
		setRecipeTree((prev) =>
		{
			if (!prev)
			{
				throw new Error('Recipe tree data is not available.');
			}

			return RecipeTreeActions.changeRecipe(prev, nodeId, delta);
		});
	}

	const getResolvedQuantity = useCallback(
		function getResolvedQuantity(nodeId: RecipeTreeNode['id']): number
		{
			if (!recipeTree)
			{
				throw new Error('Recipe tree data is not available.');
			}

			return RecipeTreeActions.getResolvedQuantity(recipeTree, nodeId);
		},
		[recipeTree],
	);

	const getResolvedTime = useCallback(
		function getResolvedTime(nodeId: RecipeTreeNode['id']): number
		{
			if (!recipeTree)
			{
				throw new Error('Recipe tree data is not available.');
			}

			return RecipeTreeActions.getResolvedTime(recipeTree, nodeId);
		},
		[recipeTree],
	);

	const getNodeTime = useCallback(
		function getNodeTime(nodeId: RecipeTreeNode['id']): number
		{
			if (!recipeTree)
			{
				throw new Error('Recipe tree data is not available.');
			}

			return RecipeTreeActions.getNodeTime(recipeTree, nodeId);
		},
		[recipeTree],
	);

	const value = useMemo(
		() => ({ recipeTree, error, dfs, changeRecipe, getResolvedQuantity, getResolvedTime, getNodeTime }),
		[recipeTree, error, dfs, changeRecipe, getResolvedQuantity, getResolvedTime, getNodeTime],
	);

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
