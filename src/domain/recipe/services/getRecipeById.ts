import prisma from '@/lib/prisma';

export async function getRecipeById(id: string)
{
	return prisma.recipe.findUnique({
		where: {
			id: id,
		},
	});
}
