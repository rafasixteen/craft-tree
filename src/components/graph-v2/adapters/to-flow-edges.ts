import { Edge } from '@xyflow/react';
import { GraphEdge } from '@/domain/graph-v2';

export function toFlowEdges(edges: GraphEdge[]): Edge[]
{
	return edges.map((edge) => ({
		id: edge.id,
		type: edge.type,
		source: edge.source,
		sourceHandle: edge.sourceHandle,
		target: edge.target,
		targetHandle: edge.targetHandle,
		data: edge.data,
	}));
}
