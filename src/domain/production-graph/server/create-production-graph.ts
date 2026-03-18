'use server';

import db from '@/db/client';
import { productionGraphsTable } from '@/db/schema';

import { ProductionGraph } from '@/domain/production-graph';

type CreateProductionGraphParams = Omit<ProductionGraph, 'id' | 'data'>;

export async function createProductionGraph({
	name,
	inventoryId,
}: CreateProductionGraphParams): Promise<ProductionGraph>
{
	const [productionGraph] = await db.insert(productionGraphsTable).values({ name, inventoryId }).returning();
	return productionGraph;
}
