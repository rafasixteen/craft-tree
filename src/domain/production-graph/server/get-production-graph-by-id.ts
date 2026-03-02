'use server';

import { productionGraphs } from '@/db/schema';
import { ProductionGraph } from '@/domain/production-graph';
import { eq } from 'drizzle-orm';
import db from '@/db/client';

export async function getProductionGraphById(id: ProductionGraph['id']): Promise<ProductionGraph>
{
	const [productionGraph] = await db.select().from(productionGraphs).where(eq(productionGraphs.id, id));
	return productionGraph;
}
