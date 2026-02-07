import { RecipeTreeNodeData } from '@/components/recipe-tree';
import { Card } from '@/components/ui/card';
import { Handle, Position } from '@xyflow/react';

interface RecipeTreeNodeProps
{
	id: string;
	data: RecipeTreeNodeData;
}

export function RecipeTreeInternalNode({ id, data }: RecipeTreeNodeProps)
{
	const { item } = data;

	return (
		<Card size="sm" className="p-2">
			<Handle type="target" position={Position.Top} />
			<p>Node {item.name}</p>
			<Handle type="source" position={Position.Bottom} />
		</Card>
	);
}
