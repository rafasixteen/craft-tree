import { NodeProps, Handle, Position, Node } from '@xyflow/react';
import { useRecipeTree } from '@/domain/recipe-tree/hooks/use-recipe-tree';
import { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { useNodeDemand } from '@/domain/recipe-tree/hooks/use-node-demand';
import { useProducerCount } from '@/domain/recipe-tree/hooks/use-producer-count';
import { useSelectedProducerThroughput } from '@/domain/recipe-tree/hooks/use-selected-producer-throughput';
import { Card, CardContent } from '@/components/ui/card';
import { PackageIcon, ClockIcon, FactoryIcon, ArrowLeftIcon, ArrowRightIcon } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { formatNumber } from '@/lib/utils';
import { Producer } from '@/domain/producer';
import { BaseNode, BaseNodeContent, BaseNodeFooter, BaseNodeHeader } from '@/components/base-node';

export function ProcessedMaterialNode({ id }: NodeProps)
{
	const { recipeTree } = useRecipeTree();

	const demand = useNodeDemand(id);
	const producerCount = useProducerCount(id);
	const producerThroughput = useSelectedProducerThroughput(id);

	if (!recipeTree)
	{
		return null;
	}

	const node = recipeTree.nodes[id];

	if (!node)
	{
		return <div>Unknown node</div>;
	}

	const item = node.item;
	const producers = node.producers;
	const selectedProducerIndex = producers.findIndex((p) => p.id === node.selectedProducerId);
	const selectedProducer = producers[selectedProducerIndex];

	return (
		<BaseNode className="w-65">
			<Handle type="target" position={Position.Top} />
			<BaseNodeHeader className="flex items-center gap-2 border-b p-3">
				<div className="min-w-0">
					<p className="text-sm font-semibold">{item.name}</p>
					<p className="truncate text-xs text-muted-foreground">{selectedProducer ? selectedProducer.name : ''}</p>
				</div>
				<div className="ml-auto flex flex-col items-end gap-1 text-xs text-muted-foreground">
					<div className="flex items-center gap-1">
						<PackageIcon className="size-3" />
						<span>1x</span>
					</div>
					<div className="flex items-center gap-1">
						<ClockIcon className="size-3" />
						<span>{selectedProducer ? selectedProducer.time : '?'}s</span>
					</div>
				</div>
			</BaseNodeHeader>
			<BaseNodeContent className="flex gap-2 p-3 text-xs text-muted-foreground">
				<Card className="w-full border-none bg-muted/40 p-0 shadow-none">
					<CardContent className="flex flex-col gap-2 p-3 text-xs text-muted-foreground">
						<div className="flex items-center gap-2">
							<PackageIcon className="size-4 text-primary" />
							<span className="font-medium">Demand</span>
							<span className="ml-auto font-mono">
								{formatNumber(demand.amount)} / {demand.per}
							</span>
						</div>
						<Separator className="my-1" />
						<div className="flex items-center gap-2">
							<ClockIcon className="size-4 text-primary" />
							<span className="font-medium">Per Producer</span>
							<span className="ml-auto font-mono">
								{formatNumber(producerThroughput.amount)} / {producerThroughput.per}
							</span>
						</div>
						<Separator className="my-1" />
						<div className="flex items-center gap-2">
							<FactoryIcon className="size-4 text-primary" />
							<span className="font-medium">Producer Count</span>
							<span className="ml-auto font-mono">{formatNumber(producerCount)}</span>
						</div>
					</CardContent>
				</Card>
			</BaseNodeContent>
			<BaseNodeFooter className="p-2">
				<ProducerCarousel nodeId={node.id} producers={producers} selectedProducerIndex={selectedProducerIndex} />
			</BaseNodeFooter>
			<Handle type="source" position={Position.Bottom} />
		</BaseNode>
	);
}

interface ProducerCarouselProps
{
	nodeId: Node['id'];
	producers: Producer[];
	selectedProducerIndex: number;
}

function ProducerCarousel({ nodeId, producers, selectedProducerIndex }: ProducerCarouselProps)
{
	const { changeProducer } = useRecipeTree();

	const previousProducer = useCallback(() =>
	{
		changeProducer(nodeId, -1);
	}, [nodeId, changeProducer]);

	const nextProducer = useCallback(() =>
	{
		changeProducer(nodeId, 1);
	}, [nodeId, changeProducer]);

	return (
		<div className="flex w-full items-center justify-between px-2 pb-1">
			<Button variant="ghost" onClick={previousProducer} size="icon" className="nopan" disabled={producers.length < 2}>
				<ArrowLeftIcon className="size-4" aria-label="Previous producer" />
			</Button>
			<span className="text-xs text-muted-foreground">
				{selectedProducerIndex + 1} / {producers.length}
			</span>
			<Button variant="ghost" onClick={nextProducer} size="icon" className="nopan" disabled={producers.length < 2}>
				<ArrowRightIcon className="size-4" aria-label="Next producer" />
			</Button>
		</div>
	);
}
