'use client';

import { Header } from '@/components/sidebar';
import { ImportInventoryButton, inventoryColumnns } from '@/components/inventory';
import { DataTable, DataTableFilter, DataTablePagination, useDataTable } from '@/components/data-table';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { useInventories } from '@/domain/inventory';

import Link from 'next/link';
import { useUser } from '@/domain/user';
import { Skeleton } from '@/components/ui/skeleton';
import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { RefreshCw } from 'lucide-react';

export default function InventoriesPage()
{
	const user = useUser();
	const { inventories, isValidating, isLoading } = useInventories({ userId: user?.id });

	const tableData = useMemo(() =>
	{
		return isLoading ? Array(8).fill({}) : (inventories ?? []);
	}, [isLoading, inventories]);

	const tableColumns = useMemo(() =>
	{
		if (isLoading)
		{
			return inventoryColumnns.map((col, index) => ({
				...col,
				cell: () => (
					<div className={cn('flex', index === inventoryColumnns.length - 1 && 'justify-center')}>
						<Skeleton className="h-4 w-32" />
					</div>
				),
			}));
		}

		return inventoryColumnns;
	}, [isLoading]);

	const table = useDataTable({
		data: tableData,
		columns: tableColumns,
	});

	return (
		<>
			<Header>
				<div className="flex items-center space-x-2">
					<DataTableFilter
						table={table}
						filterKey="name"
						type="search"
						placeholder="Filter inventories..."
						className="h-8 w-64"
					/>
					<Button variant="default" size="sm" className="h-8">
						<Link href="/inventories/create">Create Inventory</Link>
					</Button>
					<ImportInventoryButton />
				</div>
			</Header>
			<Card className="m-2 flex-1 bg-transparent p-0">
				<DataTable table={table} />
			</Card>
			<div className="relative">
				{isValidating && !isLoading && (
					<div className="absolute -top-16 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-lg border bg-background px-3 py-1.5 text-sm shadow-md">
						<RefreshCw className="size-3.5 animate-spin text-muted-foreground" />
						<span className="text-muted-foreground">Syncing inventories...</span>
					</div>
				)}
				<DataTablePagination table={table} />
			</div>
		</>
	);
}
