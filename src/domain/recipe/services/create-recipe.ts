'use server';

import { recipesTable } from '@/db/schema';
import { slugify } from '@/lib/utils';
import { Recipe } from '@/domain/recipe';
import db from '@/db/client';

interface CreateRecipeArgs
{
	name: string;
	itemId: string;
	quantity: number;
	time: number;
}

export async function createRecipe({ name, itemId, quantity, time }: CreateRecipeArgs): Promise<Recipe>
{
	const baseSlug = slugify(name);
	let suffix = 0;

	while (true)
	{
		const slug = suffix === 0 ? baseSlug : `${baseSlug}-${suffix}`;

		try
		{
			const [insertedRecipe] = await db.insert(recipesTable).values({ name, slug, itemId, quantity, time }).returning();
			return insertedRecipe;
		}
		catch (error: any)
		{
			if (error.cause.code === '23505')
			{
				// Unique constraint violation—retry with next suffix
				suffix++;
				continue;
			}

			throw error;
		}
	}
}
