import { Node } from '@xyflow/react';
import { RecipeTreeNodeData, RecipeTreeNodeType } from '@/components/item/recipe-tree/types';

interface BuildNodeParams
{
	nodeId: string;
	data: RecipeTreeNodeData;
}

export function buildNode(params: BuildNodeParams): Node<RecipeTreeNodeData>
{
	const { nodeId, data } = params;

	return {
		id: nodeId,
		type: RecipeTreeNodeType.NODE,
		data: data,
		position: { x: 0, y: 0 },
	};
}
