import { BaseNodeHeader } from '@/components/base-node';
import { LinkableName } from '@/components/linkable-name';
import { useRecipeTree } from '@/domain/recipe-tree';
import { getItemHref, getProducerHref } from '@/lib/navigation';

interface RecipeTreeNodeHeaderProps
{
	nodeId: string;
}

export function RecipeTreeNodeHeader({ nodeId }: RecipeTreeNodeHeaderProps)
{
	const { recipeTree } = useRecipeTree();
	const { item, producers, selectedProducerId } = recipeTree!.nodes[nodeId];

	const selectedProducer = producers.find((p) => p.id === selectedProducerId);

	return (
		<BaseNodeHeader className="flex items-center gap-2 border-b p-3">
			<div className="min-w-0">
				<LinkableName
					name={item.name}
					href={getItemHref(item)}
					className="text-sm font-semibold"
				/>
				{selectedProducer && (
					<LinkableName
						name={selectedProducer.name}
						href={getProducerHref(selectedProducer)}
						className="text-xs text-muted-foreground"
					/>
				)}
			</div>
		</BaseNodeHeader>
	);
}
