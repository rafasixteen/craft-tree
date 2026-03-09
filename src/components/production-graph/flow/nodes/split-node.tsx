'use client';

import { BaseNode, BaseNodeHeader, BaseNodeContent } from '@/components/base-node';
import { LabeledHandle } from '@/components/labeled-handle';
import { Button } from '@/components/ui/button';
import { NodeProps, Position, useNodeConnections, useReactFlow, useUpdateNodeInternals } from '@xyflow/react';
import { SplitGraphNode } from '@/components/production-graph/flow/types';
import { PlusIcon, XIcon } from 'lucide-react';
import { ProductionRate } from '@/domain/production-graph';
import { ProductionRateComponent } from '@/components/production-graph/flow/production-rate';
import { useSupply } from '@/components/production-graph/flow/hooks';
import { useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';

export function SplitNode({ id, data, selected }: NodeProps<SplitGraphNode>)
{
	const { updateNodeData, getEdges, deleteElements } = useReactFlow<SplitGraphNode>();
	const updateNodeInternals = useUpdateNodeInternals();

	// TODO: Can we make the useSupply hook use the useNodeConnections
	// internally so we don't have to use both hooks here?

	const connections = useNodeConnections({
		handleType: 'target',
	});

	const sourceNodeId = connections[0]?.source;
	const sourceHandleId = connections[0]?.sourceHandle;

	const supply = useSupply({
		sourceNodeId: sourceNodeId,
		sourceHandleId: sourceHandleId,
	});

	const { rates } = data;

	const onProductionRateChange = useCallback(
		function onProductionRateChange(index: number, value: ProductionRate)
		{
			const newRates = [...rates];
			newRates[index] = value;

			updateNodeData(id, { rates: newRates });
		},
		[id, rates, updateNodeData],
	);

	const addOutput = useCallback(
		function addOutput()
		{
			const newRate: ProductionRate = {
				amount: 0,
				per: 'second',
			};

			const newRates = [...rates, newRate];

			updateNodeData(id, { rates: newRates });
			updateNodeInternals(id);
		},
		[id, rates, updateNodeData, updateNodeInternals],
	);

	const removeOutput = useCallback(
		function removeOutput(index: number)
		{
			if (!rates)
			{
				return;
			}

			const edges = getEdges();
			const handleId = String(index);

			// Remove any edges connected to this output handle.
			edges.forEach((edge) =>
			{
				if (edge.source === id && edge.sourceHandle === handleId)
				{
					deleteElements({ edges: [edge] });
				}
			});

			const newRates = rates.filter((_, i) => i !== index);

			updateNodeData(id, { rates: newRates });
			updateNodeInternals(id);
		},
		[id, rates, getEdges, deleteElements, updateNodeData, updateNodeInternals],
	);

	useEffect(() =>
	{
		// When the supply changes, we need to update the itemId of the split node to match the itemId of the supply.
		updateNodeData(id, { itemId: supply?.itemId });
		updateNodeInternals(id);
	}, [supply?.itemId, id]);

	return (
		<BaseNode className={cn('flex flex-col p-0', selected && 'ring-2 ring-primary')}>
			<BaseNodeHeader className="flex flex-col border-b">
				<div className="flex w-full items-center justify-between gap-2">
					<span>Split Node</span>
					<Button variant="ghost" size="icon-xs" onClick={addOutput} className="nodrag">
						<PlusIcon className="size-3" />
					</Button>
				</div>
			</BaseNodeHeader>
			{rates.length > 0 && (
				<BaseNodeContent className="flex flex-row justify-between p-0 py-3">
					<LabeledHandle type="target" position={Position.Left} title="Input" />
					<div className="flex flex-col justify-center gap-3">
						{rates.map((rate, index) =>
						{
							const edges = getEdges();
							const handleId = String(index);
							const hasConnection = edges.some((edge) => edge.source === id && edge.sourceHandle === handleId);

							return (
								<div key={index} className="flex items-center gap-2">
									<Button variant="destructive" size="icon-xs" onClick={() => removeOutput(index)} className="nodrag" disabled={rates.length <= 1}>
										<XIcon className="size-3" />
									</Button>
									<ProductionRateComponent value={rate} onChange={(newRate) => onProductionRateChange(index, newRate)} className="nodrag w-full" />
									<LabeledHandle id={handleId} type="source" position={Position.Right} title="" isConnectable={!hasConnection} />
								</div>
							);
						})}
					</div>
				</BaseNodeContent>
			)}
		</BaseNode>
	);
}
