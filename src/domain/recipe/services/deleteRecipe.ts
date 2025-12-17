import prisma from '@/lib/prisma';
import { Recipe } from '@domain/recipe';

export async function deleteRecipe(id: string): Promise<Recipe>
{
	return prisma.recipe.delete({
		where: {
			id: id,
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
