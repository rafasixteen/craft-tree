import prisma from '@/lib/prisma';

export async function deleteItem(id: string)
{
	return prisma.item.delete({
		where: {
			id: id,
		},
	});
}
