'use server';

import db from '@/db/client';
import { productionGraphs } from '@/db/schema';

import { ProductionGraph } from '@/domain/production-graph';

import { eq } from 'drizzle-orm';

type UpdateProductionGraphParams = Pick<ProductionGraph, 'id'> & Partial<Omit<ProductionGraph, 'id' | 'inventoryId'>>;

export async function updateProductionGraph({ id, name, data }: UpdateProductionGraphParams): Promise<ProductionGraph>
{
	const [productionGraph] = await db
		.update(productionGraphs)
		.set({ name, data })
		.where(eq(productionGraphs.id, id))
		.returning();
	return productionGraph;
}
