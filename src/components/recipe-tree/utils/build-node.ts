import type { Node } from '@xyflow/react';
import type { RecipeTreeNodeType } from '@/components/recipe-tree';

interface BuildNodeParams
{
	nodeId: Node['id'];
	type: RecipeTreeNodeType;
	position?: { x: number; y: number };
}

export function buildNode({ nodeId, type, position }: BuildNodeParams): Node
{
	return {
		id: nodeId,
		type: type,
		data: {},
		position: position ?? { x: 0, y: 0 },
	};
}
