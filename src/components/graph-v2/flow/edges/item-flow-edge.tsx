import { EdgeType, getEdgeDefinition, useNodeOutput } from '@/domain/graph-v2';
import { formatNumber } from '@/lib/utils';
import { BaseEdge, EdgeLabelRenderer, EdgeProps, getBezierPath } from '@xyflow/react';

export function ItemFlowEdge({ id, source, sourceHandleId, type, ...otherProps }: EdgeProps)
{
	const [edgePath, labelX, labelY] = getBezierPath(otherProps);

	const output = useNodeOutput(source);
	const definition = getEdgeDefinition(type as EdgeType);
	const rate = output && definition ? definition.getRate(output, sourceHandleId) : null;
	const color = rate ? 'green' : 'red';

	return (
		<>
			<BaseEdge id={id} path={edgePath} style={{ stroke: color, strokeWidth: 2 }} />
			<EdgeLabelRenderer>
				<div
					style={{ transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`, color }}
					className="nodrag nopan absolute"
				>
					{rate && `${formatNumber(rate.amount, 3)}/${rate.per.charAt(0)}`}
				</div>
			</EdgeLabelRenderer>
		</>
	);
}
