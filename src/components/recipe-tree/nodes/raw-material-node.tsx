import { NodeIcon, NodeStats, RawMaterialNodeData } from '@/components/recipe-tree';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Handle, Position } from '@xyflow/react';

interface RawMaterialNodeProps
{
	id: string;
	data: RawMaterialNodeData;
}

export function RawMaterialNode({ id, data: { item } }: RawMaterialNodeProps)
{
	return (
		<Card className="max-w-80 min-w-50">
			<Handle type="target" position={Position.Top} />
			<CardHeader className="flex items-center gap-2">
				<NodeIcon itemName={item.name} />
				<div>
					<p className="text-sm font-semibold">{item.name}</p>
				</div>
			</CardHeader>
			<CardContent className="flex gap-2 text-xs text-muted-foreground">
				<NodeStats nodeId={id} />
			</CardContent>
		</Card>
	);
}
