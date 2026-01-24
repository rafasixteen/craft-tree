'use server';

import { recipesTable } from '@/db/schema';
import { Recipe } from '@/domain/recipe';
import { eq } from 'drizzle-orm';
import db from '@/db/client';

export async function getRecipeById(recipeId: string): Promise<Recipe>
{
	const [recipe] = await db.select().from(recipesTable).where(eq(recipesTable.id, recipeId)).limit(1);

	return recipe;
}
