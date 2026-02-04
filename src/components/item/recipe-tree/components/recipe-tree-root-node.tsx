'use client';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Position, Handle } from '@xyflow/react';
import { PackageIcon, ClockIcon } from 'lucide-react';
import { ItemIcon, RecipeCarousel, RecipeTreeNodeData, useRecipeTreeContext } from '@/components/item/recipe-tree';

interface RecipeTreeNodeProps
{
	id: string;
	data: RecipeTreeNodeData;
}

export function RecipeTreeRootNode({ id, data: { node } }: RecipeTreeNodeProps)
{
	const { tree } = useRecipeTreeContext();

	const calculation = {
		totalQuantity: tree!.getTotalQuantity(node),
		totalTime: tree!.getTotalTime(node),
	};

	const selectedRecipe = node.recipes[node.getSelectedRecipeIndex()];

	return (
		<Card className="w-52">
			<CardHeader className="flex items-center gap-2">
				<ItemIcon itemName={node.item.name} />
				<div className="min-w-0 flex-1">
					<p className="truncate text-sm font-semibold">{node.item.name}</p>
					<p className="truncate text-xs text-muted-foreground">{selectedRecipe.name}</p>
				</div>
			</CardHeader>
			<CardContent className="grid grid-cols-2 gap-3 text-xs">
				<div className="min-w-0 space-y-1">
					<div className="flex items-center gap-1 text-muted-foreground">
						<span className="font-medium">Total</span>
					</div>
					<div className="flex items-center gap-1 text-muted-foreground">
						<PackageIcon className="size-3" />
						<span className="truncate">{calculation.totalQuantity}x</span>
					</div>
					<div className="flex items-center gap-1 text-muted-foreground">
						<ClockIcon className="size-3" />
						<span className="truncate">{calculation.totalTime}s</span>
					</div>
				</div>
				<div className="min-w-0 space-y-1">
					<div className="flex items-center gap-1 text-muted-foreground">
						<span className="font-medium">Recipe</span>
					</div>
					<div className="flex items-center gap-1 text-muted-foreground">
						<PackageIcon className="size-3" />
						<span className="truncate">{selectedRecipe.quantity}x</span>
					</div>
					<div className="flex items-center gap-1 text-muted-foreground">
						<ClockIcon className="size-3" />
						<span className="truncate">{selectedRecipe.time}s</span>
					</div>
				</div>
			</CardContent>
			<CardFooter className="justify-between">
				<RecipeCarousel nodeId={id} recipes={node.recipes} selectedRecipeIndex={node.getSelectedRecipeIndex()} />
			</CardFooter>

			<Handle type="source" position={Position.Bottom} />
		</Card>
	);
}
