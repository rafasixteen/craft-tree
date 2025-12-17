import prisma from '@/lib/prisma';
import { Node } from '@domain/node';

export async function getNode(id: string): Promise<Partial<Node> | null>
{
	return prisma.node.findUnique({
		where: {
			id: id,
		},
	});
}
