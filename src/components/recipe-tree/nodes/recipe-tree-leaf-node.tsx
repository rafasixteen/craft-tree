import { RecipeTreeNodeData } from '@/components/recipe-tree';
import { Card } from '@/components/ui/card';
import { Handle, Position } from '@xyflow/react';

interface RecipeTreeLeafNodeProps
{
	id: string;
	data: RecipeTreeNodeData;
}

export function RecipeTreeLeafNode({ id, data }: RecipeTreeLeafNodeProps)
{
	const { item } = data;

	return (
		<Card>
			<Handle type="target" position={Position.Top} />
			<p>Leaf Node {item.name}</p>
		</Card>
	);
}
