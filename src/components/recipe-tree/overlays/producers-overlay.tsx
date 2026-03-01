'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getRequiredProducers, RecipeTreeState, useRecipeTree } from '@/domain/recipe-tree';
import { formatNumber } from '@/lib/utils';
import { Panel } from '@xyflow/react';

function getTotalProducers(recipeTree: RecipeTreeState)
{
	// TODO: Move this function to the util folder.

	const totals = new Map();

	for (const node of Object.values(recipeTree.nodes))
	{
		if (!node.selectedProducerId)
		{
			continue;
		}

		const producer = node.producers.find((p) => p.id === node.selectedProducerId);

		if (!producer)
		{
			continue;
		}

		const count = getRequiredProducers(recipeTree, node.id);

		if (totals.has(producer.id))
		{
			totals.get(producer.id).count += count;
		}
		else
		{
			totals.set(producer.id, { producer, count });
		}
	}

	return Array.from(totals.values()).sort((a, b) => a.producer.name.localeCompare(b.producer.name));
}

export function ProducersOverlay(props: React.ComponentProps<typeof Panel>)
{
	const { recipeTree } = useRecipeTree();

	if (!recipeTree)
	{
		return null;
	}

	const totalProducers = getTotalProducers(recipeTree);

	return (
		<Panel {...props}>
			<Card>
				<CardHeader className="border-b">
					<CardTitle>Total Producers Needed</CardTitle>
				</CardHeader>
				<CardContent>
					<ul className="space-y-1">
						{totalProducers.map(({ producer, count }) => (
							<li key={producer.id} className="flex items-center gap-2">
								<p className="text-xs">
									<span className="font-semibold">{producer.name}: &nbsp;</span>
									<span className="font-medium text-primary">{formatNumber(count)}</span>
								</p>
							</li>
						))}
					</ul>
				</CardContent>
			</Card>
		</Panel>
	);
}
