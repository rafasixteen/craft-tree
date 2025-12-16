import prisma from '@/lib/prisma';

export async function getNode(id: string)
{
	return prisma.node.findUnique({
		where: {
			id: id,
		},
	});
}
