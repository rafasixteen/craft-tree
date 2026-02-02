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
	// const { item, recipes, ingredientsMap, isRoot, selectedRecipeIndex } = data;

	const { itemId } = data;

	const { loading, item: rootItem, itemsById, recipesByItemId, getSelectedRecipeIndex, setSelectedRecipeIndex } = useRecipeTreeContext();

	const updateNodeInternals = useUpdateNodeInternals();

	if (loading)
	{
		return null;
	}

	const selectedRecipeIndex = getSelectedRecipeIndex(id);
	const item = itemsById.get(itemId)!;
	const recipes = recipesByItemId.get(itemId) || [];
	const selectedRecipe = recipes[selectedRecipeIndex];
	const isRoot = rootItem?.id === item.id;

	useEffect(() =>
	{
		updateNodeInternals(id);
	}, [id, updateNodeInternals]);

	function previousRecipe()
	{
		if (recipes.length > 0)
		{
			const prevIndex = (selectedRecipeIndex - 1 + recipes.length) % recipes.length;
			setSelectedRecipeIndex(id, prevIndex);
		}
	}

	function nextRecipe()
	{
		if (recipes.length > 0)
		{
			const nextIndex = (selectedRecipeIndex + 1) % recipes.length;
			setSelectedRecipeIndex(id, nextIndex);
		}
	}

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
						<span>{selectedRecipe.quantity}x</span>
					</div>
					<div className="flex items-center gap-1 text-muted-foreground">
						<ClockIcon className="size-3" />
						<span>{selectedRecipe.time}s</span>
					</div>
				</div>
			</CardHeader>

			<CardFooter className="justify-between">
				<Button variant="ghost" onClick={previousRecipe} size="icon">
					<ArrowLeftIcon />
				</Button>
				<span className="text-xs text-muted-foreground">
					{(selectedRecipeIndex || 0) + 1} / {recipes.length}
				</span>
				<Button variant="ghost" onClick={nextRecipe} size="icon">
					<ArrowRightIcon />
				</Button>
			</CardFooter>

			<Handle type="source" position={Position.Bottom} />
		</Card>
	);
}
