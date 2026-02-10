import { NodeIcon, NodeStats, RecipeTreeNodeData } from '@/components/recipe-tree';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Handle, Position } from '@xyflow/react';

interface RecipeTreeLeafNodeProps
{
	id: string;
	data: RecipeTreeNodeData;
}

export function RecipeTreeLeafNode({ id, data: { item } }: RecipeTreeLeafNodeProps)
{
	return (
		<Card className="max-w-80 min-w-50">
			<Handle type="target" position={Position.Top} />
			<CardHeader className="flex items-center gap-2">
				<NodeIcon itemName={item.name} />
				<div>
					<p className="text-sm font-semibold">{item.name}</p>
				</div>
			</CardHeader>
			<CardContent className="flex gap-2 text-xs text-muted-foreground">
				<NodeStats nodeId={id} />
			</CardContent>
		</Card>
	);
}
