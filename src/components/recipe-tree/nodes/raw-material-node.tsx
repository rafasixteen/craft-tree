import { NodeProps, Handle, Position } from '@xyflow/react';
import { BaseNode } from '@/components/base-node';
import { RecipeTreeNodeContent, RecipeTreeNodeHeader } from '@/components/recipe-tree';

export function RawMaterialNode({ id }: NodeProps)
{
	return (
		<BaseNode className="w-65">
			<Handle type="target" position={Position.Top} />
			<RecipeTreeNodeHeader nodeId={id} />
			<RecipeTreeNodeContent nodeId={id} />
		</BaseNode>
	);
}
