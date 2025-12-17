import prisma from '@/lib/prisma';
import { Recipe } from '@domain/recipe';

export async function getRecipeBySlug(slug: string): Promise<Recipe | null>
{
	return prisma.recipe.findUnique({
		where: {
			slug: slug,
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
