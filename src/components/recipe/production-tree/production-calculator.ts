import { Recipe, RecipeTree, RecipeTreeNode } from '@/domain/recipe';
import { Ingredient } from '@/domain/ingredient';
import { Item } from '@/domain/item';

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
				manufacturersNeeded: 1,
				utilizationPercent: 100,
				ingredientRequirements: [],
			};
			this.cachedRequirements.set(node.item.id, requirement);
			return;
		}

		// This is a recipe/manufacturer
		const recipe = node.recipe;
		const cycleTimeSeconds = recipe.time;
		const producedPerCycle = recipe.quantity;

		// Calculate how many manufacturers we need to produce at the target rate
		const cyclesNeededPerMinute = (60 / cycleTimeSeconds) * (requiredRatePerMinute / producedPerCycle);
		const maxCyclesPerMinute = 60 / cycleTimeSeconds;
		const manufacturersNeeded = Math.ceil(cyclesNeededPerMinute / maxCyclesPerMinute);
		const utilizationPercent = Math.min((cyclesNeededPerMinute / maxCyclesPerMinute) * 100, 100);

		// Calculate ingredient requirements
		const ingredients = this.allIngredients.get(recipe.id) || [];
		const ingredientRequirements = ingredients.map((ing) =>
		{
			const ingredientItem = this.allItems.get(ing.itemId);
			const quantityPerMinute = ing.quantity * cyclesNeededPerMinute;
			return {
				itemId: ing.itemId,
				itemName: ingredientItem?.name || 'Unknown',
				quantityPerMinute,
				quantityPerSecond: quantityPerMinute / 60,
			};
		});

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

		// Recursively calculate for child nodes (ingredients)
		for (const child of node.children)
		{
			const ingredientRequirement = ingredientRequirements.find((ir) => ir.itemId === child.item.id);
			if (ingredientRequirement)
			{
				this.calculateNodeRequirements(child, ingredientRequirement.quantityPerMinute);
			}
		}
	}
}
