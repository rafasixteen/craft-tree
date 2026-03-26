import { GraphEdge } from '@/domain/graph-v2';
import { Edge } from '@xyflow/react';

export function toGraphEdges(edges: Edge[]): GraphEdge[]
{
	return edges.map((e) => ({
		id: e.id,
		type: e.type ?? 'default',
		source: e.source,
		sourceHandle: e.sourceHandle ?? '',
		target: e.target,
		targetHandle: e.targetHandle ?? '',
		data: e.data,
	}));
}
