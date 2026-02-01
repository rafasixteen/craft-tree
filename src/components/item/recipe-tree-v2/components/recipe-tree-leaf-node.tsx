import { Card, CardHeader } from '@/components/ui/card';
import { Position, Handle } from '@xyflow/react';
import { RecipeTreeLeafNodeData } from '../types';

interface RecipeTreeLeafNodeProps
{
	id: string;
	data: RecipeTreeLeafNodeData;
}

export function RecipeTreeLeafNode({ id, data }: RecipeTreeLeafNodeProps)
{
	const { item } = data;

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
				<div className="flex w-full justify-center border-t pt-2">
					<p className="text-xs text-muted-foreground italic">Base ingredient</p>
				</div>
			</CardHeader>
		</Card>
	);
}
