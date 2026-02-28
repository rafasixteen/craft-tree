'use client';

import { ProducerGraphNode, ProducerNodeData } from '@/components/production-graph/types';
import { useProducerInputs } from '@/components/production-graph/hooks';
import { Edge, useReactFlow, Node, Position, useUpdateNodeInternals, NodeProps } from '@xyflow/react';
import { getProducersByOutputItem, Producer, ProducerInput, ProducerOutput, useProducerInputsV2, useProducerOutputsV2, useProducerV2 } from '@/domain/producer';
import { useInventory } from '@/components/inventory';
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
import { formatNumber } from '@/lib/utils';

export function ProducerNode({ id, data }: NodeProps<ProducerGraphNode>)
{
	const { updateNodeData } = useReactFlow<Node<ProducerNodeData>, Edge>();
	const updateNodeInternals = useUpdateNodeInternals();

	const invetory = useInventory();

	const { items } = useItems({ inventoryId: invetory.id });

	const { itemId, producerId, producerCount, extraInfo, selectedProducerIndex } = data;

	const { producer } = useProducerV2(producerId);
	const { inputs } = useProducerInputsV2(producerId);
	const { outputs } = useProducerOutputsV2(producerId);

	const inputRates = useProducerInputs();

	const onItemComboboxChange = useCallback(
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
			}
			else
			{
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
		},
		[updateNodeData, updateNodeInternals, id],
	);

	const onProducerCountChange = useCallback(
		function onProducerCountChange(newCount: number)
		{
			updateNodeData(id, { producerCount: newCount });
		},
		[updateNodeData, id],
	);

	const getItemName = useCallback(
		function getItemName(itemId: string)
		{
			const item = items.find((i) => i.id === itemId);
			return item ? item.name : 'Unknown Item';
		},
		[items],
	);

	const toggleExtraInfo = useCallback(
		function toggleExtraInfo()
		{
			updateNodeData(id, { extraInfo: !extraInfo });
		},
		[updateNodeData, id, extraInfo],
	);

	useEffect(() =>
	{
		updateNodeData(id, {
			inputRates: inputRates,
		});

		if (!inputs || !outputs || !producer)
		{
			return;
		}

		// Build rate lookup
		const rateMap = new Map<string, number>();

		for (const itemRate of inputRates)
		{
			const rate: ProductionRate = {
				amount: itemRate.amount,
				per: itemRate.per,
			};

			const converted = convertProductionRate(rate, 'second');
			rateMap.set(itemRate.itemId, converted.amount);
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
			amount: output.quantity * actualCycles,
			per: 'second' as TimeUnit,
		}));

		updateNodeData(id, { outputRates });
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
				<BaseNodeFooter className="m-0 flex-col border-t p-1">
					<ProducerCarousel nodeId={id} itemId={itemId} producerId={producerId} producerIndex={selectedProducerIndex ?? 0}></ProducerCarousel>
				</BaseNodeFooter>
			)}
			{extraInfo && producer && inputs && outputs && (
				<NodeAppendix position="bottom" className="flex gap-5 p-2 py-3 text-xs text-muted-foreground">
					<MaximumThroughputDisplay inputs={inputs} outputs={outputs} producer={producer} producerCount={producerCount} getItemName={getItemName} />
					<ActualThroughputDisplay
						inputs={inputs}
						outputs={outputs}
						producer={producer}
						producerCount={producerCount}
						inputRates={inputRates}
						getItemName={getItemName}
					/>
					<InputOverflowDisplay inputs={inputs} outputs={outputs} producer={producer} producerCount={producerCount} inputRates={inputRates} getItemName={getItemName} />
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

interface ActualThroughputDisplayProps
{
	inputs: ProducerInput[];
	outputs: ProducerOutput[];
	producer: Producer;
	producerCount: number;
	inputRates: ItemRate[];
	getItemName: (itemId: string) => string;
}

function ActualThroughputDisplay({ inputs, outputs, producer, producerCount, inputRates, getItemName }: ActualThroughputDisplayProps)
{
	const { actualInputRates, actualOutputRates } = calculateActualThroughput({ inputs, outputs, producer, producerCount, inputRates });

	return (
		<>
			<p className="mb-1 font-semibold">Actual Throughput</p>
			<div className="flex flex-row gap-4">
				<div className="flex flex-col justify-center gap-1">
					{actualInputRates.map((input: { itemId: string; amount: number }) => (
						<div key={input.itemId}>
							{getItemName(input.itemId)}: {formatNumber(input.amount, 3)}/s
						</div>
					))}
				</div>
				<div className="flex flex-col justify-center gap-1">
					{actualOutputRates.map((output: { itemId: string; amount: number }) => (
						<div key={output.itemId}>
							{getItemName(output.itemId)}: {formatNumber(output.amount, 3)}/s
						</div>
					))}
				</div>
			</div>
		</>
	);
}

interface MaximumThroughputDisplayProps
{
	inputs: { itemId: string; quantity: number }[];
	outputs: { itemId: string; quantity: number }[];
	producer: Producer;
	producerCount: number;
	getItemName: (itemId: string) => string;
}

function MaximumThroughputDisplay({ inputs, outputs, producer, producerCount, getItemName }: MaximumThroughputDisplayProps)
{
	const { maxInputRates, maxOutputRates } = calculateMaximumThroughput({ inputs, outputs, producer, producerCount });

	return (
		<>
			<p className="font-semibold">Maximum Throughput</p>
			<div className="flex flex-row gap-4">
				<div className="flex flex-col justify-center gap-1">
					{maxInputRates.map((input: { itemId: string; amount: number }) => (
						<div key={input.itemId}>
							{getItemName(input.itemId)}: {formatNumber(input.amount, 3)}/s
						</div>
					))}
				</div>
				<div className="flex flex-col justify-center gap-1">
					{maxOutputRates.map((output: { itemId: string; amount: number }) => (
						<div key={output.itemId}>
							{getItemName(output.itemId)}: {formatNumber(output.amount, 3)}/s
						</div>
					))}
				</div>
			</div>
		</>
	);
}

interface MaximumThroughputParameters
{
	inputs: { itemId: string; quantity: number }[];
	outputs: { itemId: string; quantity: number }[];
	producer: Producer;
	producerCount: number;
}

interface InputOverflowDisplayProps extends ActualThroughputParameters
{
	getItemName: (itemId: string) => string;
}

function InputOverflowDisplay({ inputs, outputs, producer, producerCount, inputRates, getItemName }: InputOverflowDisplayProps)
{
	const { actualInputRates } = calculateActualThroughput({ inputs, outputs, producer, producerCount, inputRates });
	const inputOverflow = calculateInputOverflow({ inputRates, actualInputRates: actualInputRates as ItemRate[] });

	return (
		<>
			<p className="font-semibold">Overflow</p>
			<div className="flex flex-col gap-1">
				{inputOverflow.map((overflow) => (
					<div key={overflow.itemId}>
						{getItemName(overflow.itemId)}: {formatNumber(overflow.amount, 3)}/s
					</div>
				))}
			</div>
		</>
	);
}

function calculateMaximumThroughput({ inputs, outputs, producer, producerCount }: MaximumThroughputParameters)
{
	const maxInputRates = inputs.map((input) => ({
		itemId: input.itemId,
		amount: (input.quantity / producer.time) * producerCount,
		per: 'second' as TimeUnit,
	}));

	const maxOutputRates = outputs.map((output) => ({
		itemId: output.itemId,
		amount: (output.quantity / producer.time) * producerCount,
		per: 'second' as TimeUnit,
	}));

	return {
		maxInputRates,
		maxOutputRates,
	};
}

interface ActualThroughputParameters
{
	inputs: ProducerInput[];
	outputs: ProducerOutput[];
	producer: Producer;
	producerCount: number;
	inputRates: ItemRate[];
}

function calculateActualThroughput({ inputs, outputs, producer, producerCount, inputRates }: ActualThroughputParameters)
{
	// Build rate lookup
	const rateMap = new Map();
	for (const itemRate of inputRates)
	{
		const rate = {
			amount: itemRate.amount,
			per: itemRate.per,
		};
		const converted = convertProductionRate(rate, 'second');
		rateMap.set(itemRate.itemId, converted.amount);
	}

	// Calculate supply-limited cycles/sec
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

	// Calculate machine-limited cycles/sec
	const singleMachineMax = 1 / producer.time;
	const machineLimitedCycles = producerCount * singleMachineMax;
	const actualCycles = Math.min(supplyLimitedCycles, machineLimitedCycles);

	// Calculate actual input rates
	const actualInputRates = inputs.map((input) => ({
		itemId: input.itemId,
		amount: input.quantity * actualCycles,
		per: 'second',
	}));

	// Calculate actual output rates
	const actualOutputRates = outputs.map((output) => ({
		itemId: output.itemId,
		amount: output.quantity * actualCycles,
		per: 'second',
	}));

	return {
		actualCycles,
		actualInputRates,
		actualOutputRates,
	};
}

interface InputOverflowParameters
{
	inputRates: ItemRate[];
	actualInputRates: ItemRate[];
}

function calculateInputOverflow({ inputRates, actualInputRates }: InputOverflowParameters): ItemRate[]
{
	return inputRates.map((rate) =>
	{
		const actualRate = actualInputRates.find((r) => r.itemId === rate.itemId);

		if (!actualRate)
		{
			throw new Error(`Missing actual rate for itemId ${rate.itemId}`);
		}

		const overflowAmount = Math.max(0, rate.amount - actualRate.amount);

		return {
			itemId: rate.itemId,
			amount: overflowAmount,
			per: 'second' as TimeUnit,
		};
	});
}
