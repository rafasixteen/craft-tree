'use client';

import { Header } from '@/components/sidebar';
import { tagColumnns } from '@/components/tag';
import { useCurrentInventory } from '@/components/inventory';
import { DataTable, DataTableFilter, DataTablePagination, useDataTable } from '@/components/data-table';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { useTags } from '@/domain/tag';

import Link from 'next/link';
import { useMemo } from 'react';

export default function TagsPage()
{
	const inventory = useCurrentInventory();

	const { tags } = useTags({ inventoryId: inventory.id });

	const tableData = useMemo(
		() =>
			tags.map((tag) => ({
				...tag,
			})),
		[tags, tags],
	);

	const table = useDataTable({
		columns: tagColumnns,
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
			<DataTablePagination table={table} />
		</>
	);
}
