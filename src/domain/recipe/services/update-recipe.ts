'use server';

import { recipesTable, ingredientsTable } from '@/db/schema';
import { Recipe } from '@/domain/recipe';
import { slugify } from '@/lib/utils';
import { nameSchema, withUniqueSlugRetry } from '@/domain/shared';
import { eq } from 'drizzle-orm';
import db from '@/db/client';

interface IngredientInput
{
	itemId: string;
	quantity: number;
}

interface UpdateRecipeArgs
{
	id: string;
	data: Partial<{
		name: string;
		quantity: number;
		time: number;
		ingredients: IngredientInput[];
	}>;
}

export async function updateRecipe({ id, data }: UpdateRecipeArgs): Promise<Recipe>
{
	const { name, quantity, time, ingredients } = data;

	const parsedName = await nameSchema.parseAsync(name);
	const baseSlug = slugify(parsedName);

	return withUniqueSlugRetry(baseSlug, async (slug) =>
	{
		return await db.transaction(async (tx) =>
		{
			// Update the recipe
			const [updatedRecipe] = await tx.update(recipesTable).set({ name: parsedName, slug, quantity, time }).where(eq(recipesTable.id, id)).returning();

			// Update ingredients if provided
			if (ingredients && ingredients.length > 0)
			{
				// Delete existing ingredients
				await tx.delete(ingredientsTable).where(eq(ingredientsTable.recipeId, id));

				// Insert new ingredients
				for (const ingredient of ingredients)
				{
					await tx.insert(ingredientsTable).values({
						itemId: ingredient.itemId,
						quantity: ingredient.quantity,
						recipeId: id,
					});
				}
			}

			return updatedRecipe;
		});
	});
}
