import { useEdgeStatus, useSupply } from '@/components/graph/flow/hooks';
import { EdgeStatus, ItemFlowGraphEdge } from '@/components/graph/flow/types';

import { formatNumber } from '@/lib/utils';

import { BaseEdge, EdgeLabelRenderer, EdgeProps, getBezierPath } from '@xyflow/react';

export function ItemFlowEdge({ id, selected, ...otherProps }: EdgeProps<ItemFlowGraphEdge>)
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

	// TODO: Add an indicator when the edge is selected.

	return (
		<>
			<BaseEdge id={id} path={edgePath} style={{ stroke: color, strokeWidth: 2 }} />
			<EdgeLabelRenderer>
				<div style={{ ...style, color }} className="nodrag nopan absolute">
					{supply && `${formatNumber(supply.amount, 3)}/${supply.per.charAt(0)}`}
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
