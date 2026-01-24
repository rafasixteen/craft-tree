'use server';

import { Item, getRecipes } from '@/domain/item';
import { Recipe } from '@/domain/recipe';
import { Ingredient } from '@/domain/ingredient';
import { getRecipeIngredients } from '../../../domain/recipe/services/get-recipe-ingredients';
import { itemsTable } from '@/db/schema';
import { inArray } from 'drizzle-orm';
import db from '@/db/client';

export interface RecipeTreeData
{
	allRecipes: Map<string, Recipe[]>;
	allIngredients: Map<string, Ingredient[]>;
	allItems: Map<string, Item>;
}

/**
 * Recursively fetch all recipes, ingredients, and items needed for the recipe tree
 */
export async function getRecipeTreeData(itemId: string): Promise<RecipeTreeData>
{
	const allRecipes = new Map<string, Recipe[]>();
	const allIngredients = new Map<string, Ingredient[]>();
	const allItems = new Map<string, Item>();
	const visited = new Set<string>();

	async function fetchRecursive(currentItemId: string): Promise<void>
	{
		if (visited.has(currentItemId)) return;
		visited.add(currentItemId);

		// Fetch recipes for this item
		const recipes = await getRecipes(currentItemId);
		if (recipes.length > 0)
		{
			allRecipes.set(currentItemId, recipes);

			// Fetch ingredients for each recipe
			for (const recipe of recipes)
			{
				const ingredients = await getRecipeIngredients(recipe.id);
				if (ingredients)
				{
					allIngredients.set(recipe.id, ingredients);

					// Recursively fetch data for each ingredient
					for (const ingredient of ingredients)
					{
						await fetchRecursive(ingredient.itemId);
					}
				}
			}
		}
	}

	await fetchRecursive(itemId);

	// Fetch all item details
	const itemIds = Array.from(visited);
	if (itemIds.length > 0)
	{
		const items = await db.select().from(itemsTable).where(inArray(itemsTable.id, itemIds));
		items.forEach((item) => allItems.set(item.id, item));
	}

	return {
		allRecipes,
		allIngredients,
		allItems,
	};
}
