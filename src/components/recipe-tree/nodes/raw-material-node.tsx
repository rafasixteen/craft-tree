import { NodeProps, Handle, Position } from '@xyflow/react';
import { useRecipeTree } from '@/domain/recipe-tree/hooks/use-recipe-tree';
import { useNodeDemand } from '@/domain/recipe-tree/hooks/use-node-demand';
import { Card, CardContent } from '@/components/ui/card';
import { PackageIcon } from 'lucide-react';
import { formatNumber } from '@/lib/utils';
import { BaseNode, BaseNodeContent, BaseNodeHeader } from '@/components/base-node';

export function RawMaterialNode({ id }: NodeProps)
{
	const { recipeTree } = useRecipeTree();

	const demand = useNodeDemand(id);

	if (!recipeTree)
	{
		return null;
	}

	const node = recipeTree.nodes[id];

	if (!node)
	{
		return <div>Unknown node</div>;
	}

	const item = node.item;

	return (
		<BaseNode className="w-65">
			<Handle type="target" position={Position.Top} />
			<BaseNodeHeader className="flex items-center gap-2 border-b p-3">
				<div className="min-w-0">
					<p className="text-sm font-semibold">{item.name}</p>
				</div>
			</BaseNodeHeader>
			<BaseNodeContent className="p-3">
				<Card className="w-full border-none bg-muted/40 p-0 shadow-none">
					<CardContent className="flex flex-col gap-2 p-3 text-xs text-muted-foreground">
						<div className="flex items-center gap-2">
							<PackageIcon className="size-4 text-primary" />
							<span className="font-medium">Demand</span>
							<span className="ml-auto font-mono">
								{formatNumber(demand.amount)} / {demand.per}
							</span>
						</div>
					</CardContent>
				</Card>
			</BaseNodeContent>
		</BaseNode>
	);
}
