'use client';

import { ProducerGraphNode, ProducerNodeData } from '@/components/production-graph/types';
import { useProducerInputs } from '@/components/production-graph/hooks';
import { Edge, useReactFlow, Node, Position, useUpdateNodeInternals, NodeProps } from '@xyflow/react';
import { getProducerInputs, getProducerOutputs, useProducers } from '@/domain/producer';
import { useActiveInventory } from '@/components/inventory';
import { ProducerCombobox } from '@/components/producer';
import { useItems } from '@/domain/item';
import { LabeledHandle } from '@/components/labeled-handle';
import { BaseNode, BaseNodeContent, BaseNodeHeader } from '@/components/base-node';
import { convertProductionRate, ItemRate, ProductionRate, TimeUnit } from '@/domain/production-graph';
import { NodeAppendix } from '@/components/node-appendix';
import { Input } from '@/components/ui/input';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export function ProducerNode({ id, data }: NodeProps<ProducerGraphNode>)
{
	const { updateNodeData, getEdges, setEdges } = useReactFlow<Node<ProducerNodeData>, Edge>();
	const updateNodeInternals = useUpdateNodeInternals();

	const invetory = useActiveInventory();

	const { producers } = useProducers({ inventoryId: invetory.id });
	const { items } = useItems({ inventoryId: invetory.id });

	// TODO: Add a use producer inputs and outputs so we can rehydrate with db state.
	// This is to prevent the stale data when the db changes, which currently arent reflected
	// in node data.

	const { producer, inputs, outputs, producerCount, extraInfo } = data;

	function onComboboxChange(producerId: string | null)
	{
		// Remove only edges whose handle id (itemId) is no longer present in the new producer's inputs/outputs.
		const edges = getEdges();

		// If no producer is selected, remove all edges connected to this node.
		if (!producerId)
		{
			const filtered = edges.filter((e) => e.source !== id && e.target !== id);

			setEdges(filtered);

			updateNodeData(id, {
				producer: null,
				inputs: null,
				outputs: null,
			});

			return;
		}

		// Get new input/output itemIds for the selected producer
		const inputsPromise = getProducerInputs(producerId);
		const outputsPromise = getProducerOutputs(producerId);

		Promise.all([inputsPromise, outputsPromise]).then(([inputs, outputs]) =>
		{
			const inputItemIds = new Set(inputs.map((input) => input.itemId));
			const outputItemIds = new Set(outputs.map((output) => output.itemId));

			// Only keep edges that refer to itemIds still present in the new producer's inputs/outputs
			const filtered = edges.filter((e) =>
			{
				// If this node is the source, check if the sourceHandleId is still a valid output itemId
				if (e.source === id && e.sourceHandle)
				{
					return outputItemIds.has(e.sourceHandle);
				}

				// If this node is the target, check if the targetHandleId is still a valid input itemId
				if (e.target === id && e.targetHandle)
				{
					return inputItemIds.has(e.targetHandle);
				}

				// Otherwise, keep the edge
				return true;
			});

			setEdges(filtered);

			updateNodeData(id, {
				producer: producers.find((p) => p.id === producerId) ?? null,
				inputs: inputs,
				outputs: outputs,
			});

			updateNodeInternals(id);
		});
	}

	function getItemName(itemId: string)
	{
		const item = items.find((i) => i.id === itemId);
		return item ? item.name : 'Unknown Item';
	}

	function onChange(newRates: ItemRate[])
	{
		updateNodeData(id, {
			inputRates: newRates,
		});

		if (!inputs || !outputs || !producer)
		{
			return;
		}

		// Build rate lookup
		const rateMap = new Map<string, number>();

		for (const r of newRates)
		{
			const converted = convertProductionRate(r.rate, 'second');
			rateMap.set(r.itemId, converted.amount);
		}

		// ----------------------------
		// 1️⃣ Calculate supply-limited cycles/sec
		// ----------------------------
		let supplyLimitedCycles = Infinity;

		for (const input of inputs)
		{
			const suppliedPerSecond = rateMap.get(input.itemId);

			if (!suppliedPerSecond)
			{
				supplyLimitedCycles = 0;
				break;
			}

			const possibleCycles = suppliedPerSecond / input.quantity;

			supplyLimitedCycles = Math.min(supplyLimitedCycles, possibleCycles);
		}

		// ----------------------------
		// 2️⃣ Calculate machine-limited cycles/sec
		// ----------------------------
		const singleMachineMax = 1 / producer.time;
		const machineLimitedCycles = producerCount * singleMachineMax;

		// ----------------------------
		// 3️⃣ Final production rate
		// ----------------------------
		const actualCycles = Math.min(supplyLimitedCycles, machineLimitedCycles);

		if (actualCycles <= 0 || actualCycles === Infinity)
		{
			updateNodeData(id, { outputRates: null });
			return;
		}

		// ----------------------------
		// 4️⃣ Scale outputs
		// ----------------------------
		const outputRates = outputs.map((output) => ({
			itemId: output.itemId,
			rate: {
				amount: output.quantity * actualCycles,
				per: 'second' as TimeUnit,
			},
		}));

		updateNodeData(id, { outputRates });
	}

	function toggleExtraInfo()
	{
		updateNodeData(id, { extraInfo: !extraInfo });
	}

	function onProducerCountChange(newCount: number)
	{
		updateNodeData(id, { producerCount: newCount });
	}

	const inputRates = useProducerInputs();

	useEffect(() =>
	{
		onChange(inputRates);
	}, [inputRates, producerCount]);

	return (
		<BaseNode className="flex flex-col p-0">
			<BaseNodeHeader className="m-0 flex-col border-b">
				<ProducerCombobox producers={producers} value={producer?.id ?? null} onChange={onComboboxChange} className="nodrag w-full" />
				<Input type="number" min={1} value={producerCount} onChange={(e) => onProducerCountChange(Number(e.target.value))} className="nodrag w-16" />
				<Button variant="ghost" size="sm" className="nodrag w-full justify-start" onClick={toggleExtraInfo}>
					{extraInfo ? 'Hide' : 'Show'} Extra Info
				</Button>
			</BaseNodeHeader>
			<BaseNodeContent className="flex flex-row justify-between p-0 py-3">
				{/* Inputs */}
				<div className="flex flex-col justify-center gap-3">
					{inputs?.map((input, index) =>
					{
						const title = `x${input.quantity} ${getItemName(input.itemId)}`;
						return <LabeledHandle key={index} id={input.itemId} type="target" position={Position.Left} title={title} labelClassName="text-xs" />;
					})}
				</div>

				{/* Outputs */}
				<div className="flex flex-col justify-center gap-3">
					{outputs?.map((output, index) =>
					{
						const title = `x${output.quantity} ${getItemName(output.itemId)}`;
						return <LabeledHandle key={index} id={output.itemId} type="source" position={Position.Right} title={title} labelClassName="text-xs" />;
					})}
				</div>
			</BaseNodeContent>
			{extraInfo && (
				<NodeAppendix position="bottom" className="flex flex-row p-0 py-3 text-xs">
					<div className="flex flex-col gap-3">
						{inputs?.map((input) =>
						{
							const rate: ProductionRate = {
								amount: (input.quantity / producer!.time) * producerCount,
								per: 'second',
							};

							return (
								<div key={input.itemId}>
									{getItemName(input.itemId)}: {rate.amount.toFixed(2)}/{rate.per}
								</div>
							);
						})}
					</div>

					<div className="flex flex-col gap-3">
						{outputs?.map((output) =>
						{
							const rate: ProductionRate = {
								amount: (output.quantity / producer!.time) * producerCount,
								per: 'second',
							};

							return (
								<div key={output.itemId}>
									{getItemName(output.itemId)}: {rate.amount.toFixed(2)}/{rate.per}
								</div>
							);
						})}
					</div>
				</NodeAppendix>
			)}
		</BaseNode>
	);
}
