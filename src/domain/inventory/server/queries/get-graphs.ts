'use server';

import db from '@/db/client';
import { productionGraphsTable } from '@/db/schema';

import { Inventory } from '@/domain/inventory';
import { Graph } from '@/domain/graph';

import { eq } from 'drizzle-orm';

interface GetGraphsParams
{
	inventoryId: Inventory['id'];
}

export async function getGraphs({ inventoryId }: GetGraphsParams): Promise<Graph[]>
{
	return await db.select().from(productionGraphsTable).where(eq(productionGraphsTable.inventoryId, inventoryId));
}
