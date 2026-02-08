import { RecipeTreeNodeData, RecipeCarousel } from '@/components/recipe-tree';
import { Card, CardFooter } from '@/components/ui/card';
import { Handle, Position } from '@xyflow/react';

interface RecipeTreeRootNodeProps
{
	id: string;
	data: RecipeTreeNodeData;
}

export function RecipeTreeRootNode({ id, data }: RecipeTreeRootNodeProps)
{
	const { item, recipes, selectedRecipeIndex } = data;

	if (selectedRecipeIndex === -1)
	{
		throw new Error('Root node must have a selected recipe index');
	}

	return (
		<Card size="sm" className="p-2">
			<p>Root Node {item.name}</p>
			<Handle type="source" position={Position.Bottom} />
			<CardFooter>
				<RecipeCarousel nodeId={id} recipes={recipes} selectedRecipeIndex={selectedRecipeIndex} />
			</CardFooter>
		</Card>
	);
}
