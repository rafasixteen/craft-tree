'use client';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Position, Handle } from '@xyflow/react';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon, ArrowRightIcon, PackageIcon, ClockIcon } from 'lucide-react';
import { ItemIcon, RecipeTreeNodeData, useRecipeTreeContext } from '@/components/item/recipe-tree';

interface RecipeTreeNodeProps
{
	id: string;
	data: RecipeTreeNodeData;
}

export function RecipeTreeNodeComp({ id, data: { node } }: RecipeTreeNodeProps)
{
	const { tree } = useRecipeTreeContext();

	if (node.recipes.length === 0)
	{
		return <p>Node has no recipes.</p>;
	}

	const calculation = {
		totalQuantity: undefined,
		totalTime: undefined,
	};

	const selectedRecipe = node.recipes[node.getSelectedRecipeIndex()];

	return (
		<Card className="w-50">
			<Handle type="target" position={Position.Top} />

			<CardHeader className="flex items-center gap-2">
				<ItemIcon item={node.item} />

				<div className="min-w-0 flex-1">
					<p className="truncate text-sm font-semibold">{node.item.name}</p>
					<p className="truncate text-xs text-muted-foreground">{selectedRecipe.name}</p>
				</div>
			</CardHeader>
			<CardContent className="flex">
				<div className="flex-1">
					<p className="text-xs text-muted-foreground">Total</p>
					<div className="flex items-center gap-1 text-muted-foreground">
						<PackageIcon className="size-3" />
						<span>{calculation.totalQuantity}x</span>
					</div>
					<div className="flex items-center gap-1 text-muted-foreground">
						<ClockIcon className="size-3" />
						<span>{calculation.totalTime}s</span>
					</div>
				</div>
				<div className="flex-1">
					<p className="text-xs text-muted-foreground">Recipe</p>
					<div className="flex items-center gap-1 text-muted-foreground">
						<PackageIcon className="size-3" />
						<span>{selectedRecipe.quantity}x</span>
					</div>
					<div className="flex items-center gap-1 text-muted-foreground">
						<ClockIcon className="size-3" />
						<span>{selectedRecipe.time}s</span>
					</div>
				</div>
			</CardContent>
			<CardFooter className="justify-between">
				<Button variant="ghost" onClick={() => tree?.selectRecipe(id, -1)} size="icon">
					<ArrowLeftIcon />
				</Button>
				<span className="text-xs text-muted-foreground">
					{node.getSelectedRecipeIndex() + 1} / {node.recipes.length}
				</span>
				<Button variant="ghost" onClick={() => tree?.selectRecipe(id, +1)} size="icon">
					<ArrowRightIcon />
				</Button>
			</CardFooter>

			<Handle type="source" position={Position.Bottom} />
		</Card>
	);
}
