import { ProductionGraphEdge, ProductionGraphNode } from '@/components';
import { Viewport } from '@xyflow/react';

export interface ProductionGraphData
{
	nodes: ProductionGraphNode[];
	edges: ProductionGraphEdge[];
	viewport: Viewport;
}
