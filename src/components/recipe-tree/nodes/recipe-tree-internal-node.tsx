import { RecipeTreeNodeData, RecipeCarousel, NodeIcon } from '@/components/recipe-tree';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { useRecipeTree } from '@/domain/recipe-tree';
import { PackageIcon, ClockIcon } from 'lucide-react';
import { Handle, Position } from '@xyflow/react';
import * as NodeHelpers from '@/domain/recipe-tree/utils/recipe-tree-node-helpers';

interface RecipeTreeNodeProps
{
	id: string;
	data: RecipeTreeNodeData;
}

export function RecipeTreeInternalNode({ id, data: { item } }: RecipeTreeNodeProps)
{
	const { recipeTree } = useRecipeTree();

	if (!recipeTree)
	{
		return null;
	}

	const node = NodeHelpers.ensureNode(recipeTree, id);
	const selectedRecipe = NodeHelpers.findSelectedRecipe(node);

	if (selectedRecipe === null)
	{
		throw new Error('Internal node must have a selected recipe');
	}

	const throughput = NodeHelpers.getNodeDemand(recipeTree, id);

	return (
		<Card className="max-w-80 min-w-40">
			<Handle type="target" position={Position.Top} />
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
			<CardContent className="flex gap-2 text-xs text-muted-foreground">
				<p>
					throughput: {throughput.amount} per {throughput.per}
				</p>
			</CardContent>
			<CardFooter>
				<RecipeCarousel nodeId={id} recipes={node.recipes} selectedRecipeIndex={NodeHelpers.findSelectedRecipeIndex(node)} />
			</CardFooter>
			<Handle type="source" position={Position.Bottom} />
		</Card>
	);
}
