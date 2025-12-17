import prisma from '@/lib/prisma';
import { CreateRecipeInput, Recipe } from '@domain/recipe';
import { nameSchema } from '@domain/shared';

export async function createRecipe(data: CreateRecipeInput): Promise<Recipe>
{
	const { name, itemId } = data;

	const parsedName = await nameSchema.parseAsync(name);

	return prisma.recipe.create({
		data: {
			name: parsedName,
			item: { connect: { id: itemId } },
			quantity: 0,
			time: 0,
		},
		include: {
			ingredients: {
				include: {
					item: true,
				},
			},
		},
	});
}
