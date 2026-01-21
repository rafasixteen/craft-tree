'use server';

import { ingredientsTable } from '@/db/schema';
import { Ingredient } from '@/domain/ingredient';
import db from '@/db/client';

interface CreateIngredientArgs
{
	itemId: string;
	quantity: number;
	recipeId: string;
}

export async function createIngredient({ itemId, quantity, recipeId }: CreateIngredientArgs): Promise<Ingredient>
{
	const [insertedIngredient] = await db.insert(ingredientsTable).values({ itemId, quantity, recipeId }).returning();
	return insertedIngredient;
}
