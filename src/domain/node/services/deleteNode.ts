import prisma from '@/lib/prisma';

export async function deleteNode(id: string)
{
	return prisma.node.delete({
		where: {
			id: id,
		},
	});
}
