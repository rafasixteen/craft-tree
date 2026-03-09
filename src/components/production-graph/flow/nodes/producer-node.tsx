'use client';

import { ProducerGraphNode, ProducerNodeData } from '@/components/production-graph/flow/types';
import { useProducerInputs } from '@/components/production-graph/flow/hooks';
import { Edge, useReactFlow, Node, Position, useUpdateNodeInternals, NodeProps } from '@xyflow/react';
import { useCurrentInventory } from '@/components/inventory';
import { Item, useItems } from '@/domain/item';
import { LabeledHandle } from '@/components/labeled-handle';
import { BaseNode, BaseNodeContent, BaseNodeFooter, BaseNodeHeader } from '@/components/base-node';
import { convertProductionRate, ProductionRate, TimeUnit } from '@/domain/production-graph';
import { Input } from '@/components/ui/input';
import { memo, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react';
import { ItemCombobox } from '@/components/item';
import { cn, formatNumber } from '@/lib/utils';
import { getProducersByOutputItem, Producer, useProducersByOutputItem, useProducerInputsV2, useProducerOutputsV2, useProducerV2 } from '@/domain/producer';

export const ProducerNode = memo(function ProducerNode({ id, data, selected }: NodeProps<ProducerGraphNode>)
{
	const { updateNodeData } = useReactFlow<Node<ProducerNodeData>, Edge>();
	const updateNodeInternals = useUpdateNodeInternals();

	const invetory = useCurrentInventory();

	const { items } = useItems({ inventoryId: invetory.id });

	const { itemId, producerId, producerCount, outputRates } = data;

	const producer = useProducerV2(producerId);
	const inputs = useProducerInputsV2(producerId);
	const outputs = useProducerOutputsV2(producerId);

	const inputRates = useProducerInputs();

	const onItemComboboxChange = useCallback(
		function onItemComboboxChange(itemId: string | null)
		{
			if (!itemId)
			{
				updateNodeData(id, {
					itemId: null,
					producerId: null,
				});
			}
			else
			{
				getProducersByOutputItem({ itemId: itemId }).then((producers) =>
				{
					if (producers.length === 0)
					{
						updateNodeData(id, {
							itemId: itemId,
							producerId: null,
						});
					}
					else
					{
						const index = 0;
						const producerId = producers[index].id;

						updateNodeData(id, {
							itemId: itemId,
							producerId: producerId,
						});
					}
				});
			}
		},
		[id, updateNodeData],
	);

	const onProducerCountChange = useCallback(
		function onProducerCountChange(newCount: number)
		{
			updateNodeData(id, { producerCount: newCount });
		},
		[id, updateNodeData],
	);

	const getItemName = useCallback(
		function getItemName(itemId: string)
		{
			const item = items.find((i) => i.id === itemId);
			return item ? item.name : 'Unknown Item';
		},
		[items],
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

		updateNodeData(id, {
			outputRates: outputRates,
		});
	}, [inputRates, producerCount]);

	useEffect(() =>
	{
		updateNodeInternals(id);
	}, [inputs, outputs, id]);

	return (
		<BaseNode className={cn('flex flex-col p-0', selected && 'ring-2 ring-primary')}>
			<BaseNodeHeader className="flex flex-col border-b p-3">
				<div className="flex w-full items-start justify-between gap-2">
					<ItemCombobox items={items} value={itemId ?? null} onChange={onItemComboboxChange} className="nodrag w-[70%]" />
					<Input type="number" min={1} value={producerCount} onChange={(e) => onProducerCountChange(Number(e.target.value))} className="nodrag w-[30%]" />
				</div>
				<div className="flex w-full min-w-0 flex-row items-center justify-between gap-2">
					<p className="truncate px-1 text-xs text-muted-foreground">{producer ? producer.name : 'Select a producer'}</p>
				</div>
			</BaseNodeHeader>
			{producer && inputs && outputs && (
				<BaseNodeContent className="flex flex-row justify-between p-0 py-3">
					{/* Inputs */}
					<div className="flex flex-col justify-center gap-3">
						{inputs?.map((input, index) =>
						{
							const inputRate = {
								amount: (input.quantity / producer.time) * producerCount,
								per: 'second',
							};
							const title = `${getItemName(input.itemId)}: ${formatNumber(inputRate.amount, 3)}/${inputRate.per.charAt(0)}`;
							return <LabeledHandle key={index} id={input.itemId} type="target" position={Position.Left} title={title} labelClassName="text-xs" />;
						})}
					</div>

					{/* Outputs */}
					<div className="flex flex-col justify-center gap-3">
						{outputs?.map((output, index) =>
						{
							const outputRate = outputRates?.find((r) => r.itemId === output.itemId);

							const title = outputRate
								? `${getItemName(output.itemId)}: ${formatNumber(outputRate.amount, 3)}/${outputRate.per.charAt(0)}`
								: `${getItemName(output.itemId)}: ${0}/${'s'}`;

							return <LabeledHandle key={index} id={output.itemId} type="source" position={Position.Right} title={title} labelClassName="text-xs" />;
						})}
					</div>
				</BaseNodeContent>
			)}
			{itemId && (
				<BaseNodeFooter className="m-0 flex-col border-t p-1">
					<ProducerCarousel nodeId={id} itemId={itemId} producerId={producerId}></ProducerCarousel>
				</BaseNodeFooter>
			)}
		</BaseNode>
	);
});

interface ProducerCarouselProps
{
	nodeId: Node['id'];
	itemId: Item['id'] | null;
	producerId: Producer['id'] | null;
}

function ProducerCarousel({ nodeId, itemId, producerId }: ProducerCarouselProps)
{
	const { updateNodeData } = useReactFlow<Node<ProducerNodeData>, Edge>();

	const { producers } = useProducersByOutputItem(itemId);

	const selectedProducerIndex = producerId ? producers.findIndex((p) => p.id === producerId) : 0;

	const changeRecipe = useCallback(
		function changeRecipe(delta: number)
		{
			const length = producers.length;
			const newIndex = (((selectedProducerIndex + delta) % length) + length) % length;

			const producer = producers[newIndex];

			if (producer)
			{
				updateNodeData(nodeId, {
					producerId: producer.id,
				});
			}
		},
		[nodeId, selectedProducerIndex, producers, updateNodeData],
	);

	const previousRecipe = useCallback(
		function previousRecipe()
		{
			changeRecipe(-1);
		},
		[changeRecipe],
	);

	const nextRecipe = useCallback(
		function nextRecipe()
		{
			changeRecipe(+1);
		},
		[changeRecipe],
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
