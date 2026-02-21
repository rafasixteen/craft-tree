import { BaseEdge, EdgeProps, getSmoothStepPath, EdgeLabelRenderer } from '@xyflow/react';
import { ItemFlowEdgeData } from '@/components/production-graph/types';
import { cn } from '@/lib/utils';

interface ItemFlowEdgeProps extends EdgeProps
{
	data: ItemFlowEdgeData;
}

export function ItemFlowEdge({ id, data, ...otherProps }: ItemFlowEdgeProps)
{
	const { sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition } = otherProps;

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

	const invalid = data.invalid ?? false;

	return (
		<>
			<BaseEdge id={id} path={edgePath} />
			<EdgeLabelRenderer>
				<div style={style} className={cn('nodrag nopan absolute', invalid && 'text-destructive')}>
					Test
				</div>
			</EdgeLabelRenderer>
		</>
	);
}
