import { NodeIcon, RawMaterialNodeData } from '@/components/recipe-tree';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useNodeDemand } from '@/domain/recipe-tree';
import { formatNumber } from '@/lib/utils';
import { Handle, Position } from '@xyflow/react';
import { PackageIcon } from 'lucide-react';

interface RawMaterialNodeProps
{
	id: string;
	data: RawMaterialNodeData;
}

export function RawMaterialNode({ id, data: { item } }: RawMaterialNodeProps)
{
	const demand = useNodeDemand(id);

	return (
		<Card className="w-65">
			<Handle type="target" position={Position.Top} />
			<CardHeader className="flex items-center gap-2">
				<NodeIcon itemName={item.name} />
				<div>
					<p className="text-sm font-semibold">{item.name}</p>
				</div>
			</CardHeader>
			<CardContent className="flex gap-2 text-xs text-muted-foreground">
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
			</CardContent>
		</Card>
	);
}
