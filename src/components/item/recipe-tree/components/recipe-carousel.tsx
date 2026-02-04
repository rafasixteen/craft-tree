import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react';
import { useRecipeTreeContext } from '@/components/item/recipe-tree';
import { useCallback, memo } from 'react';
import { Button } from '@/components/ui/button';
import { Recipe } from '@/domain/recipe';

interface RecipeCarouselProps
{
	nodeId: string;
	recipes: Recipe[];
	selectedRecipeIndex: number;
}

export const RecipeCarousel = memo(function RecipeCarousel({ nodeId, recipes, selectedRecipeIndex }: RecipeCarouselProps)
{
	const { tree } = useRecipeTreeContext();

	const previousRecipe = useCallback(
		function previousRecipe()
		{
			if (tree)
			{
				tree.selectRecipe(nodeId, -1);
				tree.incrementVersion();
			}
		},
		[tree, nodeId],
	);

	const nextRecipe = useCallback(
		function nextRecipe()
		{
			if (tree)
			{
				tree.selectRecipe(nodeId, +1);
				tree.incrementVersion();
			}
		},
		[tree, nodeId],
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
});
