'use server';

import db from '@/db/client';
import { productionGraphsTable } from '@/db/schema';

import { Graph } from '@/domain/graph';

type CreateGraphParams = Omit<Graph, 'id' | 'data'>;

export async function createGraph({ name, inventoryId }: CreateGraphParams): Promise<Graph>
{
	const [graph] = await db.insert(productionGraphsTable).values({ name, inventoryId }).returning();
	return graph;
}
