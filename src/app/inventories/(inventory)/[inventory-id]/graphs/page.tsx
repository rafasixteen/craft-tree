'use client';

import { Header } from '@/components/sidebar';
import { graphColumnns as graphColumnns } from '@/components/graph';
import { DataTable, DataTableFilter, DataTablePagination, useDataTable } from '@/components/data-table';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

import { useGraphs } from '@/domain/inventory';

import Link from 'next/link';
import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { RefreshCw } from 'lucide-react';
import { getInventoryHref } from '@/lib/navigation';
import { useParams } from 'next/navigation';

export default function GraphsPage()
{
	const params = useParams();

	const inventoryId = params['inventory-id'] as string;

	const { graphs, isLoading, isValidating } = useGraphs({ inventoryId });

	const tableData = useMemo(() =>
	{
		return isLoading ? Array(8).fill({}) : (graphs ?? []);
	}, [isLoading, graphs]);

	const tableColumns = useMemo(() =>
	{
		if (isLoading)
		{
			return graphColumnns.map((column, index) => ({
				...column,
				cell: () => (
					<div
						className={cn('flex', index === graphColumnns.length - 1 ? 'justify-center' : 'justify-start')}
					>
						<Skeleton className="h-4 w-32" />
					</div>
				),
			}));
		}

		return graphColumnns;
	}, [isLoading]);

	const table = useDataTable({
		columns: tableColumns,
		data: tableData,
	});

	return (
		<>
			<Header>
				<div className="flex items-center space-x-2">
					<DataTableFilter
						table={table}
						filterKey="name"
						type="search"
						placeholder="Filter graphs..."
						className="h-8 w-64"
					/>
					<Button variant="default" size="sm" className="h-8">
						<Link href={getInventoryHref({ inventoryId, path: ['graphs', 'add'] })}>Add Graph</Link>
					</Button>
				</div>
			</Header>
			<Card className="m-2 flex-1 bg-transparent p-0">
				<DataTable table={table} />
			</Card>
			<div className="relative">
				{isValidating && !isLoading && (
					<div className="absolute -top-16 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-lg border bg-background px-3 py-1.5 text-sm shadow-md">
						<RefreshCw className="size-3.5 animate-spin text-muted-foreground" />
						<span className="text-muted-foreground">Syncing graphs...</span>
					</div>
				)}
				<DataTablePagination table={table} />
			</div>
		</>
	);
}
