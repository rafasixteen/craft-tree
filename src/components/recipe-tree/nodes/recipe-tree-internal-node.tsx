import { RecipeTreeNodeData, RecipeCarousel, NodeIcon } from '@/components/recipe-tree';
import { Card, CardFooter, CardHeader } from '@/components/ui/card';
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
			<CardHeader className="flex items-center gap-2">
				<NodeIcon itemName={item.name} />
				<div className="min-w-0">
					<p className="truncate text-sm font-semibold">{item.name}</p>
					<p className="truncate text-xs text-muted-foreground">{recipes[selectedRecipeIndex].name}</p>
				</div>
			</CardHeader>
			<CardFooter>
				<RecipeCarousel nodeId={id} recipes={recipes} selectedRecipeIndex={selectedRecipeIndex} />
			</CardFooter>
			<Handle type="source" position={Position.Bottom} />
		</Card>
	);
}
