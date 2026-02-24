'use client';

import { ProducerGraphNode, ProducerNodeData } from '@/components/production-graph/types';
import { useProducerInputs } from '@/components/production-graph/hooks';
import { Edge, useReactFlow, Node, Position, useUpdateNodeInternals, NodeProps } from '@xyflow/react';
import { getProducersByOutputItem, Producer, useProducerInputsV2, useProducerOutputsV2, useProducerV2 } from '@/domain/producer';
import { useActiveInventory } from '@/components/inventory';
import { Item, useItems } from '@/domain/item';
import { LabeledHandle } from '@/components/labeled-handle';
import { BaseNode, BaseNodeContent, BaseNodeFooter, BaseNodeHeader } from '@/components/base-node';
import { convertProductionRate, ItemRate, ProductionRate, TimeUnit } from '@/domain/production-graph';
import { NodeAppendix } from '@/components/node-appendix';
import { Input } from '@/components/ui/input';
import { useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon, ArrowRightIcon, InfoIcon } from 'lucide-react';
import { useProducersByOutputItem } from '@/domain/producer/hooks/use-producers-by-output-item';
import { ItemCombobox } from '@/components/item';

export function ProducerNode({ id, data }: NodeProps<ProducerGraphNode>)
{
	const { updateNodeData } = useReactFlow<Node<ProducerNodeData>, Edge>();
	const updateNodeInternals = useUpdateNodeInternals();

	const invetory = useActiveInventory();

	const { items } = useItems({ inventoryId: invetory.id });

	const { itemId, producerId, producerCount, extraInfo, selectedProducerIndex } = data;

	const { producer } = useProducerV2(producerId);
	const { inputs } = useProducerInputsV2(producerId);
	const { outputs } = useProducerOutputsV2(producerId);

	function onItemComboboxChange(itemId: string | null)
	{
		if (!itemId)
		{
			updateNodeData(id, {
				itemId: undefined,
				producerId: undefined,
				selectedProducerIndex: 0,
			});

			updateNodeInternals(id);

			return;
		}

		getProducersByOutputItem({ itemId: itemId }).then((producers) =>
		{
			const index = 0;
			const producerId = producers[index].id;

			updateNodeData(id, {
				itemId: itemId,
				producerId: producerId,
				selectedProducerIndex: index,
			});
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

	useEffect(() =>
	{
		updateNodeInternals(id);
	}, [inputs, outputs, id]);

	return (
		<BaseNode className="flex flex-col p-0">
			<BaseNodeHeader className="flex flex-col border-b">
				<div className="flex w-full items-start justify-between gap-2">
					<ItemCombobox items={items} value={itemId ?? null} onChange={onItemComboboxChange} className="nodrag flex-1" />

					<Button variant="ghost" size="icon" className="nodrag shrink-0" onClick={toggleExtraInfo}>
						<InfoIcon className="size-4" />
					</Button>
				</div>

				<Input type="number" min={1} value={producerCount} onChange={(e) => onProducerCountChange(Number(e.target.value))} className="nodrag" />
			</BaseNodeHeader>
			{inputs && outputs && (
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
			)}
			{itemId && (
				<BaseNodeFooter className="m-0 flex-col border-t">
					<ProducerCarousel nodeId={id} itemId={itemId} producerId={producerId} producerIndex={selectedProducerIndex ?? 0}></ProducerCarousel>
				</BaseNodeFooter>
			)}
			{extraInfo && producer && inputs && outputs && (
				<NodeAppendix position="bottom" className="flex flex-row justify-between p-2 py-3 text-xs text-muted-foreground">
					{/* Inputs */}
					<div className="flex flex-col gap-1">
						{inputs.map((input) =>
						{
							const rate: ProductionRate = {
								amount: (input.quantity / producer.time) * producerCount,
								per: 'second',
							};

							return (
								<div key={input.itemId}>
									{getItemName(input.itemId)}: {rate.amount.toFixed(2)}/{rate.per.charAt(0)}
								</div>
							);
						})}
					</div>

					{/* Outputs */}
					<div className="flex flex-col gap-1">
						{outputs.map((output) =>
						{
							const rate: ProductionRate = {
								amount: (output.quantity / producer.time) * producerCount,
								per: 'second',
							};

							return (
								<div key={output.itemId}>
									{getItemName(output.itemId)}: {rate.amount.toFixed(2)}/{rate.per.charAt(0)}
								</div>
							);
						})}
					</div>
				</NodeAppendix>
			)}
		</BaseNode>
	);
}

interface ProducerCarouselProps
{
	nodeId: Node['id'];
	itemId?: Item['id'];
	producerId?: Producer['id'];
	producerIndex: number;
}

function ProducerCarousel({ nodeId, itemId, producerId, producerIndex }: ProducerCarouselProps)
{
	const { updateNodeData } = useReactFlow<Node<ProducerNodeData>, Edge>();

	const { producers } = useProducersByOutputItem(itemId);

	const selectedProducerIndex = producerId ? producers.findIndex((p) => p.id === producerId) : producerIndex;

	const previousRecipe = useCallback(
		function previousRecipe()
		{
			const length = producers.length;
			const newIndex = (((selectedProducerIndex - 1) % length) + length) % length;

			updateNodeData(nodeId, {
				producerId: producers[newIndex]?.id ?? null,
				selectedProducerIndex: newIndex,
			});
		},
		[nodeId, updateNodeData, selectedProducerIndex, producers],
	);

	const nextRecipe = useCallback(
		function nextRecipe()
		{
			const length = producers.length;
			const newIndex = (((selectedProducerIndex + 1) % length) + length) % length;

			updateNodeData(nodeId, {
				producerId: producers[newIndex]?.id ?? null,
				selectedProducerIndex: newIndex,
			});
		},
		[nodeId, updateNodeData, selectedProducerIndex, producers],
	);

	return (
		<div className="flex w-full items-center justify-between">
			<Button variant="ghost" onClick={previousRecipe} size="icon" className="nopan nodrag">
				<ArrowLeftIcon />
			</Button>
			<span className="text-xs text-muted-foreground">
				{selectedProducerIndex + 1} / {producers.length}
			</span>
			<Button variant="ghost" onClick={nextRecipe} size="icon" className="nopan nodrag">
				<ArrowRightIcon />
			</Button>
		</div>
	);
}
