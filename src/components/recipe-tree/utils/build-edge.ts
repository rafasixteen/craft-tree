import type { Edge, Node } from '@xyflow/react';

export function buildEdge(parentId: Node['id'], childId: Node['id']): Edge
{
	return {
		id: `edge_${parentId}_${childId}`,
		source: parentId,
		target: childId,
	};
}
