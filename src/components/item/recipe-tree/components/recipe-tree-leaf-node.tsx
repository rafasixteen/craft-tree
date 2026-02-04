import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Position, Handle } from '@xyflow/react';
import { ItemIcon, RecipeTreeNodeData, useRecipeTreeContext } from '@/components/item/recipe-tree';
import { PackageIcon } from 'lucide-react';

interface RecipeTreeLeafNodeProps
{
	id: string;
	data: RecipeTreeNodeData;
}

export function RecipeTreeLeafNode({ data: { node } }: RecipeTreeLeafNodeProps)
{
	const { tree } = useRecipeTreeContext();

	const calculation = {
		totalQuantity: tree!.getTotalQuantity(node),
	};

	return (
		<Card className="w-44">
			<Handle type="target" position={Position.Top} />

			<CardHeader className="flex gap-2">
				<ItemIcon itemName={node.item.name} />
				<div className="min-w-0 flex-1">
					<p className="truncate text-sm font-semibold">{node.item.name}</p>
				</div>
			</CardHeader>
			<CardContent className="text-xs">
				<div className="flex items-center gap-1 text-muted-foreground">
					<span className="font-medium">Total</span>
				</div>
				<div className="mt-1 flex items-center gap-1 text-muted-foreground">
					<PackageIcon className="size-3" />
					<span className="truncate">{calculation.totalQuantity}x</span>
				</div>
			</CardContent>
		</Card>
	);
}
