import { Card, CardHeader } from '@/components/ui/card';
import { useItem } from '@/hooks/use-item';
import { useItemRecipes } from '@/hooks/use-item-recipes';
import { useRecipeIngredients } from '@/hooks/use-recipe-ingredients';
import { Position, Handle, Node, Edge, useReactFlow } from '@xyflow/react';
import { useEffect } from 'react';
import { buildNode } from '@/components/item/recipe-tree-v2';
import { useItemRecipe } from '@/hooks/use-item-recipe';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react';
import { useTreeNodes } from '@/providers';

export interface RecipeTreeNodeData extends Record<string, unknown>
{
	itemId: string;
	recipeIndex: number;
}

interface RecipeTreeNodeProps
{
	data: RecipeTreeNodeData;
}

export function RecipeTreeNodeV2({ data }: RecipeTreeNodeProps)
{
	const { itemId, recipeIndex } = data;

	const { data: item } = useItem(itemId);
	const { data: recipes } = useItemRecipes(itemId);
	const { data: recipe } = useItemRecipe(itemId, recipeIndex);
	const { data: ingredients } = useRecipeIngredients(recipe?.id);

	const { nodes } = useTreeNodes();

	const flow = useReactFlow<Node<RecipeTreeNodeData>, Edge>();
	const node = flow.getNode(itemId)!;

	useEffect(() =>
	{
		if (!ingredients) return;

		for (const ingredient of ingredients)
		{
			const position = {
				x: node.position.x + ingredients.indexOf(ingredient) * 150 - (ingredients.length - 1) * 75,
				y: node.position.y + 300,
			};

			const newNode = buildNode(ingredient.itemId, position);
			flow.addNodes(newNode);
		}
	}, [ingredients]);

	if (!item)
	{
		return null;
	}

	const handlePreviousRecipe = () =>
	{
		const prevIndex = (recipeIndex - 1 + recipes.length) % recipes.length;
		flow.updateNodeData(itemId, { itemId, recipeIndex: prevIndex });
	};

	const handleNextRecipe = () =>
	{
		const nextIndex = (recipeIndex + 1) % recipes.length;
		flow.updateNodeData(itemId, { itemId, recipeIndex: nextIndex });
	};

	return (
		<Card className="w-40">
			<CardHeader className="flex flex-col gap-2">
				<div className="flex items-center gap-2">
					<div className="flex size-8 items-center justify-center rounded-sm border bg-muted font-mono text-xs">{item.name.substring(0, 2).toUpperCase()}</div>
					<div className="min-w-0 flex-1">
						<p className="text-sm font-semibold">{item.name}</p>
					</div>
				</div>
				{recipes && (
					<div>
						<p className="truncate text-xs text-muted-foreground">{recipe ? recipe.name : ''}</p>
						<p className="text-xs text-muted-foreground">
							[{recipeIndex + 1}/{recipes.length}]
						</p>
					</div>
				)}
				<div className="flex items-center justify-between gap-2">
					<Button variant="ghost" onClick={handlePreviousRecipe} size="icon">
						<ArrowLeftIcon />
					</Button>
					<Button variant="ghost" onClick={handleNextRecipe} size="icon">
						<ArrowRightIcon />
					</Button>
				</div>
				{ingredients && (
					<div className="border-t pt-2">
						<p className="mb-1 text-xs font-semibold">Ingredients:</p>
						<div className="space-y-1">
							{ingredients.map((ingredient) => (
								<div key={ingredient.id} className="text-xs text-muted-foreground">
									<span>
										{nodes[ingredient.itemId]?.name} x{ingredient.quantity}
									</span>
								</div>
							))}
						</div>
					</div>
				)}
			</CardHeader>
		</Card>
	);
}
