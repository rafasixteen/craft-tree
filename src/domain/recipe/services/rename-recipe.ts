'use server';

import { recipesTable } from '@/db/schema';
import { Recipe } from '@/domain/recipe';
import { slugify } from '@/lib/utils';
import { nameSchema, withUniqueSlugRetry } from '@/domain/shared';
import { eq } from 'drizzle-orm';
import db from '@/db/client';

interface RenameRecipeArgs
{
	recipeId: string;
	newName: string;
}

export async function renameRecipe({ recipeId, newName }: RenameRecipeArgs): Promise<Recipe>
{
	const parsedName = await nameSchema.parseAsync(newName);
	const baseSlug = slugify(parsedName);

	return withUniqueSlugRetry(baseSlug, async (slug) =>
	{
		const [updated] = await db.update(recipesTable).set({ name: parsedName, slug }).where(eq(recipesTable.id, recipeId)).returning();
		return updated;
	});
}
