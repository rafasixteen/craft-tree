import { BaseEdge, EdgeProps, getSmoothStepPath, Node, Edge, useReactFlow, EdgeLabelRenderer } from '@xyflow/react';
import { ItemFlowEdgeData } from '@/components/production-graph';

interface ItemFlowEdgeProps extends EdgeProps
{
	data: ItemFlowEdgeData;
}

export function ItemFlowEdge({ id, data, ...otherProps }: ItemFlowEdgeProps)
{
	const { sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, ...rest } = otherProps;

	const { source, target } = rest;

	const { updateEdgeData } = useReactFlow<Node, Edge<ItemFlowEdgeData>>();

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

	return (
		<>
			<BaseEdge id={id} path={edgePath} />
			<EdgeLabelRenderer>
				<div style={style} className="nodrag nopan absolute">
					Test
				</div>
			</EdgeLabelRenderer>
		</>
	);
}
