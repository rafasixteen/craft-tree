import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useReactFlow } from '@xyflow/react';
import { ProducerNodeData } from '@/components/production-graph';
import React from 'react';

interface PaneContextMenuProps extends React.HTMLAttributes<HTMLDivElement>
{
	top?: number;
	left?: number;
	right?: number;
	bottom?: number;
}

export function PaneContextMenu({ top, left, right, bottom, ...props }: PaneContextMenuProps)
{
	const { addNodes, screenToFlowPosition } = useReactFlow();

	const style: React.CSSProperties = {
		top,
		left,
		right,
		bottom,
		position: 'absolute',
		zIndex: 10,
	};

	function addProducer(e: React.MouseEvent)
	{
		const data: ProducerNodeData = {
			producer: null,
		};

		addNodes({
			id: `producer-${Date.now()}`,
			type: 'producer',
			position: screenToFlowPosition({ x: e.clientX, y: e.clientY }),
			data: data,
		});
	}

	return (
		<Card style={style} {...props} className="gap-2 p-2">
			<Button variant="ghost" size="sm" className="w-full" onClick={addProducer}>
				Add Producer
			</Button>
		</Card>
	);
}
