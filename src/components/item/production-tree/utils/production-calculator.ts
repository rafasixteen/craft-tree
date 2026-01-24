import { Recipe } from '@/domain/recipe';
import { Ingredient } from '@/domain/ingredient';
import { Item } from '@/domain/item';
import { RecipeTree, RecipeTreeNode } from '@/components/item';

/**
 * Production requirements for a single item/recipe
 */
export interface ProductionRequirement
{
	itemId: string;
	itemName: string;
	recipeId: string | null;
	recipeName: string | null;
	requiredRatePerMinute: number;
	producedPerCycle: number;
	cycleTimeSeconds: number;
	manufacturersNeeded: number; // How many of this recipe/manufacturer needed in parallel
	utilizationPercent: number; // How much of each manufacturer's capacity is used
	ingredientRequirements: {
		itemId: string;
		itemName: string;
		quantityPerMinute: number;
		quantityPerSecond: number;
	}[];
}

/**
 * Enhanced tree node with production data
 */
export interface ProductionTreeNode extends RecipeTreeNode
{
	productionRequirement?: ProductionRequirement;
}

/**
 * Calculator for production rates and manufacturing chains
 */
export class ProductionCalculator
{
	private recipeTree: RecipeTree;
	private targetRatePerMinute: number;
	private allRecipes: Map<string, Recipe[]>;
	private allIngredients: Map<string, Ingredient[]>;
	private allItems: Map<string, Item>;
	private cachedRequirements: Map<string, ProductionRequirement> = new Map();

	constructor(recipeTree: RecipeTree, targetRatePerMinute: number, allRecipes: Map<string, Recipe[]>, allIngredients: Map<string, Ingredient[]>, allItems: Map<string, Item>)
	{
		this.recipeTree = recipeTree;
		this.targetRatePerMinute = targetRatePerMinute;
		this.allRecipes = allRecipes;
		this.allIngredients = allIngredients;
		this.allItems = allItems;
	}

	/**
	 * Calculate production requirements for the entire tree
	 */
	public calculateProductionRequirements(): Map<string, ProductionRequirement>
	{
		this.cachedRequirements.clear();
		const treeResult = this.recipeTree.build();
		this.calculateNodeRequirements(treeResult.root, this.targetRatePerMinute);
		return this.cachedRequirements;
	}

	/**
	 * Update the target rate and recalculate
	 */
	public setTargetRate(ratePerMinute: number): Map<string, ProductionRequirement>
	{
		this.targetRatePerMinute = ratePerMinute;
		return this.calculateProductionRequirements();
	}

	/**
	 * Get all requirements
	 */
	public getRequirements(): Map<string, ProductionRequirement>
	{
		return new Map(this.cachedRequirements);
	}

	/**
	 * Private method to recursively calculate production requirements for each node
	 */
	private calculateNodeRequirements(node: RecipeTreeNode, requiredRatePerMinute: number): void
	{
		if (!node.recipe)
		{
			// Base ingredient - no manufacturing needed
			const requirement: ProductionRequirement = {
				itemId: node.item.id,
				itemName: node.item.name,
				recipeId: null,
				recipeName: null,
				requiredRatePerMinute,
				producedPerCycle: 1,
				cycleTimeSeconds: 1,
				manufacturersNeeded: 0,
				utilizationPercent: 0,
				ingredientRequirements: [],
			};
			this.cachedRequirements.set(node.item.id, requirement);
			return;
		}

		const recipe = node.recipe;
		const cycleTimeSeconds = recipe.time || 1;
		const producedPerCycle = recipe.quantity || 1;
		const ratePerSecond = requiredRatePerMinute / 60;
		const producedPerSecond = producedPerCycle / cycleTimeSeconds;
		const manufacturersNeeded = ratePerSecond / producedPerSecond;
		const utilizationPercent = manufacturersNeeded % 1 === 0 ? 100 : (manufacturersNeeded % 1) * 100;

		const ingredientRequirements: ProductionRequirement['ingredientRequirements'] = [];

		// Get ingredients for this recipe
		const ingredients = this.allIngredients.get(recipe.id) || [];
		for (const ingredient of ingredients)
		{
			const ingredientRatePerMinute = (ingredient.quantity / producedPerCycle) * requiredRatePerMinute;
			ingredientRequirements.push({
				itemId: ingredient.itemId,
				itemName: this.allItems.get(ingredient.itemId)?.name || ingredient.itemId,
				quantityPerMinute: ingredientRatePerMinute,
				quantityPerSecond: ingredientRatePerMinute / 60,
			});

			// Recursively calculate for children
			const childNode = node.children.find((c) => c.item.id === ingredient.itemId);
			if (childNode)
			{
				this.calculateNodeRequirements(childNode, ingredientRatePerMinute);
			}
		}

		const requirement: ProductionRequirement = {
			itemId: node.item.id,
			itemName: node.item.name,
			recipeId: recipe.id,
			recipeName: recipe.name,
			requiredRatePerMinute,
			producedPerCycle,
			cycleTimeSeconds,
			manufacturersNeeded,
			utilizationPercent,
			ingredientRequirements,
		};

		this.cachedRequirements.set(node.item.id, requirement);
	}
}
