'use server';

import db from '@/db/client';
import { productionGraphsTable } from '@/db/schema';

import { ProductionGraph } from '@/domain/production-graph';

import { eq } from 'drizzle-orm';

export async function getProductionGraphById(id: ProductionGraph['id']): Promise<ProductionGraph>
{
	const [productionGraph] = await db.select().from(productionGraphsTable).where(eq(productionGraphsTable.id, id));
	return productionGraph;
}
