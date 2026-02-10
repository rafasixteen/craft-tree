import { NodeIcon, RecipeTreeNodeData } from '@/components/recipe-tree';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useRecipeTree } from '@/domain/recipe-tree';
import { Handle, Position } from '@xyflow/react';
import * as NodeHelpers from '@/domain/recipe-tree/utils/recipe-tree-node-helpers';

interface RecipeTreeLeafNodeProps
{
	id: string;
	data: RecipeTreeNodeData;
}

export function RecipeTreeLeafNode({ id, data: { item } }: RecipeTreeLeafNodeProps)
{
	const { recipeTree } = useRecipeTree();

	if (!recipeTree)
	{
		return null;
	}

	const throughput = NodeHelpers.getNodeDemand(recipeTree, id);

	return (
		<Card className="max-w-80 min-w-40">
			<Handle type="target" position={Position.Top} />
			<CardHeader className="flex items-center gap-2">
				<NodeIcon itemName={item.name} />
				<div>
					<p className="text-sm font-semibold">{item.name}</p>
				</div>
			</CardHeader>
			<CardContent className="flex gap-2 text-xs text-muted-foreground">
				<p>
					throughput: {throughput.amount} per {throughput.per}
				</p>
			</CardContent>
		</Card>
	);
}
