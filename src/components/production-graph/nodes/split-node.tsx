'use client';

import { BaseNode, BaseNodeHeader, BaseNodeContent } from '@/components/base-node';
import { LabeledHandle } from '@/components/labeled-handle';
import { Button } from '@/components/ui/button';
import { NodeProps, Position, useNodeConnections, useReactFlow, useUpdateNodeInternals } from '@xyflow/react';
import { SplitGraphNode } from '@/components/production-graph/types';
import { PlusIcon, XIcon } from 'lucide-react';
import { ItemRate, ProductionRate } from '@/domain/production-graph';
import { ProductionRateComponent } from '@/components/production-graph/production-rate';
import { useSupply } from '@/components/production-graph/hooks';
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
		if (!rates || !supply) return;

		const updatedRates = redistributeRatesWithPriority(rates, index, value.amount, supply);

		updateNodeData(id, { rates: updatedRates });
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
		if (!rates?.length || !supply)
		{
			return;
		}

		let didChange = false;

		// 1️⃣ First ensure itemIds match supply
		const nextRates = rates.map((rate) =>
		{
			if (rate.itemId !== supply.itemId)
			{
				didChange = true;
				return { ...rate, itemId: supply.itemId };
			}
			return rate;
		});

		// 2️⃣ Then cap amounts to supply
		const cappedRates = capRatesToSupply(nextRates, supply);

		// Detect amount changes
		if (!didChange)
		{
			didChange = cappedRates.some((r, i) => r.amount !== rates[i].amount);
		}

		if (!didChange)
		{
			return;
		}

		updateNodeData(id, { rates: cappedRates });
		updateNodeInternals(id);
	}, [supply?.itemId, supply?.amount]);

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

function capRatesToSupply(rates: ItemRate[], supply: ItemRate | null): ItemRate[]
{
	if (!supply)
	{
		return rates;
	}

	let remaining = supply.amount;

	return rates.map((rate) =>
	{
		const cappedAmount = Math.max(0, Math.min(rate.amount, remaining));
		remaining -= cappedAmount;

		return {
			...rate,
			amount: cappedAmount,
		};
	});
}

function redistributeRatesWithPriority(rates: ItemRate[], editedIndex: number, newAmount: number, supply?: { amount: number }): ItemRate[]
{
	if (!supply) return rates;

	const totalSupply = supply.amount;

	// Clamp edited amount first
	const clampedEditedAmount = Math.max(0, Math.min(newAmount, totalSupply));

	// Calculate total of other outputs
	const otherTotal = rates.reduce((sum, r, i) => (i !== editedIndex ? sum + r.amount : sum), 0);

	const remaining = totalSupply - clampedEditedAmount;

	const nextRates = rates.map((rate, i) =>
	{
		if (i === editedIndex)
		{
			return { ...rate, amount: clampedEditedAmount };
		}

		if (otherTotal === 0)
		{
			return { ...rate, amount: 0 };
		}

		// Proportional redistribution
		const proportionalAmount = (rate.amount / otherTotal) * remaining;

		return {
			...rate,
			amount: Math.max(0, proportionalAmount),
		};
	});

	return nextRates;
}
