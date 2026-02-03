import { Node } from '@xyflow/react';
import { RecipeTreeNodeData, RecipeTreeNodeType } from '@/components/item/recipe-tree/types';

interface BuildNodeParams
{
	nodeId: string;
	nodeType: RecipeTreeNodeType;
	data: RecipeTreeNodeData;
}

export function buildNode(params: BuildNodeParams): Node<RecipeTreeNodeData>
{
	const { nodeId, nodeType, data } = params;

	return {
		id: nodeId,
		type: nodeType,
		data: data,
		position: { x: 0, y: 0 },
	};
}
