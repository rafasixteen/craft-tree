'use client';

import { Header } from '@/components/sidebar';
import { tagColumnns } from '@/components/tag';
import { useCurrentInventory } from '@/components/inventory';
import { DataTable, DataTableFilter, DataTablePagination, useDataTable } from '@/components/data-table';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

import { useTags } from '@/domain/inventory';

import Link from 'next/link';
import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { RefreshCw } from 'lucide-react';

export default function TagsPage()
{
	const inventory = useCurrentInventory();

	const { tags, isLoading, isValidating } = useTags({ inventoryId: inventory.id });

	const tableData = useMemo(() =>
	{
		return isLoading ? Array(16).fill({}) : (tags ?? []);
	}, [isLoading, tags]);

	const tableColumns = useMemo(() =>
	{
		if (isLoading)
		{
			return tagColumnns.map((column, index) => ({
				...column,
				cell: () => (
					<div className={cn('flex', index === tagColumnns.length - 1 ? 'justify-center' : 'justify-start')}>
						<Skeleton className="h-4 w-32" />
					</div>
				),
			}));
		}

		return tagColumnns;
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
						placeholder="Filter tags..."
						className="h-8 w-64"
					/>
					<Button variant="default" size="sm" className="h-8">
						<Link href={`/inventories/${inventory.id}/tags/add`}>Add Tag</Link>
					</Button>
				</div>
			</Header>
			<Card className="m-2 flex-1 bg-transparent p-0">
				<DataTable table={table} />
			</Card>
			<div className="relative">
				{isValidating && !isLoading && (
					<div className="absolute -top-16 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-lg border bg-background px-3 py-1.5 text-sm shadow-md">
						<RefreshCw className="size-3.5 animate-spin text-muted-foreground" />
						<span className="text-muted-foreground">Syncing tags...</span>
					</div>
				)}
				<DataTablePagination table={table} />
			</div>
		</>
	);
}
