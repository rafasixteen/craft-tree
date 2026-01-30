'use server';

import { recipesTable } from '@/db/schema';
import { Recipe } from '@/domain/recipe';
import { nameSchema, withUniqueSlugRetry } from '@/domain/shared';
import { slugify } from '@/lib/utils';
import { eq, sql } from 'drizzle-orm';
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
	const [parsedName, order] = await Promise.all([nameSchema.parseAsync(name), getNextRecipeOrder(itemId)]);

	const baseSlug = slugify(parsedName);

	return withUniqueSlugRetry(baseSlug, async (slug) =>
	{
		const [insertedRecipe] = await db.insert(recipesTable).values({ name, slug, itemId, order, quantity, time }).returning();
		return insertedRecipe;
	});
}

async function getNextRecipeOrder(itemId: string): Promise<number>
{
	const [row] = await db
		.select({ max: sql<number>`coalesce(max(${recipesTable.order}), 0)` })
		.from(recipesTable)
		.where(eq(recipesTable.itemId, itemId));

	return row.max + 1;
}
