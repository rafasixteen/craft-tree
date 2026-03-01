'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getBillOfMaterials, useRecipeTree } from '@/domain/recipe-tree';
import { Panel } from '@xyflow/react';
import React, { useState } from 'react';
import { TimeUnit, convertProductionRate } from '@/domain/production-graph';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const UNIT_OPTIONS: { value: TimeUnit; label: string }[] = [
	{ value: 'second', label: 'Second' },
	{ value: 'minute', label: 'Minute' },
	{ value: 'hour', label: 'Hour' },
];

export function BillOfMaterialsOverlay(props: React.ComponentProps<typeof Panel>)
{
	const { recipeTree } = useRecipeTree();
	const [selectedUnit, setSelectedUnit] = useState<TimeUnit>('second');

	if (!recipeTree)
	{
		return null;
	}

	const bom = getBillOfMaterials(recipeTree);

	return (
		<Panel {...props}>
			<Card>
				<CardHeader className="border-b">
					<CardTitle>Bill of Materials</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="mb-2 flex items-center gap-2">
						<span className="text-xs font-medium">Time Unit:</span>
						<Select onValueChange={(value) => setSelectedUnit(value as TimeUnit)} value={selectedUnit}>
							<SelectTrigger className="w-24">
								<SelectValue placeholder="Select unit" />
							</SelectTrigger>
							<SelectContent className="[--radius:0.95rem]" position="popper">
								<SelectGroup>
									{UNIT_OPTIONS.map((unit) => (
										<SelectItem key={unit.value} value={unit.value}>
											{unit.value}
										</SelectItem>
									))}
								</SelectGroup>
							</SelectContent>
						</Select>
					</div>
					<ul className="space-y-1">
						{bom.map(({ item, demand }) =>
						{
							const converted = convertProductionRate(demand, selectedUnit);

							return (
								<li key={item.id} className="flex items-center gap-2">
									<p className="text-xs">
										<span className="font-semibold">{item.name}: &nbsp;</span>
										<span className="font-medium text-primary">
											{converted.amount.toFixed(2)}/{converted.per.charAt(0)}
										</span>
									</p>
								</li>
							);
						})}
					</ul>
				</CardContent>
			</Card>
		</Panel>
	);
}
