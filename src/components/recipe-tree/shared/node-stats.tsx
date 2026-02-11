import { RecipeTreeNode, useNodeStats, useSelectedRecipe } from '@/domain/recipe-tree';
import { PackageIcon, ClockIcon, FactoryIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { pluralize } from '@/lib/pluralizer';

interface NodeStatsProps
{
	nodeId: RecipeTreeNode['id'];
}

export function NodeStats({ nodeId }: NodeStatsProps)
{
	const { demand, producerCount, recipeThroughput } = useNodeStats(nodeId);
	const selectedRecipe = useSelectedRecipe(nodeId);

	const ceilProducerCount = producerCount !== undefined ? Math.ceil(producerCount) : undefined;

	return (
		<Card className="w-full border-none bg-muted/40 p-0 shadow-none">
			<CardContent className="flex flex-col gap-2 p-3 text-xs text-muted-foreground">
				<div className="flex items-center gap-2">
					<PackageIcon className="size-4 text-primary" />
					<span className="font-medium">Demand</span>
					<span className="ml-auto font-mono">
						{formatAmount(demand.amount)} / {demand.per}
					</span>
				</div>
				{recipeThroughput && (
					<>
						<Separator className="my-1" />
						<div className="flex items-center gap-2">
							<ClockIcon className="size-4 text-primary" />
							<span className="font-medium">Per Producer</span>
							<span className="ml-auto font-mono">
								{formatAmount(recipeThroughput.amount)} / {recipeThroughput.per}
							</span>
						</div>
					</>
				)}
				{producerCount !== undefined && (
					<>
						<Separator className="my-1" />
						<div className="flex items-center gap-2">
							<FactoryIcon className="size-4 text-primary" />
							<span className="text-xs">
								{ceilProducerCount}x {pluralize(selectedRecipe!.name, ceilProducerCount!)}
							</span>
						</div>
					</>
				)}
			</CardContent>
		</Card>
	);
}

function formatAmount(amount: number)
{
	return Number.isInteger(amount) ? amount.toString() : amount.toFixed(2);
}
