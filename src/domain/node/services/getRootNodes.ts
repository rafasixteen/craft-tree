import prisma from '@/lib/prisma';
import { Node } from '@domain/node';

export async function getRootNodes(): Promise<Partial<Node>[]>
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
