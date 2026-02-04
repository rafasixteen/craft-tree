'use client';

import { createContext, useContext, useState, useCallback, useEffect, ReactNode, useMemo } from 'react';
import { Item } from '@/domain/item';
import { RecipeTree } from '@/components/item/recipe-tree/utils';

interface RecipeTreeContextValue
{
	/**
	 * The recipe tree structure.
	 */
	tree: RecipeTree | null;

	/**
	 * Whether the tree data is currently loading.
	 */
	loading: boolean;

	/**
	 * Error encountered while loading tree data.
	 */
	error?: unknown;
}

const RecipeTreeContext = createContext<RecipeTreeContextValue | undefined>(undefined);

interface RecipeTreeProviderProps
{
	item: Item;
	children: ReactNode;
}

export function RecipeTreeProvider({ item, children }: RecipeTreeProviderProps)
{
	const [tree, setTree] = useState<RecipeTree | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<unknown | undefined>(undefined);

	const reload = useCallback(
		async function reload()
		{
			setLoading(true);
			setError(undefined);

			try
			{
				setTree(await RecipeTree.fromItem(item));
			}
			catch (err)
			{
				setError(err);
			}
			finally
			{
				setLoading(false);
			}
		},
		[item],
	);

	useEffect(() =>
	{
		reload();
	}, [reload]);

	const value = useMemo<RecipeTreeContextValue>(
		() => ({
			tree,
			loading,
			error,
		}),
		[tree, loading, error],
	);

	return <RecipeTreeContext.Provider value={value}>{children}</RecipeTreeContext.Provider>;
}

export function useRecipeTreeContext(): RecipeTreeContextValue
{
	const context = useContext(RecipeTreeContext);

	if (!context)
	{
		throw new Error('useRecipeTreeContext must be used within a RecipeTreeProvider');
	}

	return context;
}
