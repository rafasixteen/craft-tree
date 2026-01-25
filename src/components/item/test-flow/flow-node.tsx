import { Position, Handle } from '@xyflow/react';

interface FlowNodeProps
{
	data: {
		label: string;
	};
}

export function FlowNode({ data: { label: value } }: FlowNodeProps)
{
	return (
		<div className="custom-node">
			<div>Custom Node Content: {value}</div>
			<Handle type="source" position={Position.Bottom} />
			<Handle type="target" position={Position.Top} />
		</div>
	);
}
