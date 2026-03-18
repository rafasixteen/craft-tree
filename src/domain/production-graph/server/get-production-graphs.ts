'use server';

import db from '@/db/client';
import { productionGraphsTable } from '@/db/schema';

import { Inventory } from '@/domain/inventory';
import { ProductionGraph } from '@/domain/production-graph';

import { eq } from 'drizzle-orm';

interface GetProductionGraphsParams
{
	inventoryId: Inventory['id'];
}

export async function getProductionGraphs({ inventoryId }: GetProductionGraphsParams): Promise<ProductionGraph[]>
{
	return await db.select().from(productionGraphsTable).where(eq(productionGraphsTable.inventoryId, inventoryId));
}
