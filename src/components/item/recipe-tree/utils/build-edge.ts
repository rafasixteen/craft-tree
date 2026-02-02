import { Edge } from '@xyflow/react';

export function buildEdge(parentNodeId: string, childNodeId: string): Edge
{
	return {
		id: `edge_${parentNodeId}_${childNodeId}`,
		source: parentNodeId,
		target: childNodeId,
	};
}
