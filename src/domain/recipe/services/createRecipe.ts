import prisma from '@/lib/prisma';
import { CreateRecipeInput } from '@domain/recipe';
import { nameSchema } from '@domain/shared';

export async function createRecipe(data: CreateRecipeInput)
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
	});
}
