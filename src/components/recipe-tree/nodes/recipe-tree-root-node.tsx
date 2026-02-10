import { RecipeTreeNodeData, RecipeCarousel, NodeIcon, ProductionRateControl } from '@/components/recipe-tree';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Handle, Position } from '@xyflow/react';
import { useRecipeTree } from '@/domain/recipe-tree';
import * as NodeHelpers from '@/domain/recipe-tree/utils/recipe-tree-node-helpers';
import { ClockIcon, PackageIcon } from 'lucide-react';

interface RecipeTreeRootNodeProps
{
	id: string;
	data: RecipeTreeNodeData;
}

export function RecipeTreeRootNode({ id, data: { item } }: RecipeTreeRootNodeProps)
{
	const { recipeTree, setRate } = useRecipeTree();

	if (!recipeTree)
	{
		return null;
	}

	const node = NodeHelpers.ensureNode(recipeTree, id);
	const selectedRecipe = NodeHelpers.findSelectedRecipe(node);

	if (selectedRecipe)
	{
		return (
			<Card className="max-w-80 min-w-40">
				<CardHeader className="flex items-center gap-2">
					<NodeIcon itemName={item.name} />
					<div className="min-w-0">
						<p className="text-sm font-semibold">{item.name}</p>
						<p className="truncate text-xs text-muted-foreground">{selectedRecipe.name}</p>
					</div>
					<div className="ml-auto flex flex-col items-end gap-1 text-xs text-muted-foreground">
						<div className="flex items-center gap-1">
							<PackageIcon className="size-3" />
							<span>{selectedRecipe.quantity}x</span>
						</div>
						<div className="flex items-center gap-1">
							<ClockIcon className="size-3" />
							<span>{selectedRecipe.time}s</span>
						</div>
					</div>
				</CardHeader>
				<CardContent className="text-xs text-muted-foreground">
					<ProductionRateControl rate={recipeTree.rate} onChange={setRate} className="nopan" />
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
