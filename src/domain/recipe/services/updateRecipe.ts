import prisma from '@/lib/prisma';
import { Recipe, UpdateRecipeInput } from '@domain/recipe';
import { nameSchema } from '@domain/shared';

export async function updateRecipe(id: string, data: UpdateRecipeInput): Promise<Recipe>
{
	const { name, quantity, time, ingredients } = data;

	const parsedName = name ? await nameSchema.parseAsync(name) : undefined;

	return prisma.$transaction(async (tx) =>
	{
		const ingredientsToConnect = await upsertIngredients(tx, ingredients);

		const updatedRecipe = await tx.recipe.update({
			where: { id },
			data: {
				name: parsedName ?? undefined,
				quantity: quantity ?? undefined,
				time: time ?? undefined,
				ingredients: ingredientsToConnect ? { set: ingredientsToConnect.map((ingredient) => ({ id: ingredient.id })) } : undefined,
			},
			include: {
				ingredients: {
					include: {
						item: true,
					},
				},
			},
		});

		return updatedRecipe;
	});
}

async function upsertIngredients(tx: Pick<typeof prisma, 'ingredient'>, ingredients: UpdateRecipeInput['ingredients'])
{
	if (!ingredients || ingredients.length === 0) return undefined;

	const result = await Promise.all(
		ingredients.map(async (ing) =>
		{
			return tx.ingredient.upsert({
				where: {
					itemId_quantity: {
						itemId: ing.itemId,
						quantity: ing.quantity,
					},
				},
				update: {},
				create: {
					itemId: ing.itemId,
					quantity: ing.quantity,
				},
			});
		}),
	);

	return result;
}
