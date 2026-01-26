import { Item } from '@/domain/item';
import { Position, Handle } from '@xyflow/react';

export interface RecipeTreeNodeData extends Record<string, unknown>
{
	item: string;
}

interface RecipeTreeNodeProps
{
	data: RecipeTreeNodeData;
}

export function RecipeTreeNodeV2({ data }: RecipeTreeNodeProps)
{
	const { item } = data;

	return (
		<div className="custom-node">
			<div>Custom Recipe Tree Node: {item}</div>
			<Handle type="source" position={Position.Bottom} />
			<Handle type="target" position={Position.Top} />
		</div>
	);
}
