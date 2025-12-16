import prisma from '@/lib/prisma';

export async function getItemBySlug(slug: string)
{
	return prisma.item.findUnique({
		where: {
			slug: slug,
		},
	});
}
