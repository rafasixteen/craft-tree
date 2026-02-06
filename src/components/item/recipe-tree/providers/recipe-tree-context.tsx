'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { Item } from '@/domain/item';
import { RecipeTree } from '@/components/item/recipe-tree';

interface RecipeTreeContextValue
{
	tree: RecipeTree | null;
	loading: boolean;
	error?: unknown;
}

const RecipeTreeContext = createContext<RecipeTreeContextValue | undefined>(undefined);

interface RecipeTreeProviderProps
{
	itemId: Item['id'];
	children: ReactNode;
}

export function RecipeTreeProvider({ itemId, children }: RecipeTreeProviderProps)
{
	const [tree, setTree] = useState<RecipeTree | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<unknown | undefined>(undefined);

	useEffect(() =>
	{
		let cancelled = false;

		setLoading(true);
		setError(undefined);

		async function load()
		{
			try
			{
				const newTree = await RecipeTree.create(itemId);
				if (!cancelled)
				{
					setTree(newTree);
				}
			}
			catch (err)
			{
				if (!cancelled)
				{
					setError(err);
				}
			}
			finally
			{
				if (!cancelled)
				{
					setLoading(false);
				}
			}
		}

		load();

		return () =>
		{
			cancelled = true;
		};
	}, [itemId]);

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
