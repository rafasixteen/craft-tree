import { NodeIcon, RecipeTreeNodeData } from '@/components/recipe-tree';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useRecipeTree } from '@/domain/recipe-tree';
import { Handle, Position } from '@xyflow/react';
import { ClockIcon, PackageIcon } from 'lucide-react';

interface RecipeTreeLeafNodeProps
{
	id: string;
	data: RecipeTreeNodeData;
}

export function RecipeTreeLeafNode({ id, data }: RecipeTreeLeafNodeProps)
{
	const { item } = data;

	const { getResolvedQuantity} = useRecipeTree();

	return (
		<Card>
			<Handle type="target" position={Position.Top} />
			<CardHeader className="flex items-center gap-2">
				<NodeIcon itemName={item.name} />
				<div className="min-w-0">
					<p className="truncate text-sm font-semibold">{item.name}</p>
				</div>
			</CardHeader>
			<CardContent className="flex gap-2 text-xs text-muted-foreground">
				<div className="flex-1">
					<p>Quantity</p>
					<div className="flex items-center gap-1">
						<PackageIcon className="size-3" />
						<span>{getResolvedQuantity(id)}x</span>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
