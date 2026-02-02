import { BaseEdge, EdgeLabelRenderer, getSmoothStepPath } from '@xyflow/react';

interface RecipeTreeEdgeProps
{
	id: string;
	sourceX: number;
	sourceY: number;
	targetX: number;
	targetY: number;
}

export function RecipeTreeEdge({ id, sourceX, sourceY, targetX, targetY }: RecipeTreeEdgeProps)
{
	const [edgePath, labelX, labelY] = getSmoothStepPath({
		sourceX,
		sourceY,
		targetX,
		targetY,
	});

	return (
		<>
			<BaseEdge id={id} path={edgePath} />
			<EdgeLabelRenderer>
				<label
					style={{
						position: 'absolute',
						transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
						pointerEvents: 'all',
					}}
					className="nodrag nopan"
				>
					Label
				</label>
			</EdgeLabelRenderer>
		</>
	);
}
