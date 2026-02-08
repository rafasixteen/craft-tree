import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react';
import { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Recipe } from '@/domain/recipe';
import { useRecipeTree } from '@/domain/recipe-tree';

interface RecipeCarouselProps
{
	nodeId: string;
	recipes: Recipe[];
	selectedRecipeIndex: number;
}

export function RecipeCarousel({ nodeId, recipes, selectedRecipeIndex }: RecipeCarouselProps)
{
	const { changeRecipe } = useRecipeTree();

	const previousRecipe = useCallback(
		function previousRecipe()
		{
			changeRecipe(nodeId, -1);
		},
		[nodeId, changeRecipe],
	);

	const nextRecipe = useCallback(
		function nextRecipe()
		{
			changeRecipe(nodeId, 1);
		},
		[nodeId, changeRecipe],
	);

	return (
		<>
			<Button variant="ghost" onClick={previousRecipe} size="icon">
				<ArrowLeftIcon />
			</Button>
			<span className="text-xs text-muted-foreground">
				{selectedRecipeIndex + 1} / {recipes.length}
			</span>
			<Button variant="ghost" onClick={nextRecipe} size="icon">
				<ArrowRightIcon />
			</Button>
		</>
	);
}
