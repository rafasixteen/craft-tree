import { Node } from '@xyflow/react';
import { GraphNode } from '@/domain/graph-v2';

export function toFlowNodes(nodes: GraphNode[]): Node[]
{
	return nodes.map((node) => ({
		id: node.id,
		type: node.type,
		position: node.position,
		data: node.data,
	}));
}
