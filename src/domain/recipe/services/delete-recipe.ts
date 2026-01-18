'use server';

import { recipesTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import db from '@/db/client';

export async function deleteRecipe(recipeId: string)
{
	await db.delete(recipesTable).where(eq(recipesTable.id, recipeId));
}
