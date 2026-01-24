import { Recipe } from '@/domain/recipe';
import { Ingredient } from '@/domain/ingredient';
import { Item } from '@/domain/item';

export interface RecipeTreeNode
{
	item: Item;
	recipe: Recipe | null;
	ingredients: Ingredient[];
	quantity: number;
	depth: number;
	children: RecipeTreeNode[];
	// Track which recipe option is selected if multiple exist
	selectedRecipeIndex?: number;
}

export interface RecipeTreeResult
{
	root: RecipeTreeNode;
	totalCost: Map<string, { item: Item; quantity: number }>;
	leftovers: Map<string, { item: Item; quantity: number }>;
}

export interface RecipeWithIngredients
{
	recipe: Recipe;
	ingredients: Ingredient[];
}

/**
 * A class-based implementation of a recipe tree for easier state management and modifications
 */
export class RecipeTree
{
	private targetItem: Item;
	private targetQuantity: number;
	private allRecipes: Map<string, Recipe[]>;
	private allIngredients: Map<string, Ingredient[]>;
	private allItems: Map<string, Item>;
	private selectedRecipes: Map<string, number>;
	private visited: Set<string>;
	private totalCost: Map<string, { item: Item; quantity: number }>;
	private leftovers: Map<string, { item: Item; quantity: number }>;
	private cachedResult: RecipeTreeResult | null = null;

	constructor(
		targetItem: Item,
		targetQuantity: number,
		allRecipes: Map<string, Recipe[]>,
		allIngredients: Map<string, Ingredient[]>,
		allItems: Map<string, Item>,
		selectedRecipes: Map<string, number> = new Map(),
	)
	{
		this.targetItem = targetItem;
		this.targetQuantity = targetQuantity;
		this.allRecipes = allRecipes;
		this.allIngredients = allIngredients;
		this.allItems = allItems;
		this.selectedRecipes = new Map(selectedRecipes);
		this.visited = new Set();
		this.totalCost = new Map();
		this.leftovers = new Map();
	}

	/**
	 * Build and return the recipe tree result
	 */
	public build(): RecipeTreeResult
	{
		if (this.cachedResult) return this.cachedResult;

		this.visited.clear();
		this.totalCost.clear();
		this.leftovers.clear();

		const root = this.buildNode(this.targetItem, this.targetQuantity, 0);

		this.cachedResult = {
			root,
			totalCost: this.totalCost,
			leftovers: this.leftovers,
		};

		return this.cachedResult;
	}

	/**
	 * Update the selected recipe for an item and rebuild the tree
	 */
	public updateRecipeSelection(itemId: string, recipeIndex: number): RecipeTreeResult
	{
		this.selectedRecipes.set(itemId, recipeIndex);
		this.cachedResult = null; // Invalidate cache
		return this.build();
	}

	/**
	 * Get the selected recipe index for an item
	 */
	public getSelectedRecipeIndex(itemId: string): number
	{
		return this.selectedRecipes.get(itemId) || 0;
	}

	/**
	 * Get all selected recipes
	 */
	public getSelectedRecipes(): Map<string, number>
	{
		return new Map(this.selectedRecipes);
	}

	/**
	 * Check if an item has multiple recipe options
	 */
	public hasMultipleRecipes(itemId: string): boolean
	{
		const recipes = this.allRecipes.get(itemId);
		return recipes ? recipes.length > 1 : false;
	}

	/**
	 * Get available recipes for an item
	 */
	public getRecipesForItem(itemId: string): Recipe[]
	{
		return this.allRecipes.get(itemId) || [];
	}

	/**
	 * Private method to build a single node recursively
	 */
	private buildNode(item: Item, requiredQuantity: number, depth: number = 0): RecipeTreeNode
	{
		// Check for cycles - if we've already visited this item in this path, it's a cycle
		if (this.visited.has(item.id))
		{
			// Return a leaf node without recursing further
			const node: RecipeTreeNode = {
				item,
				recipe: null,
				ingredients: [],
				quantity: requiredQuantity,
				depth,
				children: [],
			};

			// Add to total cost
			const existing = this.totalCost.get(item.id);
			this.totalCost.set(item.id, {
				item,
				quantity: (existing?.quantity || 0) + requiredQuantity,
			});

			return node;
		}

		this.visited.add(item.id);

		const itemRecipes = this.allRecipes.get(item.id) || [];

		// Get selected recipe index or default to 0
		const selectedIndex = this.selectedRecipes.get(item.id) || 0;
		const recipe = itemRecipes[selectedIndex] || null;

		// If no recipe exists, this is a base ingredient
		if (!recipe)
		{
			const node: RecipeTreeNode = {
				item,
				recipe: null,
				ingredients: [],
				quantity: requiredQuantity,
				depth,
				children: [],
			};

			// Add to total cost
			const existing = this.totalCost.get(item.id);
			this.totalCost.set(item.id, {
				item,
				quantity: (existing?.quantity || 0) + requiredQuantity,
			});

			this.visited.delete(item.id);
			return node;
		}

		// Calculate how many times we need to craft this recipe
		const craftCount = Math.ceil(requiredQuantity / recipe.quantity);
		const producedQuantity = craftCount * recipe.quantity;
		const leftoverQuantity = producedQuantity - requiredQuantity;

		// Track leftovers
		if (leftoverQuantity > 0)
		{
			const existing = this.leftovers.get(item.id);
			this.leftovers.set(item.id, {
				item,
				quantity: (existing?.quantity || 0) + leftoverQuantity,
			});
		}

		const recipeIngredients = this.allIngredients.get(recipe.id) || [];
		const children: RecipeTreeNode[] = [];

		// Build child nodes for each ingredient
		for (const ingredient of recipeIngredients)
		{
			const ingredientItem = this.allItems.get(ingredient.itemId);
			if (!ingredientItem) continue;

			const requiredIngredientQuantity = ingredient.quantity * craftCount;
			const childNode = this.buildNode(ingredientItem, requiredIngredientQuantity, depth + 1);
			children.push(childNode);
		}

		const result: RecipeTreeNode = {
			item,
			recipe,
			ingredients: recipeIngredients,
			quantity: requiredQuantity,
			depth,
			children,
			selectedRecipeIndex: selectedIndex,
		};

		this.visited.delete(item.id);
		return result;
	}
}

/**
 * Helper function to build a recipe tree (for backward compatibility)
 */
export function buildRecipeTree(
	targetItem: Item,
	targetQuantity: number,
	allRecipes: Map<string, Recipe[]>,
	allIngredients: Map<string, Ingredient[]>,
	allItems: Map<string, Item>,
	selectedRecipes: Map<string, number> = new Map(),
): RecipeTreeResult
{
	const tree = new RecipeTree(targetItem, targetQuantity, allRecipes, allIngredients, allItems, selectedRecipes);
	return tree.build();
}

/**
 * Helper function to update recipe selection (for backward compatibility)
 */
export function updateRecipeSelection(
	currentResult: RecipeTreeResult,
	targetItem: Item,
	targetQuantity: number,
	itemId: string,
	recipeIndex: number,
	allRecipes: Map<string, Recipe[]>,
	allIngredients: Map<string, Ingredient[]>,
	allItems: Map<string, Item>,
): RecipeTreeResult
{
	const tree = new RecipeTree(targetItem, targetQuantity, allRecipes, allIngredients, allItems);

	// Restore previous selections
	function extractSelections(node: RecipeTreeNode): void
	{
		if (node.selectedRecipeIndex !== undefined)
		{
			tree.updateRecipeSelection(node.item.id, node.selectedRecipeIndex);
		}
		node.children.forEach(extractSelections);
	}

	extractSelections(currentResult.root);

	// Update the selection for the target item
	return tree.updateRecipeSelection(itemId, recipeIndex);
}
