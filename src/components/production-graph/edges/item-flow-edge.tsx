import { BaseEdge, EdgeProps, getSmoothStepPath, EdgeLabelRenderer } from '@xyflow/react';
import { ItemFlowEdgeData } from '@/components/production-graph/types';
import { useEdgeStatus, useSupply } from '@/components/production-graph/hooks';

interface ItemFlowEdgeProps extends EdgeProps
{
	data: ItemFlowEdgeData;
}

export function ItemFlowEdge({ id, ...otherProps }: ItemFlowEdgeProps)
{
	const { sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition } = otherProps;
	const { source, target, sourceHandleId, targetHandleId } = otherProps;

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

	const itemRate = useSupply({
		sourceNodeId: source,
		sourceHandleId: sourceHandleId,
	});

	const status = useEdgeStatus({
		sourceNodeId: source,
		targetNodeId: target,
		sourceHandleId: sourceHandleId,
		targetHandleId: targetHandleId,
	});

	let color = 'gray';
	if (status === 'valid') color = 'green';
	else if (status === 'insufficient') color = 'yellow';
	else if (status === 'invalid') color = 'red';

	return (
		<>
			<BaseEdge id={id} path={edgePath} style={{ stroke: color, strokeWidth: 2 }} />
			<EdgeLabelRenderer>
				<div style={{ ...style, color }} className="nodrag nopan absolute">
					{itemRate && `${itemRate.rate.amount.toFixed(2)}/s`}
				</div>
			</EdgeLabelRenderer>
		</>
	);
}
