import prisma from '@/lib/prisma';

export async function deleteRecipe(id: string)
{
	return prisma.recipe.delete({
		where: {
			id: id,
		},
	});
}
