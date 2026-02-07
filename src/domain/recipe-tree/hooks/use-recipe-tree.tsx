import { useMemo, createContext, useContext, useCallback } from 'react';
import { RecipeTreeNode, RecipeTreeState, getRecipeTreeData, parseRecipeTreeData } from '@/domain/recipe-tree';
import { Item } from '@/domain/item';
import { DfsOrder, DfsCallback, DfsGetChildren } from '@/domain/recipe-tree';
import * as RecipeTreeActions from '@/domain/recipe-tree/utils/recipe-tree-actions';
import useSWR from 'swr';

interface RecipeTreeContext
{
	recipeTree: RecipeTreeState | null;
	error: Error | null;
	dfs: (startNodeId: RecipeTreeNode['id'], callback: DfsCallback, getChildren?: DfsGetChildren, order?: DfsOrder) => void;
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

	const recipeTree = useMemo(() => (rawData ? parseRecipeTreeData(rawData) : null), [rawData]);

	const dfs = useCallback(
		function dfs(startNodeId: RecipeTreeNode['id'], callback: DfsCallback, getChildren: DfsGetChildren = (n) => n.children || [], order: DfsOrder = 'pre'): void
		{
			if (!recipeTree)
			{
				throw new Error('Recipe tree data is not available.');
			}

			RecipeTreeActions.dfs(recipeTree, startNodeId, callback, getChildren, order);
		},
		[recipeTree],
	);

	function changeRecipe(nodeId: RecipeTreeNode['id'], delta: number): void
	{
		if (!recipeTree)
		{
			throw new Error('Recipe tree data is not available.');
		}

		// TODO: Allow recipe tree to be settable.
		const newState = RecipeTreeActions.changeRecipe(recipeTree, nodeId, delta);
	}

	const value = useMemo(() => ({ recipeTree, error, dfs }), [recipeTree, error, dfs]);

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
