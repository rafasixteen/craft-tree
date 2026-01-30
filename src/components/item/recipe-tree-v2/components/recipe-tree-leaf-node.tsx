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
					<div className="w-8 h-8 bg-muted rounded border flex items-center justify-center text-xs font-mono">{item.name.substring(0, 2).toUpperCase()}</div>
					<div className="flex-1 min-w-0">
						<p className="font-semibold text-sm">{item.name}</p>
					</div>
				</div>
				<div className="border-t pt-2 w-full flex justify-center">
					<p className="text-xs text-muted-foreground italic">Base ingredient</p>
				</div>
			</CardHeader>
		</Card>
	);
}
