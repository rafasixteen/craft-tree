import prisma from '@/lib/prisma';
import { Node } from '@domain/node';

export async function getDescendantNodes(id: string): Promise<Node[]>
{
	return await prisma.$queryRaw<Node[]>`
		WITH RECURSIVE descendant_nodes AS (
			SELECT * FROM "Nodes" WHERE id = ${id}
			UNION ALL
			SELECT n.* FROM "Nodes" n
			INNER JOIN descendant_nodes dn ON n."parentId" = dn.id
		)
		SELECT * FROM descendant_nodes;
	`;
}
