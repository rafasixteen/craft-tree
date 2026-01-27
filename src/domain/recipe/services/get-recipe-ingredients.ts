'use server';

import { ingredientsTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { Ingredient } from '@/domain/ingredient';
import db from '@/db/client';

export async function getRecipeIngredients(recipeId: string): Promise<Ingredient[]>
{
	console.log(`Fetching ingredients for recipe ID: ${recipeId}`);

	return await db.select().from(ingredientsTable).where(eq(ingredientsTable.recipeId, recipeId));
}
