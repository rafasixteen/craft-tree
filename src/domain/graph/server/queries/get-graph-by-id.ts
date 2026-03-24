'use server';

import db from '@/db/client';
import { productionGraphsTable } from '@/db/schema';

import { Graph } from '@/domain/graph';

import { eq } from 'drizzle-orm';

interface GetGraphByIdParams
{
	graphId: Graph['id'];
}

export async function getGraphById({ graphId }: GetGraphByIdParams): Promise<Graph>
{
	const [graph] = await db.select().from(productionGraphsTable).where(eq(productionGraphsTable.id, graphId));
	return graph;
}
