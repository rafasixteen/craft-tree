import { BaseEdge, EdgeProps, getSmoothStepPath, EdgeLabelRenderer } from '@xyflow/react';
import { ItemFlowEdgeData } from '@/components/production-graph/types';
import { useEdgeStatus, useSourceItemRate } from '@/components/production-graph/hooks';

interface ItemFlowEdgeProps extends EdgeProps
{
	data: ItemFlowEdgeData;
}

export function ItemFlowEdge({ id, ...otherProps }: ItemFlowEdgeProps)
{
	const { sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, source, target, targetHandleId } = otherProps;

	const [edgePath, labelX, labelY] = getSmoothStepPath({
		sourceX,
		sourceY,
		targetX,
		targetY,
		sourcePosition,
		targetPosition,
	});

	const style: React.CSSProperties = {
		transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
	};

	// Get rate and status
	const itemRate = useSourceItemRate(source);
	const status = useEdgeStatus(source, target, targetHandleId);

	let color = 'gray';
	if (status === 'valid') color = 'green';
	else if (status === 'insufficient') color = 'yellow';
	else if (status === 'invalid') color = 'red';

	return (
		<>
			<BaseEdge id={id} path={edgePath} style={{ stroke: color, strokeWidth: 2 }} />
			<EdgeLabelRenderer>
				<div style={{ ...style, color }} className="nodrag nopan absolute font-bold">
					{itemRate?.rate.amount ?? 0} {itemRate?.rate.per ?? 'second'}
				</div>
			</EdgeLabelRenderer>
		</>
	);
}
