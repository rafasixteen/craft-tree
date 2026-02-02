'use client';

import { createContext, useContext, useState, useCallback, useEffect, ReactNode, useMemo } from 'react';
import { Item, getItemById, getRecipes as fetchRecipes } from '@/domain/item';
import { Recipe, getRecipeIngredients } from '@/domain/recipe';
import { Ingredient } from '@/domain/ingredient';

/**
 * Represents the state of recipe selections in the tree.
 * Maps nodeId -> selectedRecipeIndex
 */
interface RecipeSelections
{
	[nodeId: string]: number;
}

/**
 * Context for managing recipe tree state and mutations.
 */
interface RecipeTreeContextValue
{
	/**
	 * Root item used to build the tree data.
	 */
	item: Item | null;

	/**
	 * Whether the tree data is currently loading.
	 */
	loading: boolean;

	/**
	 * Error encountered while loading tree data.
	 */
	error: Error | null;

	/**
	 * Reload the tree data for the current item.
	 */
	reload: () => Promise<void>;

	/**
	 * Get an item by id from the tree.
	 */
	getItem: (itemId: string) => Item | undefined;

	/**
	 * Get recipes for an item id from the tree.
	 */
	getRecipes: (itemId: string) => Recipe[];

	/**
	 * Get ingredients for a recipe id from the tree.
	 */
	getIngredients: (recipeId: string) => Ingredient[];

	/**
	 * Get the selected recipe index for a node.
	 */
	getSelectedRecipeIndex: (nodeId: string) => number;

	/**
	 * Select the previous recipe for a node.
	 */
	selectPreviousRecipe: (nodeId: string, itemId: string) => void;

	/**
	 * Select the next recipe for a node.
	 */
	selectNextRecipe: (nodeId: string, itemId: string) => void;

	/**
	 * Traverse the recipe tree and invoke a callback for each node.
	 */
	traverseTree: (visitor: RecipeTreeVisitor) => Promise<void>;
}

/**
 * Visitor callback signature for traversing the recipe tree.
 */
export type RecipeTreeVisitor = (context: RecipeTreeVisitContext) => void | Promise<void>;

/**
 * Context provided to the visitor during traversal.
 */
export interface RecipeTreeVisitContext
{
	/**
	 * Deterministic node id for the current item.
	 */
	nodeId: string;

	/**
	 * Current item.
	 */
	item: Item;

	/**
	 * Parent node id, can be null if the current item is the root.
	 */
	parentNodeId: string | null;

	/**
	 * Recipe information for the current item. Only present if the item has recipes.
	 */
	recipe?: {
		/**
		 * All recipes for the current item.
		 */
		recipes: Recipe[];

		/**
		 * Selected recipe.
		 */
		selectedRecipe: Recipe;

		/**
		 * Ingredients for the selected recipe.
		 */
		ingredients: Ingredient[];
	};

	/**
	 * Current depth in the tree.
	 */
	depth: number;

	/**
	 * Path used to generate deterministic node ids.
	 */
	path: string;
}

const RecipeTreeContext = createContext<RecipeTreeContextValue | undefined>(undefined);

/**
 * Provider component for recipe tree state management.
 */
export function RecipeTreeProvider({ item, children }: { item: Item | null; children: ReactNode })
{
	const [itemsById, setItemsById] = useState<Map<string, Item>>(new Map());
	const [recipesByItemId, setRecipesByItemId] = useState<Map<string, Recipe[]>>(new Map());
	const [ingredientsByRecipeId, setIngredientsByRecipeId] = useState<Map<string, Ingredient[]>>(new Map());
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);
	const [selections, setSelections] = useState<RecipeSelections>({});

	const getSelectedRecipeIndex = useCallback(
		(nodeId: string): number =>
		{
			return selections[nodeId] ?? 0;
		},
		[selections],
	);

	const getItem = useCallback((itemId: string) => itemsById.get(itemId), [itemsById]);

	const getRecipes = useCallback((itemId: string) => recipesByItemId.get(itemId) ?? [], [recipesByItemId]);

	const getIngredients = useCallback((recipeId: string) => ingredientsByRecipeId.get(recipeId) ?? [], [ingredientsByRecipeId]);

	const selectPreviousRecipe = useCallback(
		(nodeId: string, itemId: string) =>
		{
			const recipes = recipesByItemId.get(itemId) ?? [];
			if (recipes.length === 0)
			{
				return;
			}

			setSelections((prev) =>
			{
				const currentIndex = prev[nodeId] ?? 0;
				const nextIndex = (currentIndex - 1 + recipes.length) % recipes.length;
				if (nextIndex === currentIndex)
				{
					return prev;
				}

				return {
					...prev,
					[nodeId]: nextIndex,
				};
			});
		},
		[recipesByItemId],
	);

	const selectNextRecipe = useCallback(
		(nodeId: string, itemId: string) =>
		{
			const recipes = recipesByItemId.get(itemId) ?? [];
			if (recipes.length === 0)
			{
				return;
			}

			setSelections((prev) =>
			{
				const currentIndex = prev[nodeId] ?? 0;
				const nextIndex = (currentIndex + 1) % recipes.length;
				if (nextIndex === currentIndex)
				{
					return prev;
				}

				return {
					...prev,
					[nodeId]: nextIndex,
				};
			});
		},
		[recipesByItemId],
	);

	const reload = useCallback(async () =>
	{
		if (!item)
		{
			setItemsById(new Map());
			setRecipesByItemId(new Map());
			setIngredientsByRecipeId(new Map());
			return;
		}

		setLoading(true);
		setError(null);

		try
		{
			const nextItemsById = new Map<string, Item>();
			const nextRecipesByItemId = new Map<string, Recipe[]>();
			const nextIngredientsByRecipeId = new Map<string, Ingredient[]>();
			const visited = new Set<string>();

			async function traverse(currentItem: Item, ancestors: Set<string>): Promise<void>
			{
				if (ancestors.has(currentItem.id))
				{
					console.warn(
						`Recipe tree cycle detected: item "${currentItem.name}" (${currentItem.id}) appears again in its own ancestor chain. ` +
							`This indicates a circular dependency between recipes (e.g., A requires B, and B requires A). ` +
							`The recursion for this branch is stopped to prevent an infinite loop.`,
					);
					return;
				}

				if (visited.has(currentItem.id))
				{
					return;
				}

				visited.add(currentItem.id);
				nextItemsById.set(currentItem.id, currentItem);

				const recipes = await fetchRecipes(currentItem.id);
				nextRecipesByItemId.set(currentItem.id, recipes);

				for (const recipe of recipes)
				{
					const ingredients = await getRecipeIngredients(recipe.id);
					nextIngredientsByRecipeId.set(recipe.id, ingredients);

					for (const ingredient of ingredients)
					{
						const ingredientItem = await getItemById(ingredient.itemId);
						const nextAncestors = new Set(ancestors);
						nextAncestors.add(currentItem.id);
						await traverse(ingredientItem, nextAncestors);
					}
				}
			}

			await traverse(item, new Set());

			setItemsById(nextItemsById);
			setRecipesByItemId(nextRecipesByItemId);
			setIngredientsByRecipeId(nextIngredientsByRecipeId);
		}
		catch (err)
		{
			setError(err as Error);
		}
		finally
		{
			setLoading(false);
		}
	}, [item]);

	useEffect(() =>
	{
		void reload();
	}, [reload]);

	const traverseTree = useCallback(
		async (visitor: RecipeTreeVisitor) =>
		{
			if (!item)
			{
				return;
			}

			async function traverse(currentItem: Item, parentNodeId: string | null, ancestors: Set<string>, path: string, depth: number): Promise<void>
			{
				if (ancestors.has(currentItem.id))
				{
					console.warn(
						`Recipe tree cycle detected: item "${currentItem.name}" (${currentItem.id}) appears again in its own ancestor chain. ` +
							`This indicates a circular dependency between recipes (e.g., A requires B, and B requires A). ` +
							`The recursion for this branch is stopped to prevent an infinite loop.`,
					);
					return;
				}

				const nodeId = path ? `node_${path}_${currentItem.id}` : `node_${currentItem.id}`;
				const recipes = recipesByItemId.get(currentItem.id) ?? [];
				const selectedRecipeIndex = selections[nodeId] ?? 0;
				const boundedRecipeIndex = Math.min(selectedRecipeIndex, Math.max(recipes.length - 1, 0));
				const selectedRecipe = recipes[boundedRecipeIndex];
				const ingredients = selectedRecipe ? (ingredientsByRecipeId.get(selectedRecipe.id) ?? []) : null;

				await visitor({
					nodeId,
					item: currentItem,
					parentNodeId,
					recipe: selectedRecipe
						? {
								recipes,
								selectedRecipe,
								ingredients: ingredients ?? [],
							}
						: undefined,
					depth,
					path,
				});

				if (!selectedRecipe)
				{
					return;
				}

				const nextAncestors = new Set(ancestors);
				nextAncestors.add(currentItem.id);

				if (!ingredients)
				{
					return;
				}

				for (let ingredientIndex = 0; ingredientIndex < ingredients.length; ingredientIndex++)
				{
					const ingredient = ingredients[ingredientIndex];
					const childItem = itemsById.get(ingredient.itemId);
					if (!childItem)
					{
						continue;
					}

					const nextPath = `${path}${path ? '_' : ''}${boundedRecipeIndex}_${ingredientIndex}`;
					await traverse(childItem, nodeId, nextAncestors, nextPath, depth + 1);
				}
			}

			await traverse(item, null, new Set(), '', 0);
		},
		[item, recipesByItemId, ingredientsByRecipeId, itemsById, selections],
	);

	const value = useMemo<RecipeTreeContextValue>(
		() => ({
			item,
			loading,
			error,
			reload,
			getItem,
			getRecipes,
			getIngredients,
			getSelectedRecipeIndex,
			selectPreviousRecipe,
			selectNextRecipe,
			traverseTree,
		}),
		[item, loading, error, reload, getItem, getRecipes, getIngredients, getSelectedRecipeIndex, selectPreviousRecipe, selectNextRecipe, traverseTree],
	);

	return <RecipeTreeContext.Provider value={value}>{children}</RecipeTreeContext.Provider>;
}

/**
 * Hook to access the recipe tree context.
 */
export function useRecipeTreeContext(): RecipeTreeContextValue
{
	const context = useContext(RecipeTreeContext);
	if (!context)
	{
		throw new Error('useRecipeTreeContext must be used within a RecipeTreeProvider');
	}
	return context;
}
