import { BaseNode } from '@/components/base-node';
import { RecipeTreeNodeContent, RecipeTreeNodeHeader } from '@/components/recipe-tree';

import { Handle, NodeProps, Position } from '@xyflow/react';

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
