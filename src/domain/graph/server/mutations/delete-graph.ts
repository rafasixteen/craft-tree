'use server';

import db from '@/db/client';
import { productionGraphsTable } from '@/db/schema';

import { Graph } from '@/domain/graph';

import { eq } from 'drizzle-orm';

interface DeleteGraphParams
{
	graphId: Graph['id'];
}

export async function deleteGraph({ graphId }: DeleteGraphParams): Promise<void>
{
	await db.delete(productionGraphsTable).where(eq(productionGraphsTable.id, graphId));
}
