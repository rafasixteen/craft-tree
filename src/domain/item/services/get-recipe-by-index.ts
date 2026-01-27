'use server';

import { eq } from 'drizzle-orm';
import { recipesTable } from '@/db/schema';
import { Recipe } from '@/domain/recipe';
import db from '@/db/client';

export async function getRecipeByIndex(itemId: string, index: number): Promise<Recipe | null>
{
	const recipes = await db.select().from(recipesTable).where(eq(recipesTable.itemId, itemId));

	if (index < 0 || index >= recipes.length)
	{
		return null;
	}

	return recipes[index];
}
