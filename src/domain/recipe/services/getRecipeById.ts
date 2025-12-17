import prisma from '@/lib/prisma';
import { Recipe } from '@domain/recipe';

export async function getRecipeById(id: string): Promise<Recipe | null>
{
	return prisma.recipe.findUnique({
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
