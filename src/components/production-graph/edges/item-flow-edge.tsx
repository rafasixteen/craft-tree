import { BaseEdge, EdgeProps, EdgeLabelRenderer, getBezierPath } from '@xyflow/react';
import { EdgeStatus, ItemFlowGraphEdge } from '@/components/production-graph/types';
import { useEdgeStatus, useSupply } from '@/components/production-graph/hooks';

export function ItemFlowEdge({ id, ...otherProps }: EdgeProps<ItemFlowGraphEdge>)
{
	const { source, target, sourceHandleId, targetHandleId } = otherProps;

	const [edgePath, labelX, labelY] = getBezierPath(otherProps);

	const style: React.CSSProperties = {
		transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
	};

	const supply = useSupply({
		sourceNodeId: source,
		sourceHandleId: sourceHandleId,
	});

	const status = useEdgeStatus({
		sourceNodeId: source,
		targetNodeId: target,
		sourceHandleId: sourceHandleId,
		targetHandleId: targetHandleId,
	});

	const color = getEdgeColor(status);

	return (
		<>
			<BaseEdge id={id} path={edgePath} style={{ stroke: color, strokeWidth: 2 }} />
			<EdgeLabelRenderer>
				<div style={{ ...style, color }} className="nodrag nopan absolute">
					{supply && `${supply.rate.amount.toFixed(2)}/${supply.rate.per.charAt(0)}`}
				</div>
			</EdgeLabelRenderer>
		</>
	);
}

function getEdgeColor(status: EdgeStatus): string
{
	switch (status)
	{
		case 'valid':
			return 'green';
		case 'insufficient':
			return 'yellow';
		case 'invalid':
			return 'red';
		default:
			return 'gray';
	}
}
