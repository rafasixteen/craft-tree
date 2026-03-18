'use client';

import { Header } from '@/components/sidebar';
import { useCurrentInventory } from '@/components/inventory';
import { productionGraphColumnns } from '@/components/production-graph';
import { DataTable, DataTableFilter, DataTablePagination, useDataTable } from '@/components/data-table';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { useProductionGraphs } from '@/domain/production-graph';

import Link from 'next/link';

export default function ProductionGraphsPage()
{
	const inventory = useCurrentInventory();

	const { productionGraphs } = useProductionGraphs({
		inventoryId: inventory.id,
	});

	const table = useDataTable({
		columns: productionGraphColumnns,
		data: productionGraphs,
	});

	return (
		<>
			<Header>
				<div className="flex items-center space-x-2">
					<DataTableFilter
						table={table}
						filterKey="name"
						type="search"
						placeholder="Filter production graphs..."
						className="h-8 w-64"
					/>
					<Button variant="default" size="sm" className="h-8">
						<Link href={`/inventories/${inventory.id}/production-graphs/add`}>Add Production Graph</Link>
					</Button>
				</div>
			</Header>
			<Card className="m-2 flex-1 bg-transparent p-0">
				<DataTable table={table} />
			</Card>
			<DataTablePagination table={table} />
		</>
	);
}
