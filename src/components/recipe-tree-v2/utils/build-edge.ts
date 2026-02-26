import type { Edge, Node } from '@xyflow/react';

interface BuildEdgeParams
{
	parentId: Node['id'];
	childId: Node['id'];
}

export function buildEdge({ parentId, childId }: BuildEdgeParams): Edge
{
	return {
		id: `edge_${parentId}_${childId}`,
		source: parentId,
		target: childId,
	};
}
