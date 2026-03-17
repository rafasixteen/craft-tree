'use client';

import { LinkableName } from '@/components/linkable-name';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getBillOfMaterials, useRecipeTree } from '@/domain/recipe-tree';
import { getItemHref } from '@/lib/navigation';
import { Panel } from '@xyflow/react';
import React from 'react';

export function BillOfMaterialsOverlay(props: React.ComponentProps<typeof Panel>)
{
	const { recipeTree } = useRecipeTree();

	if (!recipeTree)
	{
		return null;
	}

	const bom = getBillOfMaterials(recipeTree);

	return (
		<Panel {...props}>
			<Card className="gap-0 p-0">
				<CardHeader className="border-b p-2!">
					<CardTitle className="text-center text-xs">Bill of Materials</CardTitle>
				</CardHeader>
				{/* TODO - Can we use "<ScrollArea>" here to get a nice scrollbar? */}
				<CardContent className="max-h-32 overflow-y-auto p-2">
					<ul className="space-y-1">
						{bom.map(({ item, amount }) => (
							<li key={item.id} className="flex items-center justify-between gap-4">
								<LinkableName name={item.name} href={getItemHref(item)} className="text-xs font-semibold" />
								<span className="rounded-md bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary">{amount}</span>
							</li>
						))}
					</ul>
				</CardContent>
			</Card>
		</Panel>
	);
}
