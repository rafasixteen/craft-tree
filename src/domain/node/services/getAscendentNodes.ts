import prisma from '@/lib/prisma';
import { Node } from '@domain/node';

export async function getAscendentNodes(id: string): Promise<Node[]>
{
	const rows = await prisma.$queryRaw<Node[]>`
		WITH RECURSIVE ascendent_nodes AS (
			SELECT * FROM "Nodes" WHERE id = ${id}
			UNION ALL
			SELECT n.* FROM "Nodes" n
			INNER JOIN ascendent_nodes an ON n.id = an."parentId"
		)
		SELECT * FROM ascendent_nodes;
	`;

	return rows.reverse();
}
