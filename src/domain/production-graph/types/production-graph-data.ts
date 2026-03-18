import { Viewport } from '@xyflow/react';

import { ProductionGraphEdge, ProductionGraphNode } from '@/components';

export interface ProductionGraphData
{
	nodes: ProductionGraphNode[];
	edges: ProductionGraphEdge[];
	viewport: Viewport;
}
