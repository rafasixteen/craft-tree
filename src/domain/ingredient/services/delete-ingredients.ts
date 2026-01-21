'use server';

import { ingredientsTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import db from '@/db/client';

export async function deleteIngredients(recipeId: string)
{
	await db.delete(ingredientsTable).where(eq(ingredientsTable.recipeId, recipeId));
}
