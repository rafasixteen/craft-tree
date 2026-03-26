'use server';

import db from '@/db/client';
import { productionGraphsTable } from '@/db/schema';

import { Graph } from '@/domain/graph';

import { eq } from 'drizzle-orm';

type UpdateGraphParams = Pick<Graph, 'id'> & Partial<Omit<Graph, 'id' | 'inventoryId'>>;

export async function updateGraph({ id, name, data }: UpdateGraphParams): Promise<Graph>
{
	const [graph] = await db
		.update(productionGraphsTable)
		.set({ name, data })
		.where(eq(productionGraphsTable.id, id))
		.returning();

	return graph;
}
