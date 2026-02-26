import type { Node } from '@xyflow/react';
import type { RecipeTreeNodeType, RecipeTreeNodeTypeDataMap } from '@/components/recipe-tree-v2';

interface BuildNodeParams<T extends RecipeTreeNodeType>
{
	nodeId: Node['id'];
	type: T;
	data: RecipeTreeNodeTypeDataMap[T];
	position?: { x: number; y: number };
}

export function buildNode<T extends RecipeTreeNodeType>({ nodeId, type, data, position }: BuildNodeParams<T>): Node
{
	return {
		id: nodeId,
		type: type,
		data: data,
		position: position ?? { x: 0, y: 0 },
	};
}
