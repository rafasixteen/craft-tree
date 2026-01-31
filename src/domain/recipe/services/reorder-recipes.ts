'use server';

import { recipesTable } from '@/db/schema';
import { and, eq } from 'drizzle-orm';
import db from '@/db/client';

interface RecipeOrder
{
	id: string;
	order: number;
}

interface ReorderRecipesArgs
{
	itemId: string;
	recipeOrders: RecipeOrder[];
}

export async function reorderRecipes({ itemId, recipeOrders }: ReorderRecipesArgs)
{
	await db.transaction(async (tx) =>
	{
		for (const { id, order } of recipeOrders)
		{
			await tx
				.update(recipesTable)
				.set({ order })
				.where(and(eq(recipesTable.id, id), eq(recipesTable.itemId, itemId)));
		}
	});
}
