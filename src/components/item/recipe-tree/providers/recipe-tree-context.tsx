'use client';

import { createContext, useContext, useState, useCallback, useEffect, ReactNode, useMemo } from 'react';
import { Item } from '@/domain/item';
import { Recipe } from '@/domain/recipe';
import { Ingredient } from '@/domain/ingredient';
import { getRecipeTreeData } from '@/components/item/recipe-tree';

interface RecipeTreeContextValue
{
	/**
	 * Root item used to build the tree data.
	 */
	rootItem: Item | null;

	/**
	 * Whether the tree data is currently loading.
	 */
	loading: boolean;

	/**
	 * Error encountered while loading tree data.
	 */
	error?: unknown;

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
	 * Select a recipe for a node by moving the index by `delta`.
	 * - delta = -1 → previous recipe
	 * - delta = +1 → next recipe
	 */
	selectRecipe: (nodeId: string, itemId: string, delta: number) => void;

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

const RecipeTreeContext = createContext<RecipeTreeContextValue | undefined>(undefined);

interface RecipeTreeVisitContext
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

type RecipeTreeVisitor = (context: RecipeTreeVisitContext) => void | Promise<void>;

interface RecipeTreeProviderProps
{
	item: Item;
	children: ReactNode;
}

export function RecipeTreeProvider({ item, children }: RecipeTreeProviderProps)
{
	const [itemsMap, setItemsMap] = useState<Map<Item['id'], Item>>(new Map());
	const [recipesMap, setRecipesMap] = useState<Map<Item['id'], Recipe[]>>(new Map());
	const [ingredientsMap, setIngredientsMap] = useState<Map<Recipe['id'], Ingredient[]>>(new Map());
	const [nodeRecipeSelections, setNodeRecipeSelections] = useState<Map<string, number>>(new Map());

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<unknown | undefined>(undefined);

	const getItem = useCallback(
		function getItem(itemId: string)
		{
			return itemsMap.get(itemId);
		},
		[itemsMap],
	);

	const getRecipes = useCallback(
		function getRecipes(itemId: string)
		{
			return recipesMap.get(itemId) ?? [];
		},
		[recipesMap],
	);

	const getIngredients = useCallback(
		function getIngredients(recipeId: string)
		{
			return ingredientsMap.get(recipeId) ?? [];
		},
		[ingredientsMap],
	);

	const getSelectedRecipeIndex = useCallback(
		function getSelectedRecipeIndex(nodeId: string): number
		{
			return nodeRecipeSelections.get(nodeId) ?? 0;
		},
		[nodeRecipeSelections],
	);

	const selectRecipe = useCallback(
		function selectRecipe(nodeId: string, itemId: string, delta: number): void
		{
			const recipes = recipesMap.get(itemId) ?? [];

			if (recipes.length === 0 || delta === 0)
			{
				return;
			}

			setNodeRecipeSelections((prev) =>
			{
				const currentIndex = prev.get(nodeId) ?? 0;

				const nextIndex = (((currentIndex + delta) % recipes.length) + recipes.length) % recipes.length;

				if (nextIndex === currentIndex)
				{
					return prev;
				}

				const next = new Map(prev);
				next.set(nodeId, nextIndex);
				return next;
			});
		},
		[recipesMap],
	);

	const selectPreviousRecipe = useCallback(
		function selectPreviousRecipe(nodeId: string, itemId: string)
		{
			selectRecipe(nodeId, itemId, -1);
		},
		[selectRecipe],
	);

	const selectNextRecipe = useCallback(
		function selectNextRecipe(nodeId: string, itemId: string)
		{
			selectRecipe(nodeId, itemId, 1);
		},
		[selectRecipe],
	);

	const reload = useCallback(
		async function reload()
		{
			setLoading(true);
			setError(null);

			try
			{
				const { items, recipes, ingredients } = await getRecipeTreeData(item.id);

				const nextItemsById = new Map<string, Item>(items.map((entry) => [entry.id, entry]));
				const nextRecipesByItemId = new Map<string, Recipe[]>();
				const nextIngredientsByRecipeId = new Map<string, Ingredient[]>();

				for (const recipe of recipes)
				{
					const existing = nextRecipesByItemId.get(recipe.itemId) ?? [];
					nextRecipesByItemId.set(recipe.itemId, [...existing, recipe]);
				}

				for (const ingredient of ingredients)
				{
					const existing = nextIngredientsByRecipeId.get(ingredient.recipeId) ?? [];
					nextIngredientsByRecipeId.set(ingredient.recipeId, [...existing, ingredient]);
				}

				if (!nextItemsById.has(item.id))
				{
					nextItemsById.set(item.id, item);
				}

				setItemsMap(nextItemsById);
				setRecipesMap(nextRecipesByItemId);
				setIngredientsMap(nextIngredientsByRecipeId);
				setNodeRecipeSelections(new Map());
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

	const traverseTree = useCallback(
		async function traverseTree(visitor: RecipeTreeVisitor)
		{
			function buildNodeId(currentPath: string, itemId: string): string
			{
				return currentPath ? `node_${currentPath}_${itemId}` : `node_${itemId}`;
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

				const nodeId = buildNodeId(path, currentItem.id);
				const recipes = recipesMap.get(currentItem.id) ?? [];
				const selectedRecipeIndex = nodeRecipeSelections.get(nodeId) ?? 0;
				const selectedRecipe = recipes[selectedRecipeIndex];
				const ingredients = selectedRecipe ? (ingredientsMap.get(selectedRecipe.id) ?? []) : null;

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

				for (const ingredient of ingredients)
				{
					const childItem = itemsMap.get(ingredient.itemId);

					if (!childItem)
					{
						continue;
					}

					const nextPath = `${path}${path ? '_' : ''}${selectedRecipe.id}_${ingredient.itemId}`;
					await traverse(childItem, nodeId, nextAncestors, nextPath, depth + 1);
				}
			}

			await traverse(item, null, new Set(), '', 0);
		},
		[item, recipesMap, ingredientsMap, itemsMap, nodeRecipeSelections],
	);

	useEffect(() =>
	{
		reload();
	}, [reload]);

	const value = useMemo<RecipeTreeContextValue>(
		() => ({
			rootItem: item,
			loading,
			error,
			reload,
			getItem,
			getRecipes,
			getIngredients,
			getSelectedRecipeIndex,
			selectRecipe,
			selectPreviousRecipe,
			selectNextRecipe,
			traverseTree,
		}),
		[item, loading, error, reload, getItem, getRecipes, getIngredients, getSelectedRecipeIndex, selectRecipe, selectPreviousRecipe, selectNextRecipe, traverseTree],
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
