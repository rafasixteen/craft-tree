import prisma from '@/lib/prisma';
import { Node } from '@domain/node';

export async function deleteNode(id: string): Promise<Partial<Node>>
{
	return prisma.node.delete({
		where: {
			id: id,
		},
	});
}
