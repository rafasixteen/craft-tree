'use client';

import { Edge, Node, NodeProps, Position, useReactFlow, useUpdateNodeInternals } from '@xyflow/react';
import { InferNodeConfig, producerNodeDefinition, useNodeOutput } from '@/domain/graph-v2';
import { useParams } from 'next/navigation';
import { useItems } from '@/domain/inventory';
import { BaseNode, BaseNodeContent, BaseNodeFooter, BaseNodeHeader } from '@/components/base-node';
import { LabeledHandle } from '@/components/labeled-handle';
import { cn, formatNumber } from '@/lib/utils';
import { LinkableName } from '@/components/linkable-name';
import { getItemHref, getProducerHref } from '@/lib/navigation';
import {
	getProducersByOutputItem,
	Producer,
	ProducerInput,
	ProducerOutput,
	useProducer,
	useProducersByOutputItem,
} from '@/domain/producer';
import { Skeleton } from '@/components/ui/skeleton';
import { Item, useGetItemName } from '@/domain';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react';
import { useCallback, useEffect } from 'react';
import { ItemCombobox } from '@/components/item';
import { Input } from '@/components/ui/input';

type Config = NonNullable<InferNodeConfig<typeof producerNodeDefinition>>;

export function ProducerNode({ id, data, selected }: NodeProps<Node<Config>>)
{
	const params = useParams();

	const inventoryId = params['inventory-id'] as string;
	const { itemId, producerId, producerCount } = data;

	const updateNodeInternals = useUpdateNodeInternals();
	const { updateNodeData } = useReactFlow<Node, Edge>();

	const { items } = useItems({ inventoryId });
	const item = items?.find((i) => i.id === itemId);

	const { producer, inputs, outputs, isLoading } = useProducer({
		producerId: producerId ?? undefined,
		include: { inputs: true, outputs: true },
	});

	const onItemComboboxChange = useCallback(
		function onItemComboboxChange(itemId: string | null)
		{
			if (!itemId)
			{
				updateNodeData(id, {
					itemId: undefined,
					producerId: undefined,
				});
			}
			else
			{
				updateNodeData(id, {
					itemId: itemId,
					producerId: undefined,
				});

				// TODO: Why is this slow? It takes 6 seconds to return on my machine. Why??
				// NOTE: The getProducersByOutputItem takes less than 10 ms.

				getProducersByOutputItem({ itemId: itemId }).then((producers) =>
				{
					const producer = producers && producers.length > 0 ? producers[0] : null;

					updateNodeData(id, {
						producerId: producer?.id,
					});
				});
			}
		},
		[updateNodeData, id],
	);

	const onProducerCountChange = useCallback(
		function onProducerCountChange(newCount: number)
		{
			updateNodeData(id, {
				producerCount: newCount,
			});
		},
		[updateNodeData, id],
	);

	useEffect(() =>
	{
		updateNodeInternals(id);
	}, [inputs, outputs, id]);

	return (
		<BaseNode className={cn('flex flex-col p-0', selected && 'ring-2 ring-primary')}>
			<BaseNodeHeader className="flex items-center gap-2 border-b p-3">
				<div className="min-w-0 flex-col items-start gap-1.5">
					{item ? (
						<LinkableName
							name={`Producer Node - ${item.name}`}
							href={getItemHref({ inventoryId, itemId: item.id })}
							className="text-sm font-semibold"
						/>
					) : (
						<p>Producer Node</p>
					)}
					{producer && (
						<LinkableName
							name={producer.name}
							href={getProducerHref({ inventoryId, producerId: producer.id })}
							className="text-xs text-muted-foreground"
						/>
					)}
				</div>
			</BaseNodeHeader>
			<BaseNodeContent className="flex flex-col justify-between p-0 py-3">
				<div className="flex w-full items-start justify-between gap-2 border-b p-2">
					<ItemCombobox
						items={items ?? []}
						value={itemId}
						onChange={onItemComboboxChange}
						className="nodrag w-[70%]"
					/>
					<Input
						type="number"
						min={1}
						value={producerCount}
						onChange={(e) => onProducerCountChange(Number(e.target.value))}
						className="nodrag w-[30%]"
					/>
				</div>
				{isLoading ? (
					<div className="flex h-full flex-row items-center justify-between">
						<SkeletonProducerPorts className="pl-3" />
						<SkeletonProducerPorts className="pr-3" />
					</div>
				) : producer && inputs && outputs ? (
					<div className="flex h-full flex-row items-center justify-between">
						<ProducerPorts ports={inputs} producer={producer} producerCount={producerCount} type="input" />
						<ProducerPorts
							ports={outputs}
							producer={producer}
							producerCount={producerCount}
							type="output"
						/>
					</div>
				) : null}
			</BaseNodeContent>
			<BaseNodeFooter className="m-0 flex-col border-t p-1">
				<ProducerCarousel nodeId={id} itemId={itemId ?? undefined} producerId={producerId ?? undefined} />
			</BaseNodeFooter>
		</BaseNode>
	);
}

interface ProducerPortsProps
{
	ports: ProducerInput[] | ProducerOutput[];
	producer: Producer;
	producerCount: number;
	type: 'input' | 'output';
}

function ProducerPorts({ ports, producer, producerCount, type }: ProducerPortsProps)
{
	const params = useParams();

	const inventoryId = params['inventory-id'] as string;

	const handleType = type === 'input' ? 'target' : 'source';
	const position = type === 'input' ? Position.Left : Position.Right;

	const getItemName = useGetItemName({ inventoryId });

	return (
		<div className="flex flex-col justify-center gap-3">
			{ports.map((port, index) =>
			{
				const portRate = {
					amount: (port.quantity / producer.time) * producerCount,
					per: 'second',
				};

				const itemName = getItemName(port.itemId);
				const itemRate = `${formatNumber(portRate.amount, 3)}/${portRate.per.charAt(0)}`;

				return (
					<LabeledHandle
						key={index}
						id={port.itemId}
						type={handleType}
						position={position}
						title={`${itemName}: ${itemRate}`}
						labelClassName="text-xs"
					/>
				);
			})}
		</div>
	);
}

interface ProducerCarouselProps
{
	nodeId: Node['id'];
	itemId?: Item['id'];
	producerId?: Producer['id'];
}

function ProducerCarousel({ nodeId, itemId, producerId }: ProducerCarouselProps)
{
	const { updateNodeData } = useReactFlow<Node<Config>, Edge>();

	const { producers: rawProducers, isLoading } = useProducersByOutputItem({ itemId });

	const producers = rawProducers ?? [];
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
			<Button variant="ghost" onClick={previousRecipe} size="icon" className="nopan nodrag" disabled={isLoading}>
				<ArrowLeftIcon />
			</Button>
			{isLoading ? (
				<Skeleton className="h-3 w-10" />
			) : (
				<span className="flex items-center gap-1.5 text-xs text-muted-foreground">
					{selectedProducerIndex + 1} / {producers.length}
				</span>
			)}
			<Button variant="ghost" onClick={nextRecipe} size="icon" className="nopan nodrag" disabled={isLoading}>
				<ArrowRightIcon />
			</Button>
		</div>
	);
}

function SkeletonProducerPorts(props: React.HTMLAttributes<HTMLDivElement>)
{
	const { className, ...rest } = props;

	return (
		<div className={cn('flex flex-col justify-center gap-3', className)} {...rest}>
			{Array(2)
				.fill(null)
				.map((_, i) => (
					<Skeleton key={i} className="h-3 w-20" />
				))}
		</div>
	);
}
