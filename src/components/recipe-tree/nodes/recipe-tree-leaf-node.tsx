import { NodeIcon, RecipeTreeNodeData } from '@/components/recipe-tree';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useRecipeTree } from '@/domain/recipe-tree';
import { Handle, Position } from '@xyflow/react';
import { PackageIcon } from 'lucide-react';
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

	const resolvedQuantity = NodeHelpers.getResolvedQuantity(recipeTree, id);

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
				<div className="flex-1">
					<p>Quantity</p>
					<div className="flex items-center gap-1">
						<PackageIcon className="size-3" />
						<span>{resolvedQuantity}x</span>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
