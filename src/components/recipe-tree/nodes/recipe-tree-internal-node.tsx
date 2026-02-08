import { RecipeTreeNodeData, RecipeCarousel } from '@/components/recipe-tree';
import { Card, CardFooter } from '@/components/ui/card';
import { Handle, Position } from '@xyflow/react';

interface RecipeTreeNodeProps
{
	id: string;
	data: RecipeTreeNodeData;
}

export function RecipeTreeInternalNode({ id, data }: RecipeTreeNodeProps)
{
	const { item, recipes, selectedRecipeIndex } = data;

	if (selectedRecipeIndex === -1)
	{
		throw new Error('Internal node must have a selected recipe index');
	}

	return (
		<Card size="sm" className="p-2">
			<Handle type="target" position={Position.Top} />
			<p>Node {item.name}</p>
			<CardFooter>
				<RecipeCarousel nodeId={id} recipes={recipes} selectedRecipeIndex={selectedRecipeIndex} />
			</CardFooter>
			<Handle type="source" position={Position.Bottom} />
		</Card>
	);
}
