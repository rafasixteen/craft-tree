import prisma from '@/lib/prisma';

export async function getAscendentNodes(id: string)
{
	return await prisma.$queryRaw<Node[]>`
		WITH RECURSIVE ascendent_nodes AS (
			SELECT * FROM "Nodes" WHERE id = ${id}
			UNION ALL
			SELECT n.* FROM "Nodes" n
			INNER JOIN ascendent_nodes an ON n."parentId" = an.id
		)
		SELECT * FROM ascendent_nodes;
	`;
}
