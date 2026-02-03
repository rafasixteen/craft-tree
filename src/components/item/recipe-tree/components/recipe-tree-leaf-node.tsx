import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Position, Handle } from '@xyflow/react';
import { useRecipeTreeContext, RecipeTreeNodeData } from '@/components/item/recipe-tree';
import { PackageIcon, ClockIcon } from 'lucide-react';

interface RecipeTreeLeafNodeProps
{
	id: string;
	data: RecipeTreeNodeData;
}

export function RecipeTreeLeafNode({ id, data: { item } }: RecipeTreeLeafNodeProps)
{
	const { loading, calculateRecipe } = useRecipeTreeContext();

	if (loading)
	{
		return null;
	}

	const calculation = calculateRecipe(id, item.id);

	return (
		<Card className="w-40">
			<Handle type="target" position={Position.Top} />

			<CardHeader className="flex flex-col gap-2">
				<div className="flex items-center gap-2">
					<div className="flex size-8 items-center justify-center rounded-sm border bg-muted font-mono text-xs">{item.name.substring(0, 2).toUpperCase()}</div>
					<div className="min-w-0 flex-1">
						<p className="text-sm font-semibold">{item.name}</p>
					</div>
				</div>
			</CardHeader>
			<CardContent className="flex">
				<div className="flex-1">
					<p className="text-xs text-muted-foreground">Total</p>
					<div className="flex items-center gap-1 text-muted-foreground">
						<PackageIcon className="size-3" />
						<span>{calculation.totalQuantity}x</span>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
