import { NodeIcon, RecipeTreeNodeData } from '@/components/recipe-tree';
import { Card, CardHeader } from '@/components/ui/card';
import { Handle, Position } from '@xyflow/react';

interface RecipeTreeLeafNodeProps
{
	id: string;
	data: RecipeTreeNodeData;
}

export function RecipeTreeLeafNode({ data }: RecipeTreeLeafNodeProps)
{
	const { item } = data;

	return (
		<Card>
			<Handle type="target" position={Position.Top} />
			<CardHeader className="flex items-center gap-2">
				<NodeIcon itemName={item.name} />
				<div className="min-w-0">
					<p className="truncate text-sm font-semibold">{item.name}</p>
				</div>
			</CardHeader>
		</Card>
	);
}
