import {
	getNodeTime,
	getResolvedQuantity,
	useRecipeTree,
} from '@/domain/recipe-tree';
import { formatNumber } from '@/lib/utils';
import { ClockIcon, PackageIcon } from 'lucide-react';

interface RecipeTreeNodeContentProps
{
	nodeId: string;
}

export function RecipeTreeNodeContent({ nodeId }: RecipeTreeNodeContentProps)
{
	const { recipeTree } = useRecipeTree();
	const { item, producers, producerOutputs, selectedProducerId } =
		recipeTree!.nodes[nodeId];

	const selectedProducer = producers.find((p) => p.id === selectedProducerId);
	const output = selectedProducerId
		? producerOutputs[selectedProducerId].find((o) => o.itemId === item.id)
		: undefined;

	const quantity = getResolvedQuantity(recipeTree!, nodeId);
	const time = selectedProducerId ? getNodeTime(recipeTree!, nodeId) : 0;

	return (
		<div className="grid grid-cols-2 gap-x-4 px-3 py-2 text-xs">
			{/* Column headers */}
			<span className="mb-1">Each</span>
			<span className="mb-1">Total</span>

			{/* Quantity row */}
			<div className="flex items-center gap-1 text-muted-foreground">
				<PackageIcon className="size-3" />
				<span>{output?.quantity ?? '—'}x</span>
			</div>
			<div className="flex items-center gap-1 text-muted-foreground">
				<PackageIcon className="size-3" />
				<span>{Math.ceil(quantity)}x</span>
			</div>

			{/* Time row */}
			{selectedProducerId && (
				<>
					<div className="flex items-center gap-1 text-muted-foreground">
						<ClockIcon className="size-3" />
						<span>{selectedProducer?.time ?? '—'}s</span>
					</div>
					<div className="flex items-center gap-1 text-muted-foreground">
						<ClockIcon className="size-3" />
						<span>{formatNumber(time)}s</span>
					</div>
				</>
			)}
		</div>
	);
}
