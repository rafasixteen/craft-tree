import { ProcessedMaterialNodeData, RecipeCarousel, NodeIcon } from '@/components/recipe-tree';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { useNodeDemand, useProducerCount, useRecipeTree, useSelectedRecipeThroughput } from '@/domain/recipe-tree';
import { PackageIcon, ClockIcon } from 'lucide-react';
import { Handle, Position } from '@xyflow/react';
import { Separator } from '@/components/ui/separator';
import { FactoryIcon } from 'lucide-react';
import { pluralize } from '@/lib/pluralizer';
import { formatNumber } from '@/lib/utils';
import * as NodeHelpers from '@/domain/recipe-tree/utils/recipe-tree-node-helpers';

interface RecipeTreeNodeProps
{
	id: string;
	data: ProcessedMaterialNodeData;
}

export function ProcessedMaterialNode({ id, data: { item } }: RecipeTreeNodeProps)
{
	const { recipeTree } = useRecipeTree();

	const demand = useNodeDemand(id);
	const producerCount = Math.ceil(useProducerCount(id));
	const recipeThroughput = useSelectedRecipeThroughput(id);

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

	return (
		<Card className="w-65">
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
				<Card className="w-full border-none bg-muted/40 p-0 shadow-none">
					<CardContent className="flex flex-col gap-2 p-3 text-xs text-muted-foreground">
						<div className="flex items-center gap-2">
							<PackageIcon className="size-4 text-primary" />
							<span className="font-medium">Demand</span>
							<span className="ml-auto font-mono">
								{formatNumber(demand.amount)} / {demand.per}
							</span>
						</div>
						<Separator className="my-1" />
						<div className="flex items-center gap-2">
							<ClockIcon className="size-4 text-primary" />
							<span className="font-medium">Per Producer</span>
							<span className="ml-auto font-mono">
								{formatNumber(recipeThroughput.amount)} / {recipeThroughput.per}
							</span>
						</div>
						<Separator className="my-1" />
						<div className="flex items-center gap-2">
							<FactoryIcon className="size-4 text-primary" />
							<span className="text-xs">
								{producerCount}x {pluralize(selectedRecipe!.name, producerCount!)}
							</span>
						</div>
					</CardContent>
				</Card>
			</CardContent>
			<CardFooter>
				<RecipeCarousel nodeId={id} recipes={node.recipes} selectedRecipeIndex={NodeHelpers.findSelectedRecipeIndex(node)} />
			</CardFooter>
			<Handle type="source" position={Position.Bottom} />
		</Card>
	);
}
