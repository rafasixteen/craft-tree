import { Node, Edge, Viewport } from '@xyflow/react';
import { GraphData } from '@/domain/graph-v2';
import { toGraphNodes, toGraphEdges } from '@/components/graph-v2';

export function toGraphData(nodes: Node[], edges: Edge[], viewport: Viewport): GraphData
{
	return {
		nodes: toGraphNodes(nodes),
		edges: toGraphEdges(edges),
		viewport,
	};
}
