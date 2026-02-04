'use server';

import { inArray } from 'drizzle-orm';
import { ingredientsTable, itemsTable, recipesTable } from '@/db/schema';
import { Item } from '@/domain/item';
import { Recipe } from '@/domain/recipe';
import { Ingredient } from '@/domain/ingredient';
import db from '@/db/client';

export interface RecipeTreeData
{
	items: Item[];
	recipes: Recipe[];
	ingredients: Ingredient[];
}

export interface RecipeTreeDataV2
{
	itemsMap: Map<string, Item>;
	recipesMap: Map<string, Recipe[]>;
	ingredientsMap: Map<string, Ingredient[]>;
}

export async function getRecipeTreeData(rootItemId: string): Promise<RecipeTreeData>
{
	const items: Item[] = [];
	const recipes: Recipe[] = [];
	const ingredients: Ingredient[] = [];

	const visitedItemIds = new Set<string>();
	let pendingItemIds = [rootItemId];

	while (pendingItemIds.length > 0)
	{
		const currentItemIds = pendingItemIds.filter((itemId) => !visitedItemIds.has(itemId));
		pendingItemIds = [];

		if (currentItemIds.length === 0)
		{
			continue;
		}

		currentItemIds.forEach((itemId) => visitedItemIds.add(itemId));

		const nextItems = await db.select().from(itemsTable).where(inArray(itemsTable.id, currentItemIds));
		items.push(...nextItems);

		const nextRecipes = await db.select().from(recipesTable).where(inArray(recipesTable.itemId, currentItemIds));
		recipes.push(...nextRecipes);

		if (nextRecipes.length === 0)
		{
			continue;
		}

		const recipeIds = nextRecipes.map((recipe) => recipe.id);
		const nextIngredients = await db.select().from(ingredientsTable).where(inArray(ingredientsTable.recipeId, recipeIds));
		ingredients.push(...nextIngredients);

		const nextItemIds = nextIngredients.map((ingredient) => ingredient.itemId).filter((itemId) => !visitedItemIds.has(itemId));

		if (nextItemIds.length > 0)
		{
			pendingItemIds = Array.from(new Set([...pendingItemIds, ...nextItemIds]));
		}
	}

	return { items, recipes, ingredients };
}

export async function getRecipeTreeDataV2(rootItemId: string): Promise<RecipeTreeDataV2>
{
	const { items, recipes, ingredients } = await getRecipeTreeData(rootItemId);

	const itemsMap = new Map<string, Item>(items.map((item) => [item.id, item]));
	const recipesMap = new Map<string, Recipe[]>();
	const ingredientsMap = new Map<string, Ingredient[]>();

	for (const recipe of recipes)
	{
		const existing = recipesMap.get(recipe.itemId) ?? [];
		recipesMap.set(recipe.itemId, [...existing, recipe]);
	}

	for (const ingredient of ingredients)
	{
		const existing = ingredientsMap.get(ingredient.recipeId) ?? [];
		ingredientsMap.set(ingredient.recipeId, [...existing, ingredient]);
	}

	return { itemsMap, recipesMap, ingredientsMap };
}
