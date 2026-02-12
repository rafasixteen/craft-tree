import { useMemo, createContext, useContext, useCallback, useEffect, useState } from 'react';
import { RecipeTreeNode, RecipeTreeState, getRecipeTreeData, parseRecipeTreeData, ProductionRate } from '@/domain/recipe-tree';
import { Item } from '@/domain/item';
import { DfsOrder, DfsCallback, DfsGetChildren } from '@/domain/recipe-tree';
import * as RecipeTreeActions from '@/domain/recipe-tree/utils/recipe-tree-actions';
import useSWR from 'swr';

interface RecipeTreeContext
{
	recipeTree: RecipeTreeState | null;
	dfs: (startNodeId: RecipeTreeNode['id'], callback: DfsCallback, getChildren: DfsGetChildren, order?: DfsOrder) => void;
	changeRecipe: (nodeId: RecipeTreeNode['id'], delta: number) => void;
	setRate: (rate: ProductionRate) => void;
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
		function dfs(startNodeId: RecipeTreeNode['id'], callback: DfsCallback, getChildren: DfsGetChildren, order: DfsOrder = 'pre'): void
		{
			if (!recipeTree)
			{
				throw new Error('Recipe tree data is not available.');
			}

			RecipeTreeActions.dfs(recipeTree, startNodeId, callback, getChildren, order);
		},
		[recipeTree],
	);

	const changeRecipe = useCallback(function changeRecipe(nodeId: RecipeTreeNode['id'], delta: number): void
	{
		setRecipeTree((prev) =>
		{
			if (!prev)
			{
				throw new Error('Recipe tree data is not available.');
			}

			return RecipeTreeActions.changeRecipe(prev, nodeId, delta);
		});
	}, []);

	const setRate = useCallback(function setRate(rate: ProductionRate): void
	{
		setRecipeTree((prev) =>
		{
			if (!prev)
			{
				throw new Error('Recipe tree data is not available.');
			}

			return RecipeTreeActions.setRate(prev, rate);
		});
	}, []);

	const value = useMemo(() => ({ recipeTree, dfs, changeRecipe, setRate }), [recipeTree, dfs, changeRecipe, setRate]);

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
