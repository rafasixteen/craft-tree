import prisma from '@/lib/prisma';

export async function getRootNodes()
{
	return prisma.node.findMany({
		where: {
			parentId: null,
		},
		orderBy: {
			order: 'asc',
		},
	});
}
