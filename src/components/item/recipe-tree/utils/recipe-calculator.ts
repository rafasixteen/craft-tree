import { Item } from '@/domain/item';
import { Recipe } from '@/domain/recipe';
import { Ingredient } from '@/domain/ingredient';

type MemoKey = `${string}-${string}`; // itemId-recipeId

export interface RecipeCalculation
{
	/**
	 * Total time to craft this item, including all ingredients recursively.
	 */
	totalTime: number;

	/**
	 * Total quantity of this item needed at this node.
	 */
	totalQuantity: number;

	/**
	 * Map of all required base items and their quantities needed.
	 */
	requiredItems: Map<string, number>;
}

export class RecipeCalculator
{
	private memo = new Map<MemoKey, RecipeCalculation>();

	constructor(
		private getRecipes: (itemId: string) => Recipe[],
		private getItem: (itemId: string) => Item | undefined,
		private getIngredients: (recipeId: string) => Ingredient[],
		private getSelectedRecipeIndex: (nodeId: string) => number,
	)
	{}

	/**
	 * Parse node ID to extract parent path and determine required quantity from parent.
	 */
	private getRequiredQuantityFromNodeId(nodeId: string, itemId: string): number
	{
		// Node ID format: node_recipeId1_itemId1_recipeId2_itemId2_..._currentItemId
		if (nodeId === `node_${itemId}`)
		{
			// Root node
			return 1;
		}

		const parts = nodeId.replace('node_', '').split('_');

		// Walk through the path to accumulate quantity multipliers
		let totalMultiplier = 1;

		for (let i = 0; i < parts.length - 1; i += 2)
		{
			const recipeId = parts[i];
			const childItemId = parts[i + 1];

			// Find the ingredient quantity for this child in this recipe
			const ingredients = this.getIngredients(recipeId);
			const ingredient = ingredients.find((ing) => ing.itemId === childItemId);

			if (ingredient)
			{
				totalMultiplier *= ingredient.quantity;
			}
		}

		return totalMultiplier;
	}

	private getPathFromNodeId(nodeId: string): string
	{
		const raw = nodeId.replace('node_', '');
		const parts = raw.split('_');
		if (parts.length <= 1)
		{
			return '';
		}
		return parts.slice(0, -1).join('_');
	}

	private buildNodeId(path: string, itemId: string): string
	{
		return path ? `node_${path}_${itemId}` : `node_${itemId}`;
	}

	private calculateNode(nodeId: string, itemId: string, multiplier: number, ancestors: Set<string>): RecipeCalculation
	{
		if (ancestors.has(itemId))
		{
			return {
				totalTime: 0,
				totalQuantity: multiplier,
				requiredItems: new Map(),
			};
		}

		const recipes = this.getRecipes(itemId);
		if (recipes.length === 0)
		{
			return {
				totalTime: 0,
				totalQuantity: multiplier,
				requiredItems: new Map([[itemId, multiplier]]),
			};
		}

		const selectedRecipeIndex = this.getSelectedRecipeIndex(nodeId);
		const selectedRecipe = recipes[selectedRecipeIndex];
		if (!selectedRecipe)
		{
			return {
				totalTime: 0,
				totalQuantity: multiplier,
				requiredItems: new Map([[itemId, multiplier]]),
			};
		}

		const ingredients = this.getIngredients(selectedRecipe.id);
		const runs = selectedRecipe.quantity > 0 ? multiplier / selectedRecipe.quantity : 0;
		let totalTime = selectedRecipe.time * runs;
		const requiredItems = new Map<string, number>();

		if (ingredients.length === 0)
		{
			requiredItems.set(itemId, multiplier);
			return {
				totalTime,
				totalQuantity: multiplier,
				requiredItems,
			};
		}

		const nextAncestors = new Set(ancestors);
		nextAncestors.add(itemId);

		const currentPath = this.getPathFromNodeId(nodeId);

		for (const ingredient of ingredients)
		{
			const quantityNeeded = ingredient.quantity * runs;
			if (quantityNeeded === 0)
			{
				continue;
			}

			const childPath = `${currentPath}${currentPath ? '_' : ''}${selectedRecipe.id}_${ingredient.itemId}`;
			const childNodeId = this.buildNodeId(childPath, ingredient.itemId);
			const childCalc = this.calculateNode(childNodeId, ingredient.itemId, quantityNeeded, nextAncestors);
			totalTime += childCalc.totalTime;

			for (const [depItemId, depQty] of childCalc.requiredItems)
			{
				requiredItems.set(depItemId, (requiredItems.get(depItemId) ?? 0) + depQty);
			}
		}

		return {
			totalTime,
			totalQuantity: multiplier,
			requiredItems,
		};
	}

	/**
	 * Calculate the total time and quantities for a given item and recipe.
	 */
	calculate(itemId: string, recipeId: string, multiplier = 1): RecipeCalculation
	{
		const key: MemoKey = `${itemId}-${recipeId}`;

		// Return cached result if available
		if (this.memo.has(key))
		{
			const cached = this.memo.get(key)!;
			// Apply multiplier to cached result
			return {
				totalTime: cached.totalTime * multiplier,
				totalQuantity: cached.totalQuantity * multiplier,
				requiredItems: new Map(Array.from(cached.requiredItems.entries()).map(([id, qty]) => [id, qty * multiplier])),
			};
		}

		const recipes = this.getRecipes(itemId);
		const recipe = recipes.find((r) => r.id === recipeId);

		if (!recipe)
		{
			// No recipe found, treat as base item
			return {
				totalTime: 0,
				totalQuantity: multiplier,
				requiredItems: new Map([[itemId, multiplier]]),
			};
		}

		const ingredients = this.getIngredients(recipeId);

		// Start with the recipe's own time
		let totalTime = recipe.time;
		const requiredItems = new Map<string, number>();
		// Total quantity is how many we NEED to make
		const totalQuantity = multiplier;

		// If there are no ingredients, this is a base item
		if (ingredients.length === 0)
		{
			requiredItems.set(itemId, totalQuantity);
		}
		else
		{
			// Recursively calculate ingredient requirements
			for (const ingredient of ingredients)
			{
				const ingredientRecipes = this.getRecipes(ingredient.itemId);

				if (ingredientRecipes.length === 0)
				{
					// Base ingredient with no recipes
					const qty = ingredient.quantity * multiplier;
					requiredItems.set(ingredient.itemId, (requiredItems.get(ingredient.itemId) ?? 0) + qty);
					continue;
				}

				// Use the first recipe for the ingredient
				const ingredientRecipe = ingredientRecipes[0];

				// Calculate ingredient's total time and quantities (per 1 unit)
				const ingredientCalc = this.calculate(ingredient.itemId, ingredientRecipe.id, 1);

				// Multiply by how many we need for this recipe, times our multiplier
				const quantityNeeded = ingredient.quantity * multiplier;

				// Time is cumulative: need to make quantityNeeded items, each taking ingredientCalc.totalTime
				totalTime += ingredientCalc.totalTime * quantityNeeded;

				// Accumulate required items
				for (const [depItemId, depQty] of ingredientCalc.requiredItems)
				{
					requiredItems.set(depItemId, (requiredItems.get(depItemId) ?? 0) + depQty * quantityNeeded);
				}
			}
		}

		const result: RecipeCalculation = {
			totalTime,
			totalQuantity,
			requiredItems,
		};

		// Cache the base result (without multiplier)
		if (multiplier === 1)
		{
			this.memo.set(key, result);
		}

		return result;
	}

	/**
	 * Calculate for a specific node using the selected recipe for that node.
	 */
	calculateForNode(nodeId: string, itemId: string): RecipeCalculation
	{
		const requiredQuantity = this.getRequiredQuantityFromNodeId(nodeId, itemId);
		return this.calculateNode(nodeId, itemId, requiredQuantity, new Set());
	}

	/**
	 * Clear the memoization cache.
	 */
	clearCache(): void
	{
		this.memo.clear();
	}
}
