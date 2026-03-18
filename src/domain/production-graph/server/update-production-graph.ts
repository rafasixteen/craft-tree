'use server';

import db from '@/db/client';
import { productionGraphsTable } from '@/db/schema';

import { ProductionGraph } from '@/domain/production-graph';

import { eq } from 'drizzle-orm';

type UpdateProductionGraphParams = Pick<ProductionGraph, 'id'> & Partial<Omit<ProductionGraph, 'id' | 'inventoryId'>>;

export async function updateProductionGraph({ id, name, data }: UpdateProductionGraphParams): Promise<ProductionGraph>
{
	const [productionGraph] = await db
		.update(productionGraphsTable)
		.set({ name, data })
		.where(eq(productionGraphsTable.id, id))
		.returning();
	return productionGraph;
}
