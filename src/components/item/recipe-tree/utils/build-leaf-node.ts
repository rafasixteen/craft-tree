import { Node } from '@xyflow/react';
import { RecipeTreeLeafNodeData, RecipeTreeNodeType } from '@/components/item/recipe-tree';

interface BuildLeafNodeParams
{
	nodeId: string;
	data: RecipeTreeLeafNodeData;
}

export function buildLeafNode(params: BuildLeafNodeParams): Node<RecipeTreeLeafNodeData>
{
	const { nodeId, data } = params;

	return {
		id: nodeId,
		type: RecipeTreeNodeType.LEAF,
		data: data,
		position: { x: 0, y: 0 },
	};
}
