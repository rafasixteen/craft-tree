import { RecipeTreeNodeData, RecipeCarousel, NodeIcon, NodeStats, ProductionRateControl } from '@/components/recipe-tree';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Handle, Position } from '@xyflow/react';
import { useRecipeTree, useProductionRate } from '@/domain/recipe-tree';
import * as NodeHelpers from '@/domain/recipe-tree/utils/recipe-tree-node-helpers';

interface RecipeTreeRootNodeProps
{
	id: string;
	data: RecipeTreeNodeData;
}

export function RecipeTreeRootNode({ id, data: { item } }: RecipeTreeRootNodeProps)
{
	const { recipeTree } = useRecipeTree();

	const { rate, setRate } = useProductionRate({ amount: 1, per: 'second' });

	if (!recipeTree)
	{
		return null;
	}

	const node = NodeHelpers.ensureNode(recipeTree, id);
	const selectedRecipe = NodeHelpers.findSelectedRecipe(node);

	if (selectedRecipe)
	{
		const resolvedQuantity = NodeHelpers.getResolvedQuantity(recipeTree, id);
		const nodeTime = NodeHelpers.getNodeTime(recipeTree, id);

		return (
			<Card className="max-w-80 min-w-40">
				<CardHeader className="flex items-center gap-2">
					<NodeIcon itemName={item.name} />
					<div className="min-w-0">
						<p className="text-sm font-semibold">{item.name}</p>
						<p className="truncate text-xs text-muted-foreground">{selectedRecipe.name}</p>
					</div>
				</CardHeader>
				<CardContent className="space-y-2 text-xs text-muted-foreground">
					<div className="flex gap-2">
						<NodeStats title="Recipe" quantity={selectedRecipe.quantity} time={selectedRecipe.time} />
						<NodeStats title="Total" quantity={resolvedQuantity} time={nodeTime} />
					</div>
					<ProductionRateControl rate={rate} onChange={setRate} className="nopan" />
				</CardContent>
				<CardFooter>
					<RecipeCarousel nodeId={id} recipes={node.recipes} selectedRecipeIndex={NodeHelpers.findSelectedRecipeIndex(node)} />
				</CardFooter>
				<Handle type="source" position={Position.Bottom} />
			</Card>
		);
	}
	else
	{
		return (
			<Card className="max-w-80 min-w-40">
				<CardHeader className="flex items-center gap-2">
					<NodeIcon itemName={item.name} />
					<div className="min-w-0">
						<p className="text-sm font-semibold">{item.name}</p>
						<p className="truncate text-xs text-muted-foreground">No recipes</p>
					</div>
				</CardHeader>
			</Card>
		);
	}
}
