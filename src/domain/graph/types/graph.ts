import { Viewport } from '@xyflow/react';
import { GraphEdge, GraphNode } from '@/components';
import { productionGraphsTable } from '@/db/schema/graphs';

// TODO: Use zod schema instead of infer from table.

export interface GraphData
{
	nodes: GraphNode[];
	edges: GraphEdge[];
	viewport: Viewport;
}

export type Graph = typeof productionGraphsTable.$inferSelect;
