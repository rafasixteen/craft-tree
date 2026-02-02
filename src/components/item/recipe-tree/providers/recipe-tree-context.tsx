'use client';

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { Item, getItemById, getRecipes } from '@/domain/item';
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
	 * All items in the tree by item id.
	 */
	itemsById: Map<string, Item>;

	/**
	 * All recipes keyed by item id.
	 */
	recipesByItemId: Map<string, Recipe[]>;

	/**
	 * All ingredients keyed by recipe id.
	 */
	ingredientsByRecipeId: Map<string, Ingredient[]>;

	/**
	 * Current recipe selections for each node.
	 */
	selections: RecipeSelections;

	/**
	 * Reload the tree data for the current item.
	 */
	reload: () => Promise<void>;

	/**
	 * Replace or insert an item in the map.
	 */
	setItem: (item: Item) => void;

	/**
	 * Replace recipes for an item in the map.
	 */
	setRecipesForItem: (itemId: string, recipes: Recipe[]) => void;

	/**
	 * Replace ingredients for a recipe in the map.
	 */
	setIngredientsForRecipe: (recipeId: string, ingredients: Ingredient[]) => void;

	/**
	 * Get the selected recipe index for a node.
	 */
	getSelectedRecipeIndex: (nodeId: string) => number;

	/**
	 * Set the selected recipe index for a node.
	 */
	setSelectedRecipeIndex: (nodeId: string, index: number) => void;

	/**
	 * Traverse the recipe tree and invoke a callback for each node.
	 */
	traverseTree: (visitor: RecipeTreeVisitor, options?: RecipeTreeTraverseOptions) => Promise<void>;
}

/**
 * Visitor callback signature for traversing the recipe tree.
 */
export type RecipeTreeVisitor = (context: RecipeTreeVisitContext) => void | Promise<void>;

/**
 * Options for traversing the recipe tree.
 */
export interface RecipeTreeTraverseOptions
{
	/**
	 * Use the selected recipe index for traversal. Defaults to true.
	 */
	useSelectedRecipeIndex?: boolean;
}

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
	 * Parent node id, if any.
	 */
	parentNodeId: string | null;

	/**
	 * All recipes for the current item.
	 */
	recipes: Recipe[];

	/**
	 * Selected recipe index used for traversal.
	 */
	selectedRecipeIndex: number;

	/**
	 * Selected recipe, if any.
	 */
	selectedRecipe?: Recipe;

	/**
	 * Ingredients for the selected recipe.
	 */
	ingredients: Ingredient[];

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

	const setSelectedRecipeIndex = useCallback((nodeId: string, index: number) =>
	{
		setSelections((prev) => ({
			...prev,
			[nodeId]: index,
		}));
	}, []);

	const setItem = useCallback((nextItem: Item) =>
	{
		setItemsById((prev) =>
		{
			const next = new Map(prev);
			next.set(nextItem.id, nextItem);
			return next;
		});
	}, []);

	const setRecipesForItem = useCallback((itemId: string, recipes: Recipe[]) =>
	{
		setRecipesByItemId((prev) =>
		{
			const next = new Map(prev);
			next.set(itemId, recipes);
			return next;
		});
	}, []);

	const setIngredientsForRecipe = useCallback((recipeId: string, ingredients: Ingredient[]) =>
	{
		setIngredientsByRecipeId((prev) =>
		{
			const next = new Map(prev);
			next.set(recipeId, ingredients);
			return next;
		});
	}, []);

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

				const recipes = await getRecipes(currentItem.id);
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

	const value: RecipeTreeContextValue = {
		item,
		loading,
		error,
		itemsById,
		recipesByItemId,
		ingredientsByRecipeId,
		reload,
		setItem,
		setRecipesForItem,
		setIngredientsForRecipe,
		selections,
		getSelectedRecipeIndex,
		setSelectedRecipeIndex,
		traverseTree: async (visitor: RecipeTreeVisitor, options?: RecipeTreeTraverseOptions) =>
		{
			if (!item)
			{
				return;
			}

			const useSelectedRecipeIndex = options?.useSelectedRecipeIndex ?? true;

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
				const selectedRecipeIndex = useSelectedRecipeIndex ? (selections[nodeId] ?? 0) : 0;
				const boundedRecipeIndex = Math.min(selectedRecipeIndex, Math.max(recipes.length - 1, 0));
				const selectedRecipe = recipes[boundedRecipeIndex];
				const ingredients = selectedRecipe ? (ingredientsByRecipeId.get(selectedRecipe.id) ?? []) : [];

				await visitor({
					nodeId,
					item: currentItem,
					parentNodeId,
					recipes,
					selectedRecipeIndex: boundedRecipeIndex,
					selectedRecipe,
					ingredients,
					depth,
					path,
				});

				if (!selectedRecipe)
				{
					return;
				}

				const nextAncestors = new Set(ancestors);
				nextAncestors.add(currentItem.id);

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
	};

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
