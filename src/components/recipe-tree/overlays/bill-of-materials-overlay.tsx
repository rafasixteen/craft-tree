'use client';

import { LinkableName } from '@/components/linkable-name';

import { Card, CardContent } from '@/components/ui/card';

import { getLeftovers, getMaterials, useRecipeTree } from '@/domain/recipe-tree';

import { getItemHref } from '@/lib/navigation';

import React from 'react';
import { Panel } from '@xyflow/react';

export function BillOfMaterialsOverlay(props: React.ComponentProps<typeof Panel>)
{
	const { recipeTree } = useRecipeTree();

	if (!recipeTree)
	{
		return null;
	}

	const materials = getMaterials(recipeTree);
	const leftovers = getLeftovers(recipeTree);

	return (
		<Panel {...props}>
			<Card className="gap-0 p-0">
				{/* TODO - Can we use "<ScrollArea>" here to get a nice scrollbar? */}
				<CardContent className="max-h-64 overflow-y-auto p-2">
					<div className="text-center text-xs font-semibold">Materials</div>
					<ul className="mt-2 space-y-1">
						{materials.map(({ item, amount }) => (
							<li key={item.id} className="flex items-center justify-between gap-4">
								<LinkableName
									name={item.name}
									href={getItemHref({ itemId: item.id, inventoryId: item.inventoryId })}
									className="text-xs font-semibold"
								/>
								<span className="rounded-md bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary">
									{amount}
								</span>
							</li>
						))}
					</ul>
					{leftovers.length > 0 && (
						<>
							<hr className="my-2" />
							<div className="text-center text-xs font-semibold">Leftovers</div>
							<ul className="mt-2 space-y-1">
								{leftovers.map(({ item, amount }) => (
									<li key={item.id} className="flex items-center justify-between gap-4">
										<LinkableName
											name={item.name}
											href={getItemHref({ itemId: item.id, inventoryId: item.inventoryId })}
											className="text-xs font-semibold"
										/>
										<span className="rounded-md bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary">
											{amount}
										</span>
									</li>
								))}
							</ul>
						</>
					)}
				</CardContent>
			</Card>
		</Panel>
	);
}
