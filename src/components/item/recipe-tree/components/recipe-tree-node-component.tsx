'use client';

import { RecipeTreeNode } from '../utils/recipe-tree';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RecipeTreeNodeProps
{
	node: RecipeTreeNode;
	availableRecipes?: number;
	onRecipeChange?: (itemId: string, recipeIndex: number) => void;
}

export function RecipeTreeNodeComponent({ node, availableRecipes = 1, onRecipeChange }: RecipeTreeNodeProps)
{
	const hasMultipleRecipes = availableRecipes > 1;
	const currentRecipeIndex = node.selectedRecipeIndex || 0;

	const handlePrevRecipe = (e: React.MouseEvent) =>
	{
		e.stopPropagation();
		if (!onRecipeChange) return;
		const newIndex = currentRecipeIndex > 0 ? currentRecipeIndex - 1 : availableRecipes - 1;
		onRecipeChange(node.item.id, newIndex);
	};

	const handleNextRecipe = (e: React.MouseEvent) =>
	{
		e.stopPropagation();
		if (!onRecipeChange) return;
		const newIndex = currentRecipeIndex < availableRecipes - 1 ? currentRecipeIndex + 1 : 0;
		onRecipeChange(node.item.id, newIndex);
	};

	return (
		<div className="flex flex-col items-center gap-1">
			<Card className={cn('relative flex min-w-[120px] items-center gap-2 px-3 py-2', node.recipe ? 'bg-card' : 'bg-muted')}>
				{/* Recipe carousel controls */}
				{hasMultipleRecipes && (
					<>
						<Button
							variant="ghost"
							size="icon"
							className="absolute top-1/2 left-0 size-6 -translate-1/2 rounded-full bg-background shadow-sm"
							onClick={handlePrevRecipe}
						>
							<ChevronLeft className="size-4" />
						</Button>
						<Button
							variant="ghost"
							size="icon"
							className="absolute top-1/2 right-0 size-6 translate-x-1/2 -translate-y-1/2 rounded-full bg-background shadow-sm"
							onClick={handleNextRecipe}
						>
							<ChevronRight className="size-4" />
						</Button>
					</>
				)}

				{/* Item icon placeholder - you can replace this with actual item icons */}
				<div className="flex size-8 items-center justify-center rounded-sm border bg-muted font-mono text-xs">{node.item.name.substring(0, 2).toUpperCase()}</div>

				{/* Quantity badge */}
				<div className="flex items-center gap-1">
					<span className="text-sm font-medium">{node.item.name}</span>
					<span className="text-xs text-muted-foreground">x{node.quantity}</span>
				</div>

				{/* Recipe indicator */}
				{hasMultipleRecipes && (
					<div className="absolute -top-2 -right-2 flex size-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
						{currentRecipeIndex + 1}
					</div>
				)}
			</Card>

			{/* Vertical line connector */}
			{node.children.length > 0 && <div className="h-4 w-0.5 bg-border" />}
		</div>
	);
}
