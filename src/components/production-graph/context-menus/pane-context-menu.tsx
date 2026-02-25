import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useReactFlow } from '@xyflow/react';
import { ItemNodeData, ProducerNodeData, SplitNodeData } from '@/components/production-graph';
import React, { useCallback } from 'react';

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

	const addItem = useCallback(
		function addItem(e: React.MouseEvent)
		{
			const data: ItemNodeData = {
				item: null,
				rate: {
					amount: 1,
					per: 'second',
				},
			};

			addNodes({
				id: `item-${crypto.randomUUID()}`,
				type: 'item',
				position: screenToFlowPosition({ x: e.clientX, y: e.clientY }),
				data: data,
			});
		},
		[addNodes, screenToFlowPosition],
	);

	const addProducer = useCallback(
		function addProducer(e: React.MouseEvent)
		{
			const data: ProducerNodeData = {
				producer: null,
				inputs: null,
				outputs: null,
				inputRates: null,
				outputRates: null,
				producerCount: 1,
				extraInfo: false,
			};

			addNodes({
				id: `producer-${crypto.randomUUID()}`,
				type: 'producer',
				position: screenToFlowPosition({ x: e.clientX, y: e.clientY }),
				data: data,
			});
		},
		[addNodes, screenToFlowPosition],
	);

	function addSplitNode(e: React.MouseEvent)
	{
		const data: SplitNodeData = {
			outputs: [
				{
					amount: 1,
					per: 'second',
				},
			],
		};

		addNodes({
			id: `split-${crypto.randomUUID()}`,
			type: 'split',
			position: screenToFlowPosition({ x: e.clientX, y: e.clientY }),
			data: data,
		});
	}

	return (
		<Card style={style} {...props} className="gap-0 p-1">
			<Button variant="ghost" size="sm" className="w-full justify-start" onClick={addItem}>
				Add Item Node
			</Button>
			<Button variant="ghost" size="sm" className="w-full justify-start" onClick={addProducer}>
				Add Producer Node
			</Button>
			<Button variant="ghost" size="sm" className="w-full justify-start" onClick={addSplitNode}>
				Add Split Node
			</Button>
		</Card>
	);
}
