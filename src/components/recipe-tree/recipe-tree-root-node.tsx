import { RecipeTreeNodeData } from '@/components/recipe-tree';
import { Card } from '@/components/ui/card';
import { Handle, Position } from '@xyflow/react';

interface RecipeTreeRootNodeProps
{
	id: string;
	data: RecipeTreeNodeData;
}

export function RecipeTreeRootNode({ id, data }: RecipeTreeRootNodeProps)
{
	const { item } = data;

	return (
		<Card size="sm" className="p-2">
			<p>Root Node {item.name}</p>
			<Handle type="source" position={Position.Bottom} />
		</Card>
	);
}
