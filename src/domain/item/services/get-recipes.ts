'use server';

import { eq } from 'drizzle-orm';
import { recipesTable } from '@/db/schema';
import { Recipe } from '@/domain/recipe';
import db from '@/db/client';

export async function getRecipes(itemId: string): Promise<Recipe[]>
{
	return await db.select().from(recipesTable).where(eq(recipesTable.itemId, itemId));
}
