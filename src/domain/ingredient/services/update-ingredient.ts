'use server';

import { ingredientsTable } from '@/db/schema';
import { Ingredient } from '@/domain/ingredient';
import { eq } from 'drizzle-orm';
import db from '@/db/client';

interface UpdateIngredientArgs
{
	id: string;
	data: Partial<{
		quantity: number;
	}>;
}

export async function updateIngredient({ id, data }: UpdateIngredientArgs): Promise<Ingredient>
{
	const { quantity } = data;

	const [updatedIngredient] = await db.update(ingredientsTable).set({ quantity }).where(eq(ingredientsTable.id, id)).returning();
	return updatedIngredient;
}
