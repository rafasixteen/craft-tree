import { Node, Edge } from '@xyflow/react';
import { GraphData } from '@/domain/graph-v2';
import { toGraphNodes, toGraphEdges } from '@/components/graph-v2';

export function toGraphData(nodes: Node[], edges: Edge[]): GraphData
{
	return {
		nodes: toGraphNodes(nodes),
		edges: toGraphEdges(edges),
	};
}
