import prisma from '@/lib/prisma';

export async function getItemById(id: string)
{
	return prisma.item.findUnique({
		where: {
			id: id,
		},
	});
}
