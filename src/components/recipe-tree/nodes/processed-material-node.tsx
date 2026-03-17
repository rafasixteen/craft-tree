import { NodeProps, Handle, Position, Node } from '@xyflow/react';
import { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { useRecipeTree } from '@/domain/recipe-tree';
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react';
import { Producer } from '@/domain/producer';
import { BaseNode, BaseNodeFooter } from '@/components/base-node';
import { RecipeTreeNodeContent, RecipeTreeNodeHeader } from '@/components/recipe-tree';

export function ProcessedMaterialNode({ id }: NodeProps)
{
	const { recipeTree } = useRecipeTree();

	if (!recipeTree)
	{
		return null;
	}

	const { producers, selectedProducerId } = recipeTree.nodes[id];

	const selectedProducerIndex = producers.findIndex((p) => p.id === selectedProducerId);
	const isRootNode = recipeTree.rootNodeId === id;

	return (
		<BaseNode className="w-65">
			{!isRootNode && <Handle type="target" position={Position.Top} />}
			<RecipeTreeNodeHeader nodeId={id} />
			<RecipeTreeNodeContent nodeId={id} />
			<BaseNodeFooter className="p-2">
				<ProducerCarousel nodeId={id} producers={producers} selectedProducerIndex={selectedProducerIndex} />
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
