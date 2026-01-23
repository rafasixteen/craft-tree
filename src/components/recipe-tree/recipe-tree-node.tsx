'use client';

import { RecipeTreeNode as TreeNode } from '@/domain/recipe';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RecipeTreeNodeProps
{
	node: TreeNode;
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
			<Card className={cn('relative flex items-center gap-2 px-3 py-2 min-w-[120px]', node.recipe ? 'bg-card' : 'bg-muted')}>
				{/* Recipe carousel controls */}
				{hasMultipleRecipes && (
					<>
						<Button
							variant="ghost"
							size="icon"
							className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-6 -translate-x-1/2 bg-background rounded-full shadow-sm"
							onClick={handlePrevRecipe}
						>
							<ChevronLeft className="h-4 w-4" />
						</Button>
						<Button
							variant="ghost"
							size="icon"
							className="absolute right-0 top-1/2 -translate-y-1/2 h-6 w-6 translate-x-1/2 bg-background rounded-full shadow-sm"
							onClick={handleNextRecipe}
						>
							<ChevronRight className="h-4 w-4" />
						</Button>
					</>
				)}

				{/* Item icon placeholder - you can replace this with actual item icons */}
				<div className="w-8 h-8 bg-muted rounded border flex items-center justify-center text-xs font-mono">{node.item.name.substring(0, 2).toUpperCase()}</div>

				{/* Quantity badge */}
				<div className="flex items-center gap-1">
					<span className="text-sm font-medium">{node.item.name}</span>
					<span className="text-xs text-muted-foreground">x{node.quantity}</span>
				</div>

				{/* Recipe indicator */}
				{hasMultipleRecipes && (
					<div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
						{currentRecipeIndex + 1}
					</div>
				)}
			</Card>

			{/* Vertical line connector */}
			{node.children.length > 0 && <div className="w-0.5 h-4 bg-border" />}
		</div>
	);
}
