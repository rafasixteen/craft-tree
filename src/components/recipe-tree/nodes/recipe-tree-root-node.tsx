import { RecipeTreeNodeData, RecipeCarousel, NodeIcon, NodeStats } from '@/components/recipe-tree';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Handle, Position } from '@xyflow/react';
import { useRecipeTree } from '@/domain/recipe-tree';

interface RecipeTreeRootNodeProps
{
	id: string;
	data: RecipeTreeNodeData;
}

export function RecipeTreeRootNode({ id, data }: RecipeTreeRootNodeProps)
{
	const { item, recipes, selectedRecipeIndex } = data;

	const { getResolvedQuantity, getNodeTime } = useRecipeTree();

	if (selectedRecipeIndex === -1)
	{
		throw new Error('Root node must have a selected recipe index');
	}

	const selectedRecipe = recipes[selectedRecipeIndex];

	return (
		<Card size="sm" className="p-2">
			<CardHeader className="flex items-center gap-2">
				<NodeIcon itemName={item.name} />
				<div className="min-w-0">
					<p className="truncate text-sm font-semibold">{item.name}</p>
					<p className="truncate text-xs text-muted-foreground">{recipes[selectedRecipeIndex].name}</p>
				</div>
			</CardHeader>
			<CardContent className="flex gap-2 text-xs text-muted-foreground">
				<NodeStats title="Recipe" quantity={selectedRecipe.quantity} time={selectedRecipe.time} />
				<NodeStats title="Total" quantity={getResolvedQuantity(id)} time={getNodeTime(id)} />
			</CardContent>
			<CardFooter>
				<RecipeCarousel nodeId={id} recipes={recipes} selectedRecipeIndex={selectedRecipeIndex} />
			</CardFooter>
			<Handle type="source" position={Position.Bottom} />
		</Card>
	);
}
