import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Position, Handle } from '@xyflow/react';
import { ItemIcon, RecipeTreeNodeData } from '@/components/item/recipe-tree';
import { PackageIcon } from 'lucide-react';

interface RecipeTreeLeafNodeProps
{
	id: string;
	data: RecipeTreeNodeData;
}

export function RecipeTreeLeafNode({ data: { node } }: RecipeTreeLeafNodeProps)
{
	const calculation = {
		totalQuantity: undefined,
		totalTime: undefined,
	};

	return (
		<Card className="w-40">
			<Handle type="target" position={Position.Top} />

			<CardHeader className="flex gap-2">
				<ItemIcon itemName={node.item.name} />
				<div className="min-w-0 flex-1">
					<p className="truncate text-sm font-semibold">{node.item.name}</p>
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
