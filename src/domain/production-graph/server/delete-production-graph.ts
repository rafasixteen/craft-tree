'use server';

import db from '@/db/client';
import { productionGraphs } from '@/db/schema';

import { ProductionGraph } from '@/domain/production-graph';

import { eq } from 'drizzle-orm';

export async function deleteProductionGraph(id: ProductionGraph['id']): Promise<void>
{
	await db.delete(productionGraphs).where(eq(productionGraphs.id, id));
}
