'use server';

import { recipesTable } from '@/db/schema';
import { Recipe } from '@/domain/recipe';
import { eq } from 'drizzle-orm';
import db from '@/db/client';

export async function getRecipeById(id: string): Promise<Recipe | null>
{
	const existingRecipe = await db
		.select()
		.from(recipesTable)
		.where(eq(recipesTable.id, id))
		.limit(1)
		.then((rows) => rows[0] || null);

	return existingRecipe;
}
