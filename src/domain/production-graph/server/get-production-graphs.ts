'use server';

import { productionGraphs } from '@/db/schema';
import { Inventory } from '@/domain/inventory';
import { ProductionGraph } from '@/domain/production-graph';
import { eq } from 'drizzle-orm';
import db from '@/db/client';

interface GetProductionGraphsParams
{
	inventoryId: Inventory['id'];
}

export async function getProductionGraphs({ inventoryId }: GetProductionGraphsParams): Promise<ProductionGraph[]>
{
	return await db.select().from(productionGraphs).where(eq(productionGraphs.inventoryId, inventoryId));
}
