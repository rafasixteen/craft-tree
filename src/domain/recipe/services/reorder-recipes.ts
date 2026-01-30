'use server';

import { recipesTable } from '@/db/schema';
import { and, eq } from 'drizzle-orm';
import db from '@/db/client';

interface ReorderRecipesArgs
{
	itemId: string;
	orderedRecipeIds: string[];
}

export async function reorderRecipes({ itemId, orderedRecipeIds }: ReorderRecipesArgs)
{
	await db.transaction(async (tx) =>
	{
		for (let i = 0; i < orderedRecipeIds.length; i++)
		{
			await tx
				.update(recipesTable)
				.set({ order: i })
				.where(and(eq(recipesTable.id, orderedRecipeIds[i]), eq(recipesTable.itemId, itemId)));
		}
	});
}
