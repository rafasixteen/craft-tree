'use client';

import { Card, CardFooter, CardHeader } from '@/components/ui/card';
import { Position, Handle, useUpdateNodeInternals } from '@xyflow/react';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon, ArrowRightIcon, PackageIcon, ClockIcon } from 'lucide-react';
import { ItemIcon, RecipeTreeNodeData, useRecipeTreeContext } from '@/components/item/recipe-tree';

interface RecipeTreeNodeProps
{
	id: string;
	data: RecipeTreeNodeData;
}

export function RecipeTreeNode({ id, data }: RecipeTreeNodeProps)
{
	const { itemId } = data;

	const { rootItem, getItem, getRecipes, getSelectedRecipeIndex, selectRecipe, calculateRecipe } = useRecipeTreeContext();

	const updateNodeInternals = useUpdateNodeInternals();

	useEffect(() =>
	{
		updateNodeInternals(id);
	}, [id, updateNodeInternals]);

	const item = getItem(itemId)!;
	const recipes = getRecipes(itemId);

	const selectedRecipeIndex = getSelectedRecipeIndex(id);
	const selectedRecipe = recipes[selectedRecipeIndex];

	const calculation = calculateRecipe(id, itemId);

	const isRoot = rootItem.id === item.id;

	return (
		<Card className="w-50">
			{!isRoot && <Handle type="target" position={Position.Top} />}

			<CardHeader className="flex items-center gap-2">
				<ItemIcon item={item} />

				<div className="flex-2">
					<p className="text-sm font-semibold">{item.name}</p>
					<p className="text-xs text-muted-foreground">{selectedRecipe.name}</p>
				</div>

				<div className="flex-1">
					<div className="flex items-center gap-1 text-muted-foreground">
						<PackageIcon className="size-3" />
						<span>{calculation.totalQuantity}x</span>
					</div>
					<div className="flex items-center gap-1 text-muted-foreground">
						<ClockIcon className="size-3" />
						<span>{calculation.totalTime}s</span>
					</div>
				</div>
			</CardHeader>

			<CardFooter className="justify-between">
				<Button variant="ghost" onClick={() => selectRecipe(id, item.id, -1)} size="icon">
					<ArrowLeftIcon />
				</Button>
				<span className="text-xs text-muted-foreground">
					{selectedRecipeIndex + 1} / {recipes.length}
				</span>
				<Button variant="ghost" onClick={() => selectRecipe(id, item.id, +1)} size="icon">
					<ArrowRightIcon />
				</Button>
			</CardFooter>

			<Handle type="source" position={Position.Bottom} />
		</Card>
	);
}
