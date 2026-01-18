'use server';

import { recipesTable } from '@/db/schema';
import { Recipe } from '@/domain/recipe';
import { nameSchema, withUniqueSlugRetry } from '@/domain/shared';
import { slugify } from '@/lib/utils';
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
	const parsedName = await nameSchema.parseAsync(name);
	const baseSlug = slugify(parsedName);

	return withUniqueSlugRetry(baseSlug, async (slug) =>
	{
		const [insertedRecipe] = await db.insert(recipesTable).values({ name, slug, itemId, quantity, time }).returning();
		return insertedRecipe;
	});
}
