'use client';

import { BaseNode, BaseNodeHeader, BaseNodeContent } from '@/components/base-node';
import { LabeledHandle } from '@/components/labeled-handle';
import { Button } from '@/components/ui/button';
import { NodeProps, Position, useNodeConnections, useReactFlow, useUpdateNodeInternals } from '@xyflow/react';
import { SplitGraphNode } from '@/components/production-graph/flow/types';
import { PlusIcon, XIcon } from 'lucide-react';
import { ItemRate, ProductionRate } from '@/domain/production-graph';
import { ProductionRateComponent } from '@/components/production-graph/flow/production-rate';
import { useSupply } from '@/components/production-graph/flow/hooks';
import { useEffect } from 'react';

export function SplitNode({ id, data }: NodeProps<SplitGraphNode>)
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

	function addOutput()
	{
		const newRate: ItemRate = {
			itemId: supply?.itemId || '',
			amount: 0,
			per: 'second',
		};

		const newRates = [...rates, newRate];

		updateNodeData(id, { rates: newRates });
		updateNodeInternals(id);
	}

	function onProductionRateChange(index: number, value: ProductionRate)
	{
		if (!rates)
		{
			return;
		}

		// Limit the amount based on the supply and other output rates
		// to ensure the total output does not exceed the input.
		let maxAmount = value.amount;

		if (supply)
		{
			// Calculate total output except this index.
			const totalOtherOutput = rates.reduce((sum, r, i) => (i !== index ? sum + r.amount : sum), 0);
			const available = supply.amount - totalOtherOutput;
			maxAmount = Math.max(0, Math.min(value.amount, available));
		}

		const newRate: ItemRate = {
			itemId: rates[index].itemId,
			amount: Math.round(maxAmount * 100) / 100, // Round to 2 decimal places
			per: value.per,
		};

		const newRates = [...rates];
		newRates[index] = newRate;

		updateNodeData(id, { rates: newRates });
	}

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
	}

	useEffect(() =>
	{
		// TODO: When the supply changes, ensure the output rates don't exceed the new supply.

		if (!rates?.length)
		{
			return;
		}

		const targetItemId = supply?.itemId || '';
		const needsUpdate = rates.some((rate) => rate.itemId !== targetItemId);

		if (!needsUpdate)
		{
			return;
		}

		const newRates = rates.map((rate) => ({
			...rate,
			itemId: targetItemId,
		}));

		updateNodeData(id, { rates: newRates });
		updateNodeInternals(id);
	}, [supply?.itemId, rates, id, updateNodeData, updateNodeInternals]);

	return (
		<BaseNode className="flex flex-col p-0">
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
					<LabeledHandle type="target" position={Position.Left} title="" />

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
