import type { Node } from '@xyflow/react';
import type { NodeType, NodeTypeDataMap } from '@/components/recipe-tree';

export function buildNode<T extends NodeType>(nodeId: Node['id'], type: T, data: NodeTypeDataMap[T], position: { x: number; y: number } = { x: 0, y: 0 }): Node
{
	return {
		id: nodeId,
		type: type,
		data: data,
		position: position,
	};
}
