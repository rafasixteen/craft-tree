import { GraphNode } from '@/domain/graph-v2';
import { Node } from '@xyflow/react';

export function toGraphNodes(nodes: Node[]): GraphNode[]
{
	return nodes.map((n) => ({
		id: n.id,
		type: n.type ?? 'default',
		position: n.position,
		data: n.data,
	}));
}
