'use server';

import { productionGraphs } from '@/db/schema';
import { ProductionGraph } from '@/domain/production-graph';
import { eq } from 'drizzle-orm';
import db from '@/db/client';

export async function deleteProductionGraph(
	id: ProductionGraph['id'],
): Promise<void>
{
	await db.delete(productionGraphs).where(eq(productionGraphs.id, id));
}
