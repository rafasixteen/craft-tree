import prisma from '@/lib/prisma';

export async function getRecipeBySlug(slug: string)
{
	return prisma.recipe.findUnique({
		where: {
			slug: slug,
		},
	});
}
